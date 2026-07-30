// file: lib/admin-auth.ts
import { createClient } from "@/utils/supabase/server";

function getAdminEmails(): string[] {
    const raw = process.env.ADMIN_EMAILS ?? "";

    return raw
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
}

export async function requireAdmin() {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const adminEmails = getAdminEmails();

    if (!user?.email || !adminEmails.includes(user.email.toLowerCase())) {
        throw new Error("Forbidden");
    }

    return user;
}