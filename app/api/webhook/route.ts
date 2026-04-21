// file: app/api/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { packs, plans } from "@/data/site";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));
const webhookSecret = getEnv("STRIPE_WEBHOOK_SECRET");

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
        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        );

        console.log("Webhook received:", event.type);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log("checkout.session.completed payload:", {
                id: session.id,
                mode: session.mode,
                metadata: session.metadata ?? {},
                customer_email: session.customer_email ?? null,
                customer_details_email: session.customer_details?.email ?? null
            });

            const email =
                session.customer_details?.email ??
                session.customer_email ??
                "local-test@pubquizforge.com";

            const createdAt = new Date().toISOString();

            if (session.mode === "subscription") {
                const slug = session.metadata?.slug ?? "";
                const plan = plans.find((item) => item.id === slug);

                console.log("Subscription match:", {
                    slug,
                    found: !!plan
                });

                if (plan) {
                    const { error } = await supabaseAdmin.from("downloads").upsert({
                        id: `${session.id}:${plan.id}`,
                        title: `${plan.name} Membership`,
                        email,
                        type: "membership",
                        created_at: createdAt,
                        pack_slug: plan.id,
                        download_url: null
                    });

                    if (error) {
                        console.error("Supabase insert error:", error);
                    } else {
                        console.log("Saved subscription download entry");
                    }
                }
            }

            if (session.mode === "payment") {
                const singleSlug = session.metadata?.slug ?? "";
                const multiSlugs = session.metadata?.slugs
                    ? (JSON.parse(session.metadata.slugs) as string[])
                    : [];

                const slugs = singleSlug ? [singleSlug] : multiSlugs;
                const matched = packs.filter((pack) => slugs.includes(pack.id));

                console.log("Payment match:", {
                    singleSlug,
                    multiSlugs,
                    matched: matched.map((item) => item.id)
                });

                if (matched.length) {
                    const rows = matched.map((pack) => ({
                        id: `${session.id}:${pack.id}`,
                        title: pack.title,
                        email,
                        type: "pack" as const,
                        created_at: createdAt,
                        pack_slug: pack.id,
                        download_url: pack.pdfPath ?? null
                    }));

                    const { error } = await supabaseAdmin.from("downloads").upsert(rows);

                    if (error) {
                        console.error("Supabase insert error:", error);
                    } else {
                        console.log("Saved pack download entries");
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