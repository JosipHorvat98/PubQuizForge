// file: app/api/admin/subscriptions/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));

type SubscriptionAction = "cancel" | "resume" | "cancel_now";

export async function POST(request: Request) {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        subscriptionId?: string;
        action?: SubscriptionAction;
    };

    const subscriptionId = (body.subscriptionId ?? "").trim();
    const action = body.action;

    if (!subscriptionId) {
        return NextResponse.json(
            { error: "Missing subscriptionId" },
            { status: 400 }
        );
    }

    if (action !== "cancel" && action !== "resume" && action !== "cancel_now") {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    try {
        const updated =
            action === "cancel_now"
                ? await stripe.subscriptions.cancel(subscriptionId)
                : await stripe.subscriptions.update(subscriptionId, {
                      cancel_at_period_end: action === "cancel"
                  });

        const periodEnd = updated.items?.data?.[0]?.current_period_end ?? null;
        const periodEndIso = periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null;

        const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({
                status: updated.status,
                cancel_at_period_end: updated.cancel_at_period_end,
                current_period_end: periodEndIso,
                updated_at: new Date().toISOString()
            })
            .eq("stripe_subscription_id", subscriptionId);

        if (error) {
            console.error("Unable to sync subscription row:", error);
        }

        await logAdminAction({
            adminEmail,
            action:
                action === "cancel_now"
                    ? "admin_subscription_cancel_now"
                    : action === "resume"
                        ? "admin_subscription_resume"
                        : "admin_subscription_cancel",
            entityType: "subscription",
            entityId: subscriptionId,
            meta: {
                status: updated.status,
                cancel_at_period_end: updated.cancel_at_period_end
            }
        });

        return NextResponse.json({
            status: updated.status,
            cancel_at_period_end: updated.cancel_at_period_end,
            current_period_end: periodEndIso
        });
    } catch (error) {
        console.error("Admin subscription action failed:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Stripe action failed"
            },
            { status: 500 }
        );
    }
}
