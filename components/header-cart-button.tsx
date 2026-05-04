// file: components/header-cart-button.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";

export function HeaderCartButton() {
    const { count } = useCart();

    return (
        <Link
            href="/cart"
            className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black hover:bg-[var(--gold-strong)]"
        >
            🛒 Cart ({count})
        </Link>
    );
}