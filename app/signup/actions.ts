// file: app/signup/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signup(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/account").trim() || "/account";
    const safeNext = next.startsWith("/") ? next : "/account";

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${safeNext}`
        }
    });

    if (error) {
        redirect(
            `/signup?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(safeNext)}`
        );
    }

    redirect(
        `/login?message=${encodeURIComponent(
            "If this email is available for signup, we sent a confirmation email. If you already have an account, sign in or reset your password."
        )}&next=${encodeURIComponent(safeNext)}`
    );
}