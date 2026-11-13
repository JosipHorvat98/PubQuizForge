// file: app/api/membership/downloads/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { packs } from "@/data/site";
import {
    currentPeriodStart,
    getPlanEntitlements,
    canAccessPackWithPlanId,
    packTier,
    PACK_TIER_LABEL
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

        let membership: Awaited<
            ReturnType<typeof findActiveMembershipForEmail>
        > = null;

        try {
            membership = await findActiveMembershipForEmail(user.email);
        } catch (error) {
            console.error("membership download lookup failed", error);
        }

        // Credits persist after a subscription is cancelled, so a missing
        // active membership is fine as long as credits are still available.
        const credits = await getCreditsForEmail(user.email);

        if (!membership && !(credits && credits.credits_available > 0)) {
            return NextResponse.json(
                { error: "No active membership or pack credits found." },
                { status: 403 }
            );
        }

        // Tier for redemption: the active plan if any, otherwise the plan that
        // granted the remaining credits (so a cancelled Gold can still redeem).
        const planIdForAccess = membership?.plan_id ?? credits?.plan_id ?? null;

        if (!planIdForAccess) {
            return NextResponse.json(
                { error: "Unknown membership plan." },
                { status: 403 }
            );
        }

        if (!canAccessPackWithPlanId(pack, planIdForAccess)) {
            return NextResponse.json(
                {
                    error: `This pack requires a ${PACK_TIER_LABEL[packTier(pack)]} membership or higher. Upgrade to redeem it.`,
                    tierLocked: true
                },
                { status: 403 }
            );
        }

        let creditsAvailable: number | null = null;

        if (credits) {
            creditsAvailable = credits.credits_available;

            if (creditsAvailable <= 0) {
                return NextResponse.json(
                    {
                        error: "No pack credits left. Buy a pack or renew your membership to continue.",
                        creditExhausted: true
                    },
                    { status: 403 }
                );
            }

            const consumed = await consumeCredit(user.email);

            if (!consumed.success) {
                return NextResponse.json(
                    { error: "No pack credits left.", creditExhausted: true },
                    { status: 403 }
                );
            }

            creditsAvailable = consumed.credits_available;
        } else {
            // Legacy fallback (no credits ledger yet): requires an active
            // membership and counts this month's membership downloads.
            if (!membership) {
                return NextResponse.json(
                    { error: "No pack credits found." },
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
