// file: app/api/checkout/route.ts
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
}

if (!siteUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
}

const stripe = new Stripe(stripeSecretKey);

type PaymentItem = {
    id: string;
    title: string;
    price: string;
    quantity: number;
};

type CheckoutRequestBody =
    | {
        mode: "payment";
        productName: string;
        unitAmount: number;
        quantity?: number;
        slug?: string;
    }
    | {
        mode: "payment";
        items: PaymentItem[];
    }
    | {
        mode: "subscription";
        priceId: string;
        slug?: string;
    };

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CheckoutRequestBody;

        if (body.mode === "payment" && "items" in body) {
            if (!body.items.length) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items.map(
                (item) => ({
                    quantity: item.quantity,
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: item.title
                        },
                        unit_amount: Math.round(Number(item.price.replace("€", "")) * 100)
                    }
                })
            );

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/cart`,
                line_items: lineItems,
                metadata: {
                    slugs: JSON.stringify(body.items.map((item) => item.id))
                }
            });

            if (!session.url) {
                return NextResponse.json(
                    { error: "Stripe session URL was not returned" },
                    { status: 500 }
                );
            }

            return NextResponse.json({ url: session.url });
        }

        if (body.mode === "payment" && "productName" in body) {
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/cancel`,
                line_items: [
                    {
                        quantity: body.quantity ?? 1,
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: body.productName
                            },
                            unit_amount: body.unitAmount
                        }
                    }
                ],
                metadata: {
                    slug: body.slug ?? ""
                }
            });

            if (!session.url) {
                return NextResponse.json(
                    { error: "Stripe session URL was not returned" },
                    { status: 500 }
                );
            }

            return NextResponse.json({ url: session.url });
        }

        if (body.mode === "subscription") {
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/cancel`,
                line_items: [
                    {
                        price: body.priceId,
                        quantity: 1
                    }
                ],
                metadata: {
                    slug: body.slug ?? ""
                }
            });

            if (!session.url) {
                return NextResponse.json(
                    { error: "Stripe session URL was not returned" },
                    { status: 500 }
                );
            }

            return NextResponse.json({ url: session.url });
        }

        return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
    } catch (error) {
        console.error("Stripe checkout error:", error);

        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 }
        );
    }
}