// file: app/api/billing-portal/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

function requireEnvironmentVariable(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

const stripe = new Stripe(requireEnvironmentVariable("STRIPE_SECRET_KEY"));
const siteUrl = requireEnvironmentVariable("NEXT_PUBLIC_SITE_URL");

export async function POST() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError
        } = await supabase.auth.getUser();

        if (authError || !user?.email) {
            return NextResponse.json(
                { error: "You must be signed in to manage a subscription." },
                { status: 401 }
            );
        }

        const customers = await stripe.customers.list({
            email: user.email,
            limit: 10
        });

        const customerWithSubscription = customers.data.find(
            (customer) => !customer.deleted
        );

        if (!customerWithSubscription) {
            return NextResponse.json(
                {
                    error:
                        "No Stripe billing account was found for this email. Complete a membership purchase first."
                },
                { status: 404 }
            );
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerWithSubscription.id,
            return_url: `${siteUrl}/account`
        });

        return NextResponse.json({
            url: portalSession.url
        });
    } catch (error) {
        console.error("Stripe billing portal error:", error);

        return NextResponse.json(
            { error: "Unable to open subscription management." },
            { status: 500 }
        );
    }
}