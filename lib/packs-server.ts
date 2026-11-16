// file: lib/packs-server.ts
import "server-only";
import { packs as basePacks, type Pack, type PackTier } from "@/data/site";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type PackOverride = {
    pack_id: string;
    tier: string | null;
    price: string | null;
    title: string | null;
    pdf_path: string | null;
    is_hidden: boolean;
    updated_at?: string | null;
};

const TIERS: PackTier[] = ["free", "bronze", "silver", "gold"];

function applyOverride(pack: Pack, override?: PackOverride): Pack {
    if (!override) {
        return pack;
    }

    const tier =
        override.tier && TIERS.includes(override.tier as PackTier)
            ? (override.tier as PackTier)
            : pack.tier;

    const price =
        override.price && override.price.trim()
            ? override.price.trim()
            : pack.price;

    const title =
        override.title && override.title.trim()
            ? override.title.trim()
            : pack.title;

    let pdfPath = pack.pdfPath ?? null;

    if (override.is_hidden) {
        pdfPath = null;
    } else if (
        override.pdf_path !== null &&
        override.pdf_path !== undefined &&
        override.pdf_path.trim()
    ) {
        pdfPath = override.pdf_path.trim();
    }

    return { ...pack, tier, price, title, pdfPath };
}

export async function getPackOverrides(): Promise<Map<string, PackOverride>> {
    const { data, error } = await supabaseAdmin
        .from("pack_overrides")
        .select("*");

    if (error) {
        // Table may not exist yet (run migration 004). Fall back to base data.
        return new Map();
    }

    return new Map(
        (data ?? []).map((row) => {
            const override = row as PackOverride;

            return [String(override.pack_id), override];
        })
    );
}

/** The catalog with admin overrides applied (server-side, authoritative). */
export async function getPacksMerged(): Promise<Pack[]> {
    const overrides = await getPackOverrides();

    return basePacks.map((pack) => applyOverride(pack, overrides.get(pack.id)));
}
