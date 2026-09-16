// file: lib/session-cookie.ts
import "server-only";
import { cookies } from "next/headers";

/**
 * Whether the request carries a Supabase session cookie. Use this as a cheap
 * gate so anonymous visitors never trigger an auth round-trip on API routes
 * that only need the current user's identity.
 */
export async function hasSessionCookie(): Promise<boolean> {
    const cookieStore = await cookies();

    return cookieStore
        .getAll()
        .some(
            (cookie) =>
                cookie.name.startsWith("sb-") &&
                cookie.name.includes("auth-token") &&
                Boolean(cookie.value)
        );
}