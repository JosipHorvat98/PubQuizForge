// file: app/api/membership/downloads/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { packs } from "@/data/site";
import {
    currentPeriodStart,
    getPlanEntitlements
} from "@/lib/entitlements";
import {
    consumeCredit,
    getCreditsForEmail
} from "@/lib/membership-credits";
import {
    createPackDownloadUrl,
    packHasDownloadable
} from "@/lib/pack-files";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { packId?: string };
        const packId = body.packId ?? "";

        if (!packId) {
            return NextResponse.json(
                { error: "Missing packId" },
                { status: 400 }
            );
        }

        const pack = packs.find((candidate) => candidate.id === packId);

        if (!pack) {
            return NextResponse.json(
                { error: "Pack not found" },
                { status: 404 }
            );
        }

        if (!packHasDownloadable(pack)) {
            return NextResponse.json(
                { error: "This pack does not have a PDF available yet." },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json(
                { error: "You must be signed in to redeem pack credits." },
                { status: 401 }
            );
        }

        let membership;

        try {
            membership = await findActiveMembershipForEmail(user.email);
        } catch (error) {
            console.error("membership download lookup failed", error);

            return NextResponse.json(
                { error: "Unable to verify your membership. Please try again." },
                { status: 500 }
            );
        }

        if (!membership) {
            return NextResponse.json(
                { error: "No active membership found." },
                { status: 403 }
            );
        }

        const entitlements = getPlanEntitlements(membership.plan_id);

        if (!entitlements) {
            return NextResponse.json(
                { error: "Unknown membership plan." },
                { status: 403 }
            );
        }

        let creditsAvailable: number | null = null;

        // Prefer the credits ledger when it exists; otherwise fall back to the
        // legacy per-month download counter so nothing breaks pre-migration.
        try {
            const credits = await getCreditsForEmail(user.email);

            if (credits) {
                creditsAvailable = credits.credits_available;
            }
        } catch (error) {
            console.error("Unable to read credits ledger:", error);
        }

        if (creditsAvailable !== null) {
            if (creditsAvailable <= 0) {
                return NextResponse.json(
                    {
                        error: `No pack credits left. Your ${entitlements.monthlyCredits} credit(s) refresh with your next billing cycle — or upgrade for more.`,
                        creditExhausted: true
                    },
                    { status: 403 }
                );
            }

            const consumed = await consumeCredit(user.email);

            if (!consumed.success) {
                return NextResponse.json(
                    { error: "No pack credits left. They refresh with your next billing cycle." },
                    { status: 403 }
                );
            }

            creditsAvailable = consumed.credits_available;
        } else {
            // Legacy fallback: count this month's membership downloads.
            let usageThisPeriod = 0;

            try {
                const { count, error } = await supabaseAdmin
                    .from("downloads")
                    .select("id", { count: "exact", head: true })
                    .eq("email", user.email)
                    .eq("type", "pack")
                    .eq("source", "membership")
                    .gte("created_at", currentPeriodStart());

                if (!error) {
                    usageThisPeriod = count ?? 0;
                }
            } catch (error) {
                console.error("Unable to count monthly membership usage:", error);
            }

            if (usageThisPeriod >= entitlements.monthlyCredits) {
                return NextResponse.json(
                    {
                        error: `You've used all ${entitlements.monthlyCredits} of your monthly pack downloads.`,
                        limitExceeded: true
                    },
                    { status: 403 }
                );
            }
        }

        // Generate a short-lived signed Storage URL for the owning member.
        const downloadUrl = await createPackDownloadUrl(pack);

        if (!downloadUrl) {
            return NextResponse.json(
                { error: "This pack is not available right now. Please try again later." },
                { status: 503 }
            );
        }

        // Record the member download. Best-effort: the link is handed out
        // regardless so a missing `source` column doesn't lock members out.
        try {
            await supabaseAdmin.from("downloads").upsert({
                id: `${user.email}:${pack.id}:${Date.now()}`,
                title: pack.title,
                email: user.email,
                type: "pack",
                source: "membership",
                created_at: new Date().toISOString(),
                pack_slug: pack.id,
                download_url: downloadUrl
            });
        } catch (error) {
            console.error("Unable to record member download:", error);
        }

        return NextResponse.json({
            download_url: downloadUrl,
            creditsAvailable
        });
    } catch (error) {
        console.error("membership download error:", error);

        return NextResponse.json(
            { error: "Unable to start download." },
            { status: 500 }
        );
    }
}
