// file: app/signup/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account").trim() || "/account";

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${next.startsWith("/") ? next : "/account"}`
        }
    });

    if (error) {
        redirect(
            `/signup?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`
        );
    }

    redirect("/login?message=Check your email to confirm your account");
}