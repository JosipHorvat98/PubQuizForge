// file: app/api/admin/subscriptions/sync/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { syncAllSubscriptions } from "@/lib/membership-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await syncAllSubscriptions();

        await logAdminAction({
            adminEmail,
            action: "admin_subscription_sync",
            entityType: "subscription",
            meta: result
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Subscription sync failed:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Subscription sync failed"
            },
            { status: 500 }
        );
    }
}
