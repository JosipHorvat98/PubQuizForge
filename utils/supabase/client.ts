// file: utils/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

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

// Single shared browser client for the whole tab. Components used to call
// createClient() individually, spawning a fresh Supabase instance (and another
// /auth/v1/user round-trip) per mounted component. One instance, one session.
let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
    if (!cachedClient) {
        cachedClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
    }

    return cachedClient;
}