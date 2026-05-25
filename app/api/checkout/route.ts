// file: app/api/checkout/route.ts
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextResponse } from "next/server";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

const stripeSecretKey = getEnv("STRIPE_SECRET_KEY");
const stripe = new Stripe(stripeSecretKey);
const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL");

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

function parseEuroPriceToCents(price: string): number {
    const numericPrice = Number(price.replace("€", "").trim());

    if (Number.isNaN(numericPrice)) {
        throw new Error(`Invalid price format: ${price}`);
    }

    return Math.round(numericPrice * 100);
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CheckoutRequestBody;

        if (body.mode === "payment" && "items" in body) {
            if (!body.items.length) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            const lineItems = body.items.map((item) => ({
                quantity: item.quantity,
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.title
                    },
                    unit_amount: parseEuroPriceToCents(item.price)
                }
            }));

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${siteUrl}/success`,
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
            if (!body.productName || !body.unitAmount) {
                return NextResponse.json(
                    { error: "Missing productName or unitAmount" },
                    { status: 400 }
                );
            }

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                success_url: `${siteUrl}/success`,
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
            if (!body.priceId) {
                return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
            }

            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                success_url: `${siteUrl}/success`,
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

        return NextResponse.json(
            { error: "Invalid checkout payload" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Stripe checkout error:", error);

        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 }
        );
    }
}