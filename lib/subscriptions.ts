import type Stripe from "stripe";

export const ACTIVE_SUBSCRIPTION_STATUSES = [
    "active",
    "trialing",
    "past_due"
] as const;

// Maps Stripe Price IDs to the plan slug used across the app.
// Mirrors the price IDs used at checkout (components/membership-section.tsx,
// app/memberships/page.tsx) so we can derive the plan even when a subscription
// or its metadata lacks `plan_id`.
export const PRICE_ID_TO_PLAN_ID: Record<string, string> = {
    "price_1TKFNhEDQ5UIKPib0ICI1PuA": "bronze",
    "price_1TKFNwEDQ5UIKPibn4gyHs1H": "silver",
    "price_1TKFO9EDQ5UIKPibl50dVxzs": "gold"
};

export function isActiveSubscriptionStatus(status: string): boolean {
    return ACTIVE_SUBSCRIPTION_STATUSES.includes(
        status as (typeof ACTIVE_SUBSCRIPTION_STATUSES)[number]
    );
}

export function getSubscriptionPeriodEnd(
    subscription: Stripe.Subscription
): string | null {
    const subscriptionWithLegacyPeriod = subscription as Stripe.Subscription & {
        current_period_end?: number;
    };

    const periodEnd =
        subscription.items.data[0]?.current_period_end ??
        subscriptionWithLegacyPeriod.current_period_end;

    return periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null;
}

export function getPlanIdFromSubscription(
    subscription: Stripe.Subscription
): string {
    const priceId = subscription.items.data[0]?.price?.id ?? "";

    return (
        subscription.metadata.plan_id ??
        subscription.metadata.slug ??
        subscription.items.data[0]?.price.metadata?.plan_id ??
        PRICE_ID_TO_PLAN_ID[priceId] ??
        "unknown"
    );
}
