// file: lib/subscription-prices.ts

/**
 * Stripe Price IDs for the three membership plans.
 *
 * Configure these on Vercel (and in .env.local) with your LIVE price IDs:
 *   NEXT_PUBLIC_STRIPE_PRICE_BRONZE=price_...
 *   NEXT_PUBLIC_STRIPE_PRICE_SILVER=price_...
 *   NEXT_PUBLIC_STRIPE_PRICE_GOLD=price_...
 *
 * The fallbacks below are the original test-mode IDs so local dev keeps
 * working until the env vars are set.
 */
const FALLBACK_PRICE_IDS = {
    bronze: "price_1TKFNhEDQ5UIKPib0ICI1PuA",
    silver: "price_1TKFNwEDQ5UIKPibn4gyHs1H",
    gold: "price_1TKFO9EDQ5UIKPibl50dVxzs"
} as const;

export const subscriptionPriceIds: Record<string, string> = {
    bronze:
        process.env.NEXT_PUBLIC_STRIPE_PRICE_BRONZE || FALLBACK_PRICE_IDS.bronze,
    silver:
        process.env.NEXT_PUBLIC_STRIPE_PRICE_SILVER || FALLBACK_PRICE_IDS.silver,
    gold: process.env.NEXT_PUBLIC_STRIPE_PRICE_GOLD || FALLBACK_PRICE_IDS.gold
};

/**
 * Reverse mapping (price ID → plan slug) so the webhook can derive the plan
 * even when a subscription or its metadata lacks `plan_id`.
 */
export const priceIdToPlanId: Record<string, string> = Object.fromEntries(
    Object.entries(subscriptionPriceIds).map(([plan, priceId]) => [
        priceId,
        plan
    ])
);
