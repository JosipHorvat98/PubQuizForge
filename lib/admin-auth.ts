import { createClient } from "@/utils/supabase/server";

function getAdminEmails(): string[] {
    const configured = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);

    // The publisher (owner) is always an admin, even if ADMIN_EMAILS is not
    // configured in a given environment. This keeps the dashboard reachable
    // on production where only PUBLISHER_EMAIL might be set.
    const publisher = (process.env.PUBLISHER_EMAIL ?? "").trim().toLowerCase();

    if (publisher && !configured.includes(publisher)) {
        configured.push(publisher);
    }

    return configured;
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