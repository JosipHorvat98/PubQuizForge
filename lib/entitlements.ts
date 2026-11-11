// file: lib/entitlements.ts
import { packs, type Pack, type PackTier } from "@/data/site";

export type PlanId = "bronze" | "silver" | "gold";

/**
 * Membership entitlements expressed as a monthly pack-credit allowance.
 *
 * Model (Varianta A — čisti credits):
 *  - Bronze: 1 credit/month, rollover cap 2, 10% off extra packs.
 *  - Silver: 3 credits/month, rollover cap 6, 20% off extra packs.
 *  - Gold:   5 credits/month, rollover cap 12, 30% off extra packs.
 *
 * One credit redeems one standard pack and permanently adds it to the user's
 * downloads. Cancelling does not remove packs already redeemed.
 */
export type PlanEntitlements = {
    planId: PlanId;
    name: string;
    rank: number;
    /** Credits granted at the start of each billing month. */
    monthlyCredits: number;
    /** Max unused credits that carry over into the next billing month. */
    maxRollover: number;
    /** Percentage discount on a-la-carte pack purchases (0 = none). */
    extraPackDiscount: number;
    summary: string;
};

export const PLAN_ENTITLEMENTS: Record<PlanId, PlanEntitlements> = {
    bronze: {
        planId: "bronze",
        name: "Bronze",
        rank: 1,
        monthlyCredits: 1,
        maxRollover: 2,
        extraPackDiscount: 10,
        summary: "1 pack credit per month (roll over up to 2)"
    },
    silver: {
        planId: "silver",
        name: "Silver",
        rank: 2,
        monthlyCredits: 3,
        maxRollover: 6,
        extraPackDiscount: 20,
        summary: "3 pack credits per month (roll over up to 6)"
    },
    gold: {
        planId: "gold",
        name: "Gold",
        rank: 3,
        monthlyCredits: 5,
        maxRollover: 12,
        extraPackDiscount: 30,
        summary: "5 pack credits per month + 30% off"
    }
};

export function getPlanEntitlements(planId: string | undefined): PlanEntitlements | null {
    if (!planId) {
        return null;
    }

    const key = planId.toLowerCase() as PlanId;

    return PLAN_ENTITLEMENTS[key] ?? null;
}

export const PACK_TIER_RANK: Record<PackTier, number> = {
    free: 0,
    bronze: 1,
    silver: 2,
    gold: 3
};

export const PACK_TIER_LABEL: Record<PackTier, string> = {
    free: "No tier",
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold"
};

/** The membership tier a pack is gated behind. */
export function packTier(pack: Pack): PackTier {
    return pack.tier;
}

/** Rank required to access a pack (free = 0 … gold = 3). */
export function packTierRank(pack: Pack): number {
    return PACK_TIER_RANK[packTier(pack)];
}

/** Rank of a membership plan id (no membership = 0). */
export function planRank(planId?: string | null): number {
    return getPlanEntitlements(planId ?? undefined)?.rank ?? 0;
}

/**
 * Whether a user on `planId` (null/undefined = no membership) may buy or
 * redeem `pack`. Free packs are open to everyone; bronze+ packs require the
 * matching tier or higher (bronze → bronze/silver/gold, silver → silver/gold,
 * gold → gold only).
 */
export function canAccessPackWithPlanId(
    pack: Pack,
    planId?: string | null
): boolean {
    return planRank(planId) >= packTierRank(pack);
}

/** Whether a pack has a real PDF to download at all. */
export function packHasPdf(pack: Pack): boolean {
    return Boolean(pack.pdfPath);
}

/** Any member with an available credit can redeem any standard pack for it. */
export function canRedeemWithCredits(pack: Pack): boolean {
    return packHasPdf(pack);
}

export function parsePackPriceToCents(pack: Pack): number {
    const numeric = Number(pack.price.replace("€", "").replace(",", ".").trim());

    if (Number.isNaN(numeric)) {
        return 0;
    }

    return Math.round(numeric * 100);
}

/** A-la-carte price for a member, with the tier discount already applied. */
export function getPackPriceForMember(
    plan: PlanEntitlements,
    pack: Pack
): number {
    const cents = parsePackPriceToCents(pack);

    return Math.round((cents * (100 - plan.extraPackDiscount)) / 100);
}

/** Start of the current calendar month (UTC) — used for legacy usage fallback. */
export function currentPeriodStart(): string {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));

    return start.toISOString();
}

/** Ensure all referenced pack ids in metadata resolve to real packs. */
export function packBySlug(slug: string): Pack | undefined {
    return packs.find((pack) => pack.id === slug);
}
