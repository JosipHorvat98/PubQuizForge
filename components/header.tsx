// file: components/header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { navLinks } from "@/data/site";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/components/providers/cart-provider";

export function Header() {
    const [user, setUser] = useState<User | null>(null);
    const { count } = useCart();

    useEffect(() => {
        const supabase = createClient();

        async function loadUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            setUser(user);
        }

        loadUser();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/8 bg-black/45 backdrop-blur-xl">
            <div className="container-shell flex h-16 items-center justify-between gap-4">
                <Link href="/" className="text-xl font-black uppercase tracking-[0.18em]">
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

                    {user ? (
                        <>
                            <Link
                                href="/account"
                                className="text-sm font-semibold text-white hover:text-[var(--gold)]"
                            >
                                Account
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm font-medium text-[var(--muted)] hover:text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-semibold text-white hover:text-[var(--gold)]"
                            >
                                Login
                            </Link>

                            <Link
                                href="/signup"
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
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