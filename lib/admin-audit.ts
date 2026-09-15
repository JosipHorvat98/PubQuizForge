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