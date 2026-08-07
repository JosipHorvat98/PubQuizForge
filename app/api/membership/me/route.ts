// file: app/api/membership/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { findActiveMembershipForEmail } from "@/lib/memberships";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    currentPeriodStart,
    getPlanEntitlements
} from "@/lib/entitlements";
import {
    getCreditsForEmail,
    getCreditsUsedForEmail
} from "@/lib/membership-credits";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json({
                isMember: false,
                membership: null,
                entitlements: null,
                usageThisPeriod: 0,
                creditsAvailable: null,
                creditsUsed: 0,
                creditsLedgerReady: false
            });
        }

        let membership;
        let lookupFailed = false;

        try {
            membership = await findActiveMembershipForEmail(user.email);
        } catch (error) {
            console.error("membership/me lookup failed", error);
            lookupFailed = true;
        }

        if (!membership) {
            return NextResponse.json({
                isMember: false,
                membership: null,
                entitlements: null,
                usageThisPeriod: 0,
                creditsAvailable: null,
                creditsUsed: 0,
                creditsLedgerReady: false,
                lookupFailed
            });
        }

        const entitlements = getPlanEntitlements(membership.plan_id);

        // Legacy monthly usage (membership downloads this month). Used only as
        // a display/aid until the credits ledger is live.
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

        // Credits ledger state.
        let creditsAvailable: number | null = null;
        let creditsUsed = 0;
        let creditsLedgerReady = false;

        try {
            const credits = await getCreditsForEmail(user.email);
            creditsLedgerReady = Boolean(credits);

            if (credits) {
                creditsAvailable = credits.credits_available;
                creditsUsed = await getCreditsUsedForEmail(user.email);
            }
        } catch (error) {
            console.error("Unable to load credits ledger:", error);
        }

        return NextResponse.json({
            isMember: true,
            membership,
            entitlements,
            usageThisPeriod,
            creditsAvailable,
            creditsUsed,
            creditsLedgerReady
        });
    } catch (error) {
        console.error("membership/me error:", error);

        return NextResponse.json(
            { error: "Unable to load membership" },
            { status: 500 }
        );
    }
}
