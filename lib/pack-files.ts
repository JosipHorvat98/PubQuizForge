// file: lib/pack-files.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { packs, type Pack } from "@/data/site";

/**
 * Secure pack-download layer.
 *
 * Pack PDFs are no longer served from `public/packs/`. Instead each PDF lives
 * in a PRIVATE Supabase Storage bucket and is handed out only as a short-lived,
 * signed URL generated on the server for an owner (purchaser / member).
 *
 * Policy:
 *  - Production: only signed Storage URLs are returned. If the object/bucket is
 *    unavailable, the download is refused (returns null) rather than leaking a
 *    public path.
 *  - Development: if Storage lookup fails, we fall back to the legacy
 *    `public/packs/...` path so local dev keeps working before uploads run.
 *    Optionally force the fallback in production with
 *    ALLOW_PUBLIC_PDF_FALLBACK=true (not recommended).
 */

const PACK_STORAGE_BUCKET = process.env.PACK_STORAGE_BUCKET || "pack-pdfs";
const SIGNED_URL_TTL_SECONDS = Number(process.env.PACK_SIGNED_URL_TTL_SECONDS) || 3600;

/** File name of the PDF inside the Storage bucket, derived from `pdfPath`. */
export function packPdfObjectName(pack: Pick<Pack, "pdfPath">): string | null {
    const pdfPath = pack.pdfPath;

    if (!pdfPath) {
        return null;
    }

    const basename = pdfPath.split("/").pop();

    return basename && basename.toLowerCase().endsWith(".pdf")
        ? basename
        : null;
}

/** Whether this pack ships a real PDF at all. */
export function packHasDownloadable(pack: Pack): boolean {
    return Boolean(packPdfObjectName(pack));
}

/** Whether a legacy public fs path may be handed out as a last resort. */
function allowPublicFallback(): boolean {
    return (
        process.env.NODE_ENV !== "production" ||
        process.env.ALLOW_PUBLIC_PDF_FALLBACK === "true"
    );
}

/**
 * Builds a short-lived signed URL for a pack's PDF from the private bucket.
 * Returns null when there is no PDF, the bucket lookup fails and public
 * fallback is disallowed, or the object does not exist.
 */
export async function createPackDownloadUrl(
    pack: Pack,
    options: { expiresIn?: number } = {}
): Promise<string | null> {
    const objectName = packPdfObjectName(pack);

    if (!objectName) {
        return null;
    }

    try {
        const { data, error } = await supabaseAdmin.storage
            .from(PACK_STORAGE_BUCKET)
            .createSignedUrl(
                objectName,
                options.expiresIn ?? SIGNED_URL_TTL_SECONDS
            );

        if (!error && data?.signedUrl) {
            return data.signedUrl;
        }
    } catch (error) {
        console.error("Unable to create signed pack URL:", error);
    }

    if (allowPublicFallback() && pack.pdfPath) {
        return pack.pdfPath;
    }

    return null;
}

/** Row shape used by the download-serving endpoints. */
export type DownloadItem = {
    pack_slug: string | null;
    download_url: string | null;
    type?: string;
};

/**
 * Replaces any stored URL on pack rows with a freshly signed URL for the
 * owning request. Non-pack rows (e.g. membership) are returned unchanged.
 */
export async function withSignedDownloadUrls<T extends DownloadItem>(
    rows: T[]
): Promise<T[]> {
    return Promise.all(
        rows.map(async (row) => {
            if (row.type !== "pack" || !row.pack_slug) {
                return row;
            }

            const pack = packs.find(
                (candidate) => candidate.id === row.pack_slug
            );

            if (!pack) {
                return row;
            }

            const signed = await createPackDownloadUrl(pack);

            return { ...row, download_url: signed };
        })
    );
}

