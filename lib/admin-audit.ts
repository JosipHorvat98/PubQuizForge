// file: lib/admin-audit.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function logAdminAction(opts: {
    adminEmail: string;
    action: string;
    entityType?: string;
    entityId?: string;
    meta?: Record<string, unknown>;
}): Promise<void> {
    try {
        await supabaseAdmin.from("admin_audit_log").insert({
            admin_email: opts.adminEmail,
            action: opts.action,
            entity_type: opts.entityType ?? null,
            entity_id: opts.entityId ?? null,
            meta: opts.meta && Object.keys(opts.meta).length ? opts.meta : null
        });
    } catch (error) {
        console.error("[audit] unable to write audit log:", error);
    }
}

export type AdminAuditEntry = {
    id: string;
    admin_email: string;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    meta: Record<string, unknown> | null;
    created_at: string;
};

const ACTION_LABELS: Record<string, string> = {
    delete_user: "Deleted user",
    update_news_post: "Updated news post",
    delete_news_post: "Deleted news post",
    news_post_create: "Created news post",
    custom_question_handled: "Marked custom question handled",
    custom_question_reopened: "Reopened custom question",
    delete_custom_question: "Deleted custom question",
    newsletter_broadcast: "Sent newsletter broadcast",
    newsletter_unsubscribe: "Unsubscribed newsletter email"
};

export function describeAuditAction(action: string): string {
    return ACTION_LABELS[action] ?? action.replace(/_/g, " ");
}

/** Returns the most recent admin actions, newest first. */
export async function listRecentAdminActions(
    limit = 10
): Promise<AdminAuditEntry[]> {
    const { data, error } = await supabaseAdmin
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("[audit] unable to list audit log:", error.message);
        return [];
    }

    return (data ?? []) as AdminAuditEntry[];
}