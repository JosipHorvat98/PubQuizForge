// file: app/reset-password/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const next = String(formData.get("next") ?? "/account").trim() || "/account";
    const safeNext = next.startsWith("/") ? next : "/account";

    if (password.length < 6) {
        redirect(
            `/reset-password?error=${encodeURIComponent(
                "Password must be at least 6 characters"
            )}&next=${encodeURIComponent(safeNext)}`
        );
    }

    if (password !== confirmPassword) {
        redirect(
            `/reset-password?error=${encodeURIComponent(
                "Passwords do not match"
            )}&next=${encodeURIComponent(safeNext)}`
        );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password
    });

    if (error) {
        redirect(
            `/reset-password?error=${encodeURIComponent(
                error.message
            )}&next=${encodeURIComponent(safeNext)}`
        );
    }

    redirect(
        `/login?message=${encodeURIComponent(
            "Password updated successfully"
        )}&next=${encodeURIComponent(safeNext)}`
    );
}