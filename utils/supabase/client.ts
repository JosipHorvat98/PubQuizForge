import { createBrowserClient } from "@supabase/ssr";

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name}`);
    }
    return value;
}

export function createClient() {
    return createBrowserClient(
        getEnv("NEXT_PUBLIC_SUPABASE_URL"),
        getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
    );
}