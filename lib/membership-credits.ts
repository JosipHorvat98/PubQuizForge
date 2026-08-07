// file: lib/membership-credits.ts
import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPlanEntitlements } from "@/lib/entitlements";

export type MembershipCredits = {
    email: string;
    plan_id: string;
    monthly_credits: number;
    credits_available: number;
    max_rollover: number;
    last_period_start: string | null;
    created_at?: string | null;
    updated_at?: string | null;
};

/**
 * Converts the Stripe `current_period_start` (unix seconds) into a YYYY-MM-DD
 * key used to detect whether a grant covers a new billing period.
 */
function toPeriodKey(periodStart: string | number): string {
    const ms = typeof periodStart === "number" ? periodStart * 1000 : Date.parse(periodStart);

    return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Idempotent credit grant, called from the webhook whenever a subscription is
 * created or renewed (including plan upgrades).
 *
 * Behaviour per grant:
 *  - New subscriber            -> credits_available = monthlyCredits.
 *  - Renewal (new period key)  -> roll over the unused balance (capped by
 *                                 maxRollover), then add monthlyCredits.
 *  - Same period key (dupe, or an in-period plan upgrade) -> only top the
 *                                 balance up to the new plan's monthlyCredits.
 *
 * Returns the resulting available balance, or null when the plan is unknown.
 */
export async function grantCreditsForSubscription(opts: {
    email: string;
    planId: string;
    periodStart: string | number;
}): Promise<{ credits_available: number } | null> {
    const entitlements = getPlanEntitlements(opts.planId);

    if (!entitlements) {
        return null;
    }

    const periodKey = toPeriodKey(opts.periodStart);
    const email = opts.email.trim().toLowerCase();

    const { data: existing } = await supabaseAdmin
        .from("membership_credits")
        .select("*")
        .eq("email", email)
        .maybeSingle<MembershipCredits>();

    if (existing && existing.last_period_start === periodKey) {
        // Same billing period: a duplicate delivery or an in-period upgrade.
        const currentMonthly = existing.monthly_credits || entitlements.monthlyCredits;
        const delta = entitlements.monthlyCredits - currentMonthly;

        // Upgrades top up the current balance; downgrades don't claw back.
        const nextAvailable = Math.max(
            existing.credits_available ?? 0,
            (existing.credits_available ?? 0) + delta
        );

        const { error } = await supabaseAdmin
            .from("membership_credits")
            .update({
                plan_id: entitlements.planId,
                monthly_credits: entitlements.monthlyCredits,
                max_rollover: entitlements.maxRollover,
                credits_available: nextAvailable,
                updated_at: new Date().toISOString()
            })
            .eq("email", email);

        if (error) {
            throw new Error(`Unable to top up credits: ${error.message}`);
        }

        return { credits_available: nextAvailable };
    }

    if (existing) {
        // New billing period: carry over capped unused credits, then grant.
        const unused = existing.credits_available ?? 0;
        const rolledOver = Math.min(unused, entitlements.maxRollover);
        const nextAvailable = entitlements.monthlyCredits + rolledOver;

        const { error } = await supabaseAdmin
            .from("membership_credits")
            .update({
                plan_id: entitlements.planId,
                monthly_credits: entitlements.monthlyCredits,
                max_rollover: entitlements.maxRollover,
                credits_available: nextAvailable,
                last_period_start: periodKey,
                updated_at: new Date().toISOString()
            })
            .eq("email", email);

        if (error) {
            throw new Error(`Unable to roll over credits: ${error.message}`);
        }

        return { credits_available: nextAvailable };
    }

    // First time we've seen this customer.
    const { error } = await supabaseAdmin.from("membership_credits").insert({
        email,
        plan_id: entitlements.planId,
        monthly_credits: entitlements.monthlyCredits,
        credits_available: entitlements.monthlyCredits,
        max_rollover: entitlements.maxRollover,
        last_period_start: periodKey,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    if (error) {
        throw new Error(`Unable to grant credits: ${error.message}`);
    }

    return { credits_available: entitlements.monthlyCredits };
}

/** Reads the current credit balance for an email, or null when no row exists. */
export async function getCreditsForEmail(
    email: string
): Promise<MembershipCredits | null> {
    const { data } = await supabaseAdmin
        .from("membership_credits")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle<MembershipCredits>();

    return data ?? null;
}


/**
 * Atomically spends one credit for the given email. Returns the new available
 * balance, or `success: false` when there are no credits left.
 */
export async function consumeCredit(
    email: string
): Promise<{ success: boolean; credits_available: number }> {
    const { data } = await supabaseAdmin
        .from("membership_credits")
        .select("credits_available")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle<{ credits_available: number }>();

    if (!data || data.credits_available <= 0) {
        return { success: false, credits_available: 0 };
    }

    const nextAvailable = data.credits_available - 1;

    const { error } = await supabaseAdmin
        .from("membership_credits")
        .update({
            credits_available: nextAvailable,
            updated_at: new Date().toISOString()
        })
        .eq("email", email.trim().toLowerCase())
        .gt("credits_available", 0);

    if (error) {
        return { success: false, credits_available: data.credits_available };
    }

    return { success: true, credits_available: nextAvailable };
}

/** Number of credits spent this billing period (for a progress hint). */
export async function getCreditsUsedForEmail(
    email: string
): Promise<number> {
    const credits = await getCreditsForEmail(email);

    if (!credits) {
        return 0;
    }

    // available = issued - used, where issued includes any rolled-over amount.
    const grossIssued = Math.max(
        credits.monthly_credits,
        credits.credits_available
    );

    return Math.max(0, grossIssued - credits.credits_available);
}
