// file: lib/memberships.ts
import "server-only";
import Stripe from "stripe";
import { PRICE_ID_TO_PLAN_ID } from "@/lib/subscriptions";

const ACTIVE_STATUSES = ["active", "trialing", "past_due"] as const;

export type StripeMembership = {
    plan_id: string;
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string | null;
};

function getStripeClient(): Stripe {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
        throw new Error("Missing STRIPE_SECRET_KEY");
    }

    return new Stripe(secretKey);
}

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
export async function findActiveMembershipForEmail(
    email: string
): Promise<StripeMembership | null> {
    const stripe = getStripeClient();

    const customers = await stripe.customers.list({ email, limit: 10 });
    const customer = customers.data.find((candidate) => !candidate.deleted);

    if (!customer) {
        return null;
    }

    const result = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 100
    });

    const subscriptionList = Array.isArray(result) ? result : result.data;

    const latestActive = subscriptionList
        .filter((subscription) =>
            isActiveMembershipStatus(subscription.status)
        )
        .sort((a, b) => b.created - a.created)[0];

    if (!latestActive) {
        return null;
    }

    const priceId = latestActive.items.data[0]?.price?.id ?? "";
    const planId =
        latestActive.metadata?.plan_id ??
        latestActive.metadata?.slug ??
        PRICE_ID_TO_PLAN_ID[priceId] ??
        "unknown";

    const periodEnd = latestActive.items.data[0]?.current_period_end ?? null;

    return {
        plan_id: planId,
        status: latestActive.status,
        cancel_at_period_end: latestActive.cancel_at_period_end,
        current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null
    };
}
