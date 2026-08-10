// file: lib/promo.ts
// Shared promo-code + "3 for 2" deal helpers (safe for client and server).

export const PACK_PROMO_CODE = "trivia3";

/** Case-insensitive check that a code is the pack promo code. */
export function isPackPromoCode(code: string): boolean {
    return code.trim().toLowerCase() === PACK_PROMO_CODE;
}

/** One free pack for every three purchased. */
export function packsFreeCount(totalPacks: number): number {
    return Math.floor(Math.max(0, totalPacks) / 3);
}

/** Fraction of the total the customer pays with the promo applied. */
export function packsPromoFactor(totalPacks: number): number {
    const free = packsFreeCount(totalPacks);

    if (free <= 0 || totalPacks <= 0) {
        return 1;
    }

    return (totalPacks - free) / totalPacks;
}