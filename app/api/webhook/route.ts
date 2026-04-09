// file: app/api/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

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

        const event = stripe.webhooks.constructEvent(
            payload,
            signature,
            webhookSecret
        );

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                console.log("checkout.session.completed", {
                    sessionId: session.id,
                    customerEmail: session.customer_details?.email ?? null,
                    mode: session.mode,
                    metadata: session.metadata ?? {}
                });

                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;

                console.log("invoice.paid", {
                    invoiceId: invoice.id,
                    customerId: invoice.customer
                });

                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                console.log(event.type, {
                    subscriptionId: subscription.id,
                    status: subscription.status,
                    customerId: subscription.customer
                });

                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
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