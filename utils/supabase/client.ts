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

export function createClient() {
    return createBrowserClient(supabaseUrl, supabasePublishableKey);
}