// file: app/reset-password/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function updatePassword(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 6) {
        redirect("/reset-password?error=Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
        redirect("/reset-password?error=Passwords do not match");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password
    });

    if (error) {
        redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/login?message=Password updated successfully");
}