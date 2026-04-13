// file: app/cart/page.tsx
"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useCart } from "@/components/providers/cart-provider";
import { startCheckout } from "@/lib/checkout";

export default function CartPage() {
    const { items, total, removeItem, updateQuantity, clearCart } = useCart();

    async function handleCheckout() {
        if (!items.length) return;

        try {
            await startCheckout({
                mode: "payment",
                items
            });
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Unable to start checkout.");
        }
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Cart
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Your quiz pack cart.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Review your packs, adjust quantities, then continue to Stripe checkout.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                        {!items.length ? (
                            <div className="text-center">
                                <h2 className="text-2xl font-black tracking-tight">Your cart is empty</h2>
                                <p className="mt-3 text-[var(--muted)]">
                                    Add a few quiz packs and come back here.
                                </p>
                                <Link
                                    href="/#packs"
                                    className="mt-6 inline-flex rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                                >
                                    Browse Packs
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {items.map((item) => (
                                    <article
                                        key={item.id}
                                        className="rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <p className="mt-2 text-sm text-[var(--muted)]">
                                                    {item.price} each
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                                                >
                                                    −
                                                </button>

                                                <span className="min-w-8 text-center text-sm font-bold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                                                >
                                                    +
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 hover:bg-red-500/15"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                        <h2 className="text-2xl font-black tracking-tight">Order summary</h2>

                        <div className="mt-6 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-[var(--muted)]">Items</span>
                                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-[var(--muted)]">Total</span>
                                <span className="text-xl font-black text-[var(--gold)]">
                                    €{total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={!items.length}
                                className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Checkout
                            </button>

                            <button
                                type="button"
                                onClick={clearCart}
                                disabled={!items.length}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </aside>
                </div>
            </section>

            <Footer />
        </main>
    );
}