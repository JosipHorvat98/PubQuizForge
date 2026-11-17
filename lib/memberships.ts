// file: lib/memberships.ts
import "server-only";
import { findBestStripeSubscription } from "@/lib/membership-sync";
import {
    getPlanIdFromSubscription,
    getSubscriptionPeriodEnd,
    isActiveSubscriptionStatus
} from "@/lib/subscriptions";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"] as const;

export type StripeMembership = {
    plan_id: string;
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string | null;
};

export function isActiveMembershipStatus(status: string): boolean {
    return (ACTIVE_STATUSES as readonly string[]).includes(status);
}

/**
 * Looks up the current active membership directly from Stripe using the
 * customer's email — the same link the billing portal relies on. This acts as
 * an authoritative fallback so the account page reflects an active
 * subscription even if a webhook event hasn't (yet) written the Supabase
 * `subscriptions` row.
 */
async function findMembershipFromStripe(
    email: string
): Promise<StripeMembership | null> {
    try {
        const found = await findBestStripeSubscription(email);

        if (!found) {
            return null;
        }

        const { subscription } = found;

        if (!isActiveSubscriptionStatus(subscription.status)) {
            return null;
        }

        return {
            plan_id: getPlanIdFromSubscription(subscription),
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: getSubscriptionPeriodEnd(subscription)
        };
    } catch (error) {
        console.error("Stripe membership lookup failed:", error);
        return null;
    }
}

/** Fallback to the webhook-written `subscriptions` table when Stripe is empty. */
async function findMembershipFromSupabase(
    email: string
): Promise<StripeMembership | null> {
    try {
        const { data, error } = await supabaseAdmin
            .from("subscriptions")
            .select("plan_id, status, cancel_at_period_end, current_period_end")
            .eq("email", email.trim().toLowerCase())
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !data) {
            return null;
        }

        if (!isActiveMembershipStatus(data.status)) {
            return null;
        }

        return {
            plan_id: data.plan_id,
            status: data.status,
            cancel_at_period_end: data.cancel_at_period_end,
            current_period_end: data.current_period_end
        };
    } catch (error) {
        console.error("Supabase membership lookup failed:", error);
        return null;
    }
}

/**
 * Looks up the current active membership. Starts with the authoritative Stripe
 * lookup (customer email + subscription), then falls back to the Supabase
 * `subscriptions` table written by the webhook. This keeps the UI consistent
 * even when the Stripe key on a given environment doesn't match the data.
 */
export async function findActiveMembershipForEmail(
    email: string
): Promise<StripeMembership | null> {
    const fromStripe = await findMembershipFromStripe(email);

    if (fromStripe) {
        return fromStripe;
    }

    return findMembershipFromSupabase(email);
}
