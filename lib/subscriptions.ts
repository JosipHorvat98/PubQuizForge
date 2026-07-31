import type Stripe from "stripe";

export const ACTIVE_SUBSCRIPTION_STATUSES = [
    "active",
    "trialing",
    "past_due"
] as const;

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
    return (
        subscription.metadata.plan_id ??
        subscription.metadata.slug ??
        subscription.items.data[0]?.price.metadata?.plan_id ??
        "unknown"
    );
}