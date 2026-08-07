import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Blocks direct downloads of pack PDFs from the legacy public `public/packs/`
 * folder in production. PDFs are served privately through signed Storage URLs
 * instead (see lib/pack-files.ts). In development this still falls through so
 * local preview works before files have been moved to Storage.
 */
function blocksPublicPackPdf(request: NextRequest): boolean {
    const { pathname } = request.nextUrl;

    const isPdf = pathname.startsWith("/packs/") && pathname.endsWith(".pdf");
    const isProduction = process.env.NODE_ENV === "production";
    const allowFallback = process.env.ALLOW_PUBLIC_PDF_FALLBACK === "true";

    return isPdf && isProduction && !allowFallback;
}

export function middleware(request: NextRequest) {
    if (blocksPublicPackPdf(request)) {
        return new NextResponse("Not Found", { status: 404 });
    }

    return updateSession(request);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};