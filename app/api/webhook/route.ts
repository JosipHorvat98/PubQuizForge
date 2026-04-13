// file: app/api/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { addDownloads } from "@/lib/dev-store";
import { packs, plans } from "@/data/site";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: Request) {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    try {
        const payload = await request.text();
        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const email = session.customer_details?.email;

            if (email) {
                const createdAt = new Date().toISOString();

                if (session.mode === "subscription") {
                    const slug = session.metadata?.slug ?? "";
                    const plan = plans.find((item) => item.id === slug);

                    if (plan) {
                        await addDownloads([
                            {
                                id: `${session.id}:${plan.id}`,
                                title: `${plan.name} Membership`,
                                email,
                                type: "membership",
                                createdAt
                            }
                        ]);
                    }
                }

                if (session.mode === "payment") {
                    const singleSlug = session.metadata?.slug;
                    const multiSlugs = session.metadata?.slugs
                        ? (JSON.parse(session.metadata.slugs) as string[])
                        : [];

                    const slugs = singleSlug ? [singleSlug] : multiSlugs;
                    const matched = packs.filter((pack) => slugs.includes(pack.id));

                    if (matched.length) {
                        await addDownloads(
                            matched.map((pack) => ({
                                id: `${session.id}:${pack.id}`,
                                title: pack.title,
                                email,
                                type: "pack" as const,
                                createdAt
                            }))
                        );
                    }
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error);

        return NextResponse.json(
            { error: "Webhook signature verification failed" },
            { status: 400 }
        );
    }
}