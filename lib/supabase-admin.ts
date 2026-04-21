// file: lib/supabase-admin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

export const supabaseAdmin = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);