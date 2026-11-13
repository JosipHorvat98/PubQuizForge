// file: app/api/checkout/route.ts

export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import {
    getPlanEntitlements,
    packBySlug,
    packHasPdf,
    canAccessPackWithPlanId,
    packTier,
    PACK_TIER_LABEL
} from "@/lib/entitlements";

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
        promoCode?: string;
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
 * A pack slug can be purchased only when it resolves to a real pack that
 * actually ships a PDF (i.e. is currently available on the site).
 */
function isSlugPurchasable(slug: string): boolean {
    const pack = packBySlug(slug);

    return Boolean(pack && packHasPdf(pack));
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
/**
 * Returns the signed-in user's email, or null for guests. Used to prefill the
 * Stripe checkout email so it always matches the logged-in account instead of
 * whatever Stripe remembered in the browser.
 */
async function getLoggedInEmail(): Promise<string | null> {
    try {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        return user?.email ?? null;
    } catch (error) {
        console.error("Unable to resolve logged-in email:", error);
        return null;
    }
}

/**
 * Returns the signed-in user's active membership plan id (bronze/silver/gold),
 * or null for guests and users without an active subscription.
 */
async function getMemberPlanId(): Promise<string | null> {
    try {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return null;
        }

        const membership = await findActiveMembershipForEmail(user.email);

        return membership?.plan_id ?? null;
    } catch (error) {
        console.error("Unable to resolve membership plan:", error);

        return null;
    }
}

/**
 * Rejects a purchase when any pack is gated behind a higher membership tier.
 * Returns a human-readable error message, or null when everything is allowed.
 */
function findTierAccessError(
    packIds: string[],
    planId: string | null
): string | null {
    for (const id of packIds) {
        const pack = packBySlug(id);

        if (!pack) {
            continue;
        }

        if (!canAccessPackWithPlanId(pack, planId)) {
            const label = PACK_TIER_LABEL[packTier(pack)];

            return `"${pack.title}" requires a ${label} membership (or higher). Upgrade your plan to buy this pack.`;
        }
    }

    return null;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as CheckoutRequestBody;

        if (body.mode === "payment" && "items" in body) {
            if (!body.items.length) {
                return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
            }

            // Refuse any pack that is marked unavailable (no PDF attached yet).
            const unavailableItem = body.items.find(
                (item) => !isSlugPurchasable(item.id)
            );

            if (unavailableItem) {
                return NextResponse.json(
                    {
                        error: `"${unavailableItem.title}" is temporarily unavailable. Please remove it from your cart.`,
                        unavailableSlug: unavailableItem.id
                    },
                    { status: 400 }
                );
            }

            const discount = await getMemberDiscountPercent();
            const planId = await getMemberPlanId();
            const tierError = findTierAccessError(
                body.items.map((item) => item.id),
                planId
            );

            if (tierError) {
                return NextResponse.json(
                    { error: tierError, tierLocked: true },
                    { status: 403 }
                );
            }

            const memberFactor = (100 - discount) / 100;

            const discountFactor = memberFactor;

            const customerEmail = await getLoggedInEmail();

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
                ...(customerEmail ? { customer_email: customerEmail } : {}),
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${siteUrl}/cart`,
                allow_promotion_codes: true,
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

            if (body.slug && !isSlugPurchasable(body.slug)) {
                return NextResponse.json(
                    { error: "This pack is temporarily unavailable." },
                    { status: 400 }
                );
            }

            const discount = await getMemberDiscountPercent();
            if (body.slug) {
                const planId = await getMemberPlanId();
                const tierError = findTierAccessError([body.slug], planId);

                if (tierError) {
                    return NextResponse.json(
                        { error: tierError, tierLocked: true },
                        { status: 403 }
                    );
                }
            }

            const discountFactor = (100 - discount) / 100;
            const customerEmail = await getLoggedInEmail();

            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                ...(customerEmail ? { customer_email: customerEmail } : {}),
                success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                allow_promotion_codes: true,
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
                allow_promotion_codes: true,
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