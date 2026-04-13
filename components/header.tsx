// file: components/header.tsx
"use client";

import Link from "next/link";
import { navLinks } from "@/data/site";
import { useCart } from "@/components/providers/cart-provider";

export function Header() {
    const { count } = useCart();

    return (
        <header className="sticky top-0 z-50 border-b border-white/8 bg-black/45 backdrop-blur-xl">
            <div className="container-shell flex h-16 items-center justify-between gap-4">
                <Link href="/" className="text-xl font-black tracking-[0.18em] uppercase">
                    PubQuiz<span className="text-[var(--gold)]">Forge</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={
                                index === 0
                                    ? "text-sm font-semibold text-white"
                                    : "text-sm font-medium text-[var(--muted)] hover:text-white"
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="text-sm font-medium text-[var(--muted)] hover:text-white"
                    >
                        Contact
                    </Link>
                </nav>

                <Link
                    href="/cart"
                    className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black hover:bg-[var(--gold-strong)]"
                >
                    🛒 Cart ({count})
                </Link>
            </div>
        </header>
    );
}