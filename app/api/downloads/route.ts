// file: app/api/downloads/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing ${name}`);
    }

    return value;
}

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Missing session_id" },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const email = session.customer_details?.email ?? session.customer_email ?? null;

        if (!email) {
            return NextResponse.json({ downloads: [], email: null });
        }

        const { data, error } = await supabaseAdmin
            .from("downloads")
            .select("id, title, email, type, created_at, pack_slug, download_url")
            .eq("email", email)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase select error:", error);

            return NextResponse.json(
                { error: "Unable to load downloads" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            email,
            downloads: data ?? []
        });
    } catch (error) {
        console.error("Downloads lookup error:", error);

        return NextResponse.json(
            { error: "Unable to load downloads" },
            { status: 500 }
        );
    }
}