// file: utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const envSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envSupabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!envSupabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!envSupabasePublishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

const supabaseUrl: string = envSupabaseUrl;
const supabasePublishableKey: string = envSupabasePublishableKey;

export function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers
        }
    });

    // Supabase's session is stored in a cookie named `sb-<ref>-auth-token`.
    // Only validate/refresh the session when such a cookie is actually present.
    // Calling `getUser()` here for every request (including anonymous visitors
    // and public pages) triggered a flood of `/auth/v1/user` calls because Next.js
    // prefetches all visible <Link> routes through the middleware.
    const hasSessionCookie = request.cookies
        .getAll()
        .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });

                response = NextResponse.next({
                    request
                });

                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            }
        }
    });

    if (hasSessionCookie) {
        void supabase.auth.getUser();
    }

    return response;
}