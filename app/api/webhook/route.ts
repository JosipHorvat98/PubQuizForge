import Stripe from "stripe";
import { NextResponse } from "next/server";
import { packs, plans } from "@/data/site";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    getPlanIdFromSubscription,
    getSubscriptionPeriodEnd
} from "@/lib/subscriptions";
import { grantCreditsForSubscription } from "@/lib/membership-credits";

function getEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

const stripe = new Stripe(getEnvironmentVariable("STRIPE_SECRET_KEY"));
const webhookSecret = getEnvironmentVariable("STRIPE_WEBHOOK_SECRET");

async function saveSubscription(
    subscription: Stripe.Subscription
): Promise<void> {
    const userId = subscription.metadata.user_id;
    const email = subscription.metadata.email;
    const customerId =
        typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Grant pack credits from the membership ledger whenever the subscription
    // is in an active state (created, renewed or upgraded). Idempotent per
    // billing period, so duplicate webhook deliveries are safe.
    const activeStatuses = ["active", "trialing", "past_due"];
    const periodStart = subscription.items.data[0]?.current_period_start;

    if (activeStatuses.includes(subscription.status) && periodStart && email) {
        try {
            await grantCreditsForSubscription({
                email,
                planId: getPlanIdFromSubscription(subscription),
                periodStart
            });
        } catch (error) {
            console.error("Unable to grant membership credits:", error);
        }
    }

if (!userId || !email) {
        console.error("Subscription metadata is incomplete:", {
            subscriptionId: subscription.id,
            hasUserId: Boolean(userId),
            hasEmail: Boolean(email)
        });

        return;
    }

    const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(
            {
                user_id: userId,
                email,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscription.id,
                plan_id: getPlanIdFromSubscription(subscription),
                status: subscription.status,
                cancel_at_period_end: subscription.cancel_at_period_end,
                current_period_end: getSubscriptionPeriodEnd(subscription),
                updated_at: new Date().toISOString()
            },
            {
                onConflict: "stripe_subscription_id"
            }
        );

    if (error) {
        throw new Error(`Unable to save subscription: ${error.message}`);
    }
}

async function savePackDownloads(
    session: Stripe.Checkout.Session
): Promise<void> {
    const email =
        session.customer_details?.email ??
        session.customer_email;

    if (!email) {
        throw new Error("Checkout session has no customer email");
    }

    const singleSlug = session.metadata?.slug ?? "";

    let multiSlugs: string[] = [];

    if (session.metadata?.slugs) {
        try {
            const parsed = JSON.parse(session.metadata.slugs) as unknown;

            if (Array.isArray(parsed)) {
                multiSlugs = parsed.filter(
                    (slug): slug is string => typeof slug === "string"
                );
            }
        } catch {
            throw new Error("Invalid checkout slugs metadata");
        }
    }

    const slugs = singleSlug ? [singleSlug] : multiSlugs;
    const matchedPacks = packs.filter((pack) => slugs.includes(pack.id));

    if (!matchedPacks.length) {
        return;
    }

    const rows = matchedPacks.map((pack) => ({
        id: `${session.id}:${pack.id}`,
        title: pack.title,
        email,
        type: "pack" as const,
        source: "purchase" as const,
        created_at: new Date().toISOString(),
        pack_slug: pack.id,
        // Stored URL is intentionally null; the download endpoints re-sign a
        // fresh private Storage URL for the owner on every request.
        download_url: null
    }));

    const { error } = await supabaseAdmin
        .from("downloads")
        .upsert(rows);

    if (error) {
        // The `source` column is a newer migration. Fall back to inserting
        // without it so existing deployments keep recording pack downloads
        // even before the migration has been applied.
        const rowsWithoutSource = rows.map(({ source: _source, ...rest }) => {
            void _source;

            return rest;
        });

        const { error: fallbackError } = await supabaseAdmin
            .from("downloads")
            .upsert(rowsWithoutSource);

        if (fallbackError) {
            throw new Error(
                `Unable to save downloads: ${fallbackError.message}`
            );
        }
    }
}

async function saveMembershipDownload(
    session: Stripe.Checkout.Session
): Promise<void> {
    const email =
        session.customer_details?.email ??
        session.customer_email ??
        session.metadata?.email;

    const planId =
        session.metadata?.plan_id ??
        session.metadata?.slug ??
        "";

    const plan = plans.find((candidate) => candidate.id === planId);

    if (!email || !plan) {
        return;
    }

    const { error } = await supabaseAdmin
        .from("downloads")
        .upsert({
            id: `${session.id}:${plan.id}`,
            title: `${plan.name} Membership`,
            email,
            type: "membership",
            created_at: new Date().toISOString(),
            pack_slug: plan.id,
            download_url: null
        });

    if (error) {
        throw new Error(
            `Unable to save membership download: ${error.message}`
        );
    }
}

async function saveSubscriptionById(
    subscriptionId: string
): Promise<void> {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await saveSubscription(subscription);
}

export async function POST(request: Request) {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        const payload = await request.text();

        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        );
    } catch (error) {
        console.error("Stripe webhook signature error:", error);

        return NextResponse.json(
            { error: "Invalid Stripe signature" },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.mode === "payment") {
                    await savePackDownloads(session);
                }

                if (session.mode === "subscription") {
                    await saveMembershipDownload(session);

                    // Persist the subscription row too, so the account page can
                    // show it even if the lifecycle events are delayed/missed.
                    if (session.subscription) {
                        const subscriptionId =
                            typeof session.subscription === "string"
                                ? session.subscription
                                : session.subscription.id;

                        await saveSubscriptionById(subscriptionId);
                    }
                }

                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription =
                    event.data.object as Stripe.Subscription;

                await saveSubscription(subscription);
                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;

                // The `subscription` reference is not always present on the
                // typed Invoice in every API version, so access it defensively.
                const invoiceWithSubscription = invoice as Stripe.Invoice & {
                    subscription?: string | Stripe.Subscription | null;
                };

                if (invoiceWithSubscription.subscription) {
                    const subscriptionId =
                        typeof invoiceWithSubscription.subscription === "string"
                            ? invoiceWithSubscription.subscription
                            : invoiceWithSubscription.subscription.id;

                    await saveSubscriptionById(subscriptionId);
                }

                break;
            }

            default:
                break;
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Stripe webhook processing error:", error);

        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
