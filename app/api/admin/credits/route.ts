// file: app/api/admin/credits/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { logAdminAction } from "@/lib/admin-audit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import { getPlanEntitlements } from "@/lib/entitlements";
import { getCreditsForEmail } from "@/lib/membership-credits";

export const dynamic = "force-dynamic";

type CreditAction = "add" | "set" | "reset";

export async function POST(request: Request) {
    let adminEmail = "";

    try {
        const admin = await requireAdmin();
        adminEmail = admin.email ?? "";
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        email?: string;
        action?: CreditAction;
        amount?: number;
    };

    const email = (body.email ?? "").trim().toLowerCase();
    const action = body.action;

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (action !== "add" && action !== "set" && action !== "reset") {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const rawAmount = Number(body.amount ?? 0);

    if (action !== "reset" && (!Number.isFinite(rawAmount) || rawAmount < 0)) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amount = Math.min(Math.floor(rawAmount), 1000);

    const existing = await getCreditsForEmail(email);

    // Plan stays whatever the user already has; otherwise derive from their
    // active membership; fall back to bronze so the ledger row is valid.
    let planId = existing?.plan_id ?? "";

    if (!planId) {
        try {
            const membership = await findActiveMembershipForEmail(email);
            planId = membership?.plan_id ?? "";
        } catch (error) {
            console.error("Admin credit: membership lookup failed", error);
        }
    }

    if (!planId) {
        planId = "bronze";
    }

    const entitlements = getPlanEntitlements(planId);

    if (!entitlements) {
        return NextResponse.json(
            { error: "Unknown plan for this user" },
            { status: 500 }
        );
    }

    const before = existing?.credits_available ?? 0;
    const next =
        action === "set" ? amount : action === "add" ? before + amount : 0;

    const now = new Date().toISOString();
    const monthlyCredits =
        existing?.monthly_credits || entitlements.monthlyCredits;
    const maxRollover = existing?.max_rollover ?? entitlements.maxRollover;

    if (existing) {
        const { error } = await supabaseAdmin
            .from("membership_credits")
            .update({
                credits_available: next,
                plan_id: planId,
                monthly_credits: monthlyCredits,
                max_rollover: maxRollover,
                updated_at: now
            })
            .eq("email", email);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    } else {
        const { error } = await supabaseAdmin.from("membership_credits").insert({
            email,
            plan_id: planId,
            monthly_credits: entitlements.monthlyCredits,
            credits_available: next,
            max_rollover: entitlements.maxRollover,
            last_period_start: null,
            created_at: now,
            updated_at: now
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    await logAdminAction({
        adminEmail,
        action: "admin_credit_update",
        entityType: "credits",
        entityId: email,
        meta: {
            action,
            amount: action === "reset" ? 0 : amount,
            before,
            after: next,
            plan_id: planId
        }
    });

    return NextResponse.json({
        email,
        plan_id: planId,
        credits_available: next,
        monthly_credits: monthlyCredits,
        max_rollover: maxRollover,
        last_period_start: existing?.last_period_start ?? null
    });
}
