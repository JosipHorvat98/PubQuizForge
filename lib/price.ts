// file: lib/price.ts
/**
 * Single source of truth for pack prices.
 *
 * Stored/displayed format is always `€4.99`. Inputs may be `5`, `5.00`, `€5`,
 * `4,99`, `EUR 5` etc. — everything is normalised through these helpers so the
 * euro sign is never missing in the UI.
 */

const CURRENCY_PATTERN = /(?:€|eur)/gi;

export function parsePriceToCents(
    value: string | number | null | undefined
): number | null {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === "number") {
        return Number.isFinite(value) ? Math.round(value * 100) : null;
    }

    const normalized = value
        .replace(CURRENCY_PATTERN, "")
        .replace(/,/g, ".")
        .replace(/[^0-9.]/g, "")
        .trim();

    if (!normalized) {
        return null;
    }

    const amount = Number(normalized);

    if (!Number.isFinite(amount) || amount < 0) {
        return null;
    }

    return Math.round(amount * 100);
}

export function formatCents(cents: number): string {
    return `€${(Math.max(0, Math.round(cents)) / 100).toFixed(2)}`;
}

/** `"5" -> "€5.00"`, `"€4.99" -> "€4.99"`; invalid input -> null. */
export function normalizePrice(
    value: string | number | null | undefined
): string | null {
    const cents = parsePriceToCents(value);

    return cents === null ? null : formatCents(cents);
}

/** Currency for display; falls back to the raw value when unparsable. */
export function formatPrice(value: string | number | null | undefined): string {
    const cents = parsePriceToCents(value);

    if (cents === null) {
        return value === null || value === undefined ? "" : String(value);
    }

    return formatCents(cents);
}

/** Numeric text for editable inputs: `"€5.00" -> "5.00"`. */
export function priceInputValue(value: string | null | undefined): string {
    const cents = parsePriceToCents(value);

    return cents === null ? "" : (cents / 100).toFixed(2);
}
