// file: app/login/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account").trim() || "/account";

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        redirect(
            `/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
        );
    }

    redirect(next.startsWith("/") ? next : "/account");
}