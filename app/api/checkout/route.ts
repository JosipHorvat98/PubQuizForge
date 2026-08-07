// file: app/api/checkout/route.ts

export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import { getPlanEntitlements } from "@/lib/entitlements";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));
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

/**
 * Returns the tier discount (percent) for the signed-in member, or 0 for
 * guests and full-access plans. Bronze = 10, Silver = 20. Gold already has
 * unlimited downloads so no a-la-carte discount is needed.
 */
async function getMemberDiscountPercent(): Promise<number> {
    try {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return 0;
        }

        const membership = await findActiveMembershipForEmail(user.email);

        if (!membership) {
            return 0;
        }

        const entitlements = getPlanEntitlements(membership.plan_id);

        if (!entitlements || entitlements.extraPackDiscount >= 100) {
            return 0;
        }

        return entitlements.extraPackDiscount;
    } catch (error) {
        console.error("Unable to resolve member discount:", error);

        return 0;
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CheckoutRequestBody;

        if (body.mode === "payment" && "items" in body) {
            if (!body.items.length) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            const discount = await getMemberDiscountPercent();
            const discountFactor = (100 - discount) / 100;

            const lineItems = body.items.map((item) => ({
                quantity: item.quantity,
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.title
                    },
                    unit_amount: Math.round(
                        parseEuroPriceToCents(item.price) * discountFactor
                    )
                }
            }));

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
            if (!body.productName || !body.unitAmount) {
                return NextResponse.json(
                    { error: "Missing productName or unitAmount" },
                    { status: 400 }
                );
            }

            const discount = await getMemberDiscountPercent();
            const discountFactor = (100 - discount) / 100;

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
                            unit_amount: Math.round(body.unitAmount * discountFactor)
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
                return NextResponse.json(
                    { error: "Missing priceId" },
                    { status: 400 }
                );
            }

            const supabase = await createClient();

            const {
                data: { user },
                error: authError
            } = await supabase.auth.getUser();

            if (authError || !user?.email) {
                return NextResponse.json(
                    { error: "You must be signed in to start a membership." },
                    { status: 401 }
                );
            }

            const planId = body.slug ?? "";

            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                customer_email: user.email,
                success_url: `${siteUrl}/success`,
                cancel_url: `${siteUrl}/memberships`,
                line_items: [
                    {
                        price: body.priceId,
                        quantity: 1
                    }
                ],
                metadata: {
                    user_id: user.id,
                    email: user.email,
                    plan_id: planId,
                    slug: planId
                },
                subscription_data: {
                    metadata: {
                        user_id: user.id,
                        email: user.email,
                        plan_id: planId,
                        slug: planId
                    }
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