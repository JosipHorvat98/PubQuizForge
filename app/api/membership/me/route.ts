// file: app/api/membership/me/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { hasSessionCookie } from "@/lib/session-cookie";
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

const EMPTY = {
    isMember: false,
    membership: null,
    entitlements: null,
    usageThisPeriod: 0,
    creditsAvailable: null,
    creditsUsed: 0,
    creditsLedgerReady: false,
    creditsPlanId: null
};

export async function GET() {
    // Cheap gate: no session cookie -> anonymous browser, don't hit auth.
    if (!(await hasSessionCookie())) {
        return NextResponse.json(EMPTY);
    }

    try {
        const supabase = await createClient();

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user?.email) {
            return NextResponse.json(EMPTY);
        }

        let membership: Awaited<
            ReturnType<typeof findActiveMembershipForEmail>
        > = null;
        let lookupFailed = false;

        try {
            membership = await findActiveMembershipForEmail(user.email);
        } catch (error) {
            console.error("membership/me lookup failed", error);
            lookupFailed = true;
        }

        const entitlements = membership
            ? getPlanEntitlements(membership.plan_id)
            : null;

        // Legacy monthly usage (membership downloads this month). Display only.
        let usageThisPeriod = 0;

        if (membership) {
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
        }

        // Credits ledger state. Read even without an active membership so a
        // cancelled customer keeps (and can spend) the credits they earned.
        let creditsAvailable: number | null = null;
        let creditsUsed = 0;
        let creditsLedgerReady = false;
        let creditsPlanId: string | null = null;

        try {
            const credits = await getCreditsForEmail(user.email);
            creditsLedgerReady = Boolean(credits);

            if (credits) {
                creditsAvailable = credits.credits_available;
                creditsPlanId = credits.plan_id;
                creditsUsed = await getCreditsUsedForEmail(user.email);
            }
        } catch (error) {
            console.error("Unable to load credits ledger:", error);
        }

        return NextResponse.json({
            isMember: Boolean(membership),
            membership,
            entitlements,
            usageThisPeriod,
            creditsAvailable,
            creditsUsed,
            creditsLedgerReady,
            creditsPlanId,
            lookupFailed
        });
    } catch (error) {
        console.error("membership/me error:", error);

        return NextResponse.json(
            { error: "Unable to load membership" },
            { status: 500 }
        );
    }
}
