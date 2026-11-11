// file: lib/unsubscribe.ts
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://pubquizforge.com";

/**
 * Secret used to sign unsubscribe links. Falls back to the service-role key so
 * this works out of the box; set NEWSLETTER_UNSUBSCRIBE_SECRET to decouple it.
 */
function unsubscribeSecret(): string {
    return (
        process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        "pubquizforge-unsubscribe"
    );
}

export function unsubscribeToken(email: string): string {
    return createHmac("sha256", unsubscribeSecret())
        .update(email.trim().toLowerCase())
        .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
    const expected = unsubscribeToken(email);
    const a = Buffer.from(expected);
    const b = Buffer.from(token);

    return a.length === b.length && timingSafeEqual(a, b);
}

/** Signed, per-recipient unsubscribe URL that needs no login. */
export function unsubscribeUrl(email: string): string {
    const normalized = email.trim().toLowerCase();
    const params = new URLSearchParams({
        email: normalized,
        token: unsubscribeToken(normalized)
    });

    return `${SITE_URL}/api/newsletter/unsubscribe?${params.toString()}`;
}
