// file: app/forgot-password/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function sendResetPasswordEmail(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    });

    if (error) {
        redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
    }

    redirect(
        "/forgot-password?message=Check your email for the password reset link"
    );
}