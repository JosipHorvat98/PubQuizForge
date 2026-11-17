// file: lib/membership-sync.ts
import "server-only";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    getPlanIdFromSubscription,
    getSubscriptionPeriodEnd,
    isActiveSubscriptionStatus
} from "@/lib/subscriptions";

export type SyncedMembership = {
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

/**
 * Finds the best subscription for an email across ALL Stripe customers with
 * that email (Stripe allows duplicates). Prefers the newest active
 * subscription; falls back to the newest subscription of any status so a
 * cancelled membership can still be surfaced in the UI.
 */
export async function findBestStripeSubscription(
    email: string
): Promise<{ subscription: Stripe.Subscription; customerId: string } | null> {
    const normalized = email.trim().toLowerCase();

    if (!normalized) {
        return null;
    }

    const stripe = getStripeClient();
    const customers = await stripe.customers.list({
        email: normalized,
        limit: 10
    });
    const liveCustomers = customers.data.filter(
        (customer) => !customer.deleted
    );

    if (liveCustomers.length === 0) {
        return null;
    }

    let bestActive: {
        subscription: Stripe.Subscription;
        customerId: string;
    } | null = null;
    let latestAny: {
        subscription: Stripe.Subscription;
        customerId: string;
    } | null = null;

    for (const customer of liveCustomers) {
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: "all",
            limit: 20
        });

        for (const subscription of subscriptions.data) {
            if (
                !latestAny ||
                subscription.created > latestAny.subscription.created
            ) {
                latestAny = { subscription, customerId: customer.id };
            }

            if (
                isActiveSubscriptionStatus(subscription.status) &&
                (!bestActive ||
                    subscription.created > bestActive.subscription.created)
            ) {
                bestActive = { subscription, customerId: customer.id };
            }
        }
    }

    return bestActive ?? latestAny;
}

async function getUsersByEmail(): Promise<Map<string, string>> {
    const map = new Map<string, string>();

    try {
        for (let page = 1; page <= 10; page += 1) {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers({
                page,
                perPage: 1000
            });

            if (error) {
                break;
            }

            const users = data?.users ?? [];

            for (const user of users) {
                if (user.email) {
                    map.set(user.email.toLowerCase(), user.id);
                }
            }

            if (users.length < 1000) {
                break;
            }
        }
    } catch (error) {
        console.error("[membership-sync] unable to list users:", error);
    }

    return map;
}

/**
 * Reads the live Stripe state for an email and upserts the Supabase
 * `subscriptions` row. This keeps the DB (and admin page) in sync even when a
 * webhook delivery was missed. Returns the live Stripe state either way.
 */
export async function syncMembershipForEmail(
    email: string,
    fallbackUserId?: string
): Promise<SyncedMembership | null> {
    const normalized = email.trim().toLowerCase();
    const found = await findBestStripeSubscription(normalized);

    if (!found) {
        return null;
    }

    const { subscription, customerId } = found;
    const planId = getPlanIdFromSubscription(subscription);
    const periodEnd = getSubscriptionPeriodEnd(subscription);

    let userId = subscription.metadata?.user_id || fallbackUserId || "";

    if (!userId) {
        userId = (await getUsersByEmail()).get(normalized) ?? "";
    }

    if (userId) {
        const { error } = await supabaseAdmin.from("subscriptions").upsert(
            {
                user_id: userId,
                email: normalized,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscription.id,
                plan_id: planId,
                status: subscription.status,
                cancel_at_period_end: subscription.cancel_at_period_end,
                current_period_end: periodEnd,
                updated_at: new Date().toISOString()
            },
            { onConflict: "stripe_subscription_id" }
        );

        if (error) {
            console.error(
                "[membership-sync] unable to upsert subscription:",
                error.message
            );
        }
    } else {
        console.warn(
            `[membership-sync] no Supabase user for ${normalized}; row not persisted`
        );
    }

    return {
        plan_id: planId,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: periodEnd
    };
}

/**
 * Backfills every Stripe subscription into Supabase. Used by the admin
 * "Sync from Stripe" action after a webhook outage or key migration.
 */
export async function syncAllSubscriptions(): Promise<{
    total: number;
    synced: number;
    skipped: number;
}> {
    const stripe = getStripeClient();
    const usersByEmail = await getUsersByEmail();

    let total = 0;
    let synced = 0;
    let skipped = 0;
    let startingAfter: string | undefined;

    for (let page = 0; page < 10; page += 1) {
        const list = await stripe.subscriptions.list({
            limit: 100,
            status: "all",
            expand: ["data.customer"],
            ...(startingAfter ? { starting_after: startingAfter } : {})
        });

        for (const subscription of list.data) {
            total += 1;

            const customer = subscription.customer;
            const customerEmail =
                typeof customer === "string"
                    ? null
                    : !customer.deleted && "email" in customer
                        ? (customer.email ?? null)
                        : null;

            const email = (subscription.metadata?.email || customerEmail || "")
                .trim()
                .toLowerCase();

            const userId =
                subscription.metadata?.user_id || usersByEmail.get(email) || "";

            if (!email || !userId) {
                skipped += 1;
                continue;
            }

            const { error } = await supabaseAdmin.from("subscriptions").upsert(
                {
                    user_id: userId,
                    email,
                    stripe_customer_id:
                        typeof customer === "string" ? customer : customer.id,
                    stripe_subscription_id: subscription.id,
                    plan_id: getPlanIdFromSubscription(subscription),
                    status: subscription.status,
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    current_period_end: getSubscriptionPeriodEnd(subscription),
                    updated_at: new Date().toISOString()
                },
                { onConflict: "stripe_subscription_id" }
            );

            if (error) {
                skipped += 1;
                console.error(
                    "[membership-sync] upsert failed:",
                    error.message
                );
            } else {
                synced += 1;
            }
        }

        if (!list.has_more) {
            break;
        }

        startingAfter = list.data[list.data.length - 1]?.id;
    }

    return { total, synced, skipped };
}
