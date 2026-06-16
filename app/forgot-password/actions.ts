// file: app/forgot-password/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function sendResetPasswordEmail(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const next = String(formData.get("next") ?? "/account").trim() || "/account";
    const safeNext = next.startsWith("/") ? next : "/account";

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?next=${encodeURIComponent(
            safeNext
        )}`
    });

    if (error) {
        redirect(
            `/forgot-password?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(
                safeNext
            )}`
        );
    }

    redirect(
        `/forgot-password?message=${encodeURIComponent(
            "Check your email for the password reset link"
        )}&next=${encodeURIComponent(safeNext)}`
    );
}