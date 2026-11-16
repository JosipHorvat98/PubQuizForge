import { createClient } from "@/utils/supabase/server";

export type AdminRole = "super_admin" | "editor";

function parseEmails(value?: string): string[] {
    return (value ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

/** Full-access admins (ADMIN_EMAILS + the publisher). */
function getSuperAdminEmails(): string[] {
    const list = parseEmails(process.env.ADMIN_EMAILS);

    // The publisher (owner) is always a super admin, even if ADMIN_EMAILS is
    // not configured in a given environment.
    const publisher = (process.env.PUBLISHER_EMAIL ?? "").trim().toLowerCase();

    if (publisher && !list.includes(publisher)) {
        list.push(publisher);
    }

    return list;
}

/** News-only editors (EDITOR_EMAILS). */
function getEditorEmails(): string[] {
    return parseEmails(process.env.EDITOR_EMAILS);
}

/** Resolves the role for an email, or null when the user has no admin access. */
export function getRoleForEmail(email?: string | null): AdminRole | null {
    if (!email) {
        return null;
    }

    const normalized = email.trim().toLowerCase();

    if (getSuperAdminEmails().includes(normalized)) {
        return "super_admin";
    }

    if (getEditorEmails().includes(normalized)) {
        return "editor";
    }

    return null;
}

async function getCurrentUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
        throw new Error("Unauthorized");
    }

    return user;
}

/** Requires full admin access (everything). */
export async function requireAdmin() {
    const user = await getCurrentUser();

    if (getRoleForEmail(user.email) !== "super_admin") {
        throw new Error("Forbidden");
    }

    return user;
}

/** Requires news-editor access (super admin OR editor). */
export async function requireNewsEditor() {
    const user = await getCurrentUser();
    const role = getRoleForEmail(user.email);

    if (role !== "super_admin" && role !== "editor") {
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

/** Current user's admin role (null when not logged in / no access). */
export async function getAdminRole(): Promise<AdminRole | null> {
    try {
        const user = await getCurrentUser();

        return getRoleForEmail(user.email);
    } catch {
        return null;
    }
}
