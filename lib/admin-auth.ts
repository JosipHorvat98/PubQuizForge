import { createClient } from "@/utils/supabase/server";

function getAdminEmails(): string[] {
    return (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export async function requireAdmin() {
    const supabase = await createClient();

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
        throw new Error("Unauthorized");
    }

    const isAdmin = getAdminEmails().includes(user.email.toLowerCase());

    if (!isAdmin) {
        throw new Error("Forbidden");
    }

    return user;
}

export async function isAdminUser(): Promise<boolean> {
    try {
        await requireAdmin();
        return true;
    } catch {
        return false;
    }
}