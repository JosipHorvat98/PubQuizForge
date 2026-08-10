// file: app/cart/page.tsx
"use client";

import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useCart } from "@/components/providers/cart-provider";
import { useMembership } from "@/components/providers/membership-provider";
import { startCheckout } from "@/lib/checkout";

function formatEuro(amount: number) {
    return `€${amount.toFixed(2)}`;
}

function parsePrice(price: string): number {
    return Number(price.replace("€", "").trim()) || 0;
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart } = useCart();
    const { isMember, entitlements } = useMembership();

    const discountPercent =
        isMember && entitlements ? entitlements.extraPackDiscount : 0;
    const hasMemberDiscount = discountPercent > 0;

    // "3 for the price of 2": 3+ packs in the cart -> pay for 2 (2/3 total).
    const hasDeal = items.length >= 3;
    const dealFactor = hasDeal ? 2 / 3 : 1;

    const hasDiscount = hasMemberDiscount || hasDeal;

    const memberFactor = (100 - discountPercent) / 100;
    const discountFactor = memberFactor * dealFactor;

    const summaryOriginal = items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
    );
    const summaryTotal = summaryOriginal * discountFactor;
    const savings = summaryOriginal - summaryTotal;

    async function handleCheckout() {
        if (!items.length) {
            return;
        }

        try {
            await startCheckout({
                mode: "payment",
                items: items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Unable to start checkout.");
        }
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-40">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Cart
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Your cart.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Review your packs, adjust quantities, and continue to checkout when ready.
                    </p>

                    {!items.length ? (
                        <div className="mt-10 rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                            <p className="text-[var(--muted)]">Your cart is empty.</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/#packs"
                                    className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                                >
                                    Browse Packs
                                </Link>

                                <Link
                                    href="/memberships"
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                                >
                                    View Memberships
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mt-10 grid gap-4">
                                {items.map((item) => {
                                    const itemTotal = parsePrice(item.price) * item.quantity;
                                    const discountedTotal = itemTotal * discountFactor;

                                    return (
                                        <article
                                            key={item.id}
                                            className="rounded-[24px] border border-white/8 bg-[var(--surface)] p-5 md:p-6"
                                        >
                                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                                <div className="min-w-0">
                                                    <h2 className="text-2xl font-black tracking-tight">{item.title}</h2>
                                                    <p className="mt-2 text-sm text-[var(--muted)]">
                                                        Unit price:{" "}
                                                        {hasDiscount ? (
                                                            <>
                                                                <span className="line-through">{item.price}</span>{" "}
                                                                <span className="font-semibold text-[var(--gold)]">
                                                                    {formatEuro(
                                                                        parsePrice(item.price) * discountFactor
                                                                    )}
                                                                </span>{" "}
                                                                <span className="text-green-300">
                                                                    ({discountPercent}% off)
                                                                </span>
                                                            </>
                                                        ) : (
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-4 md:items-end">
                                                    <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="px-4 py-3 text-lg font-bold text-white hover:bg-white/10"
                                                            aria-label={`Decrease quantity for ${item.title}`}
                                                        >
                                                            -
                                                        </button>

                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={item.quantity}
                                                            onChange={(event) =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    Math.max(1, Number(event.target.value) || 1)
                                                                )
                                                            }
                                                            className="w-16 border-x border-white/10 bg-transparent px-2 py-3 text-center text-sm font-bold text-white outline-none"
                                                            aria-label={`Quantity for ${item.title}`}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="px-4 py-3 text-lg font-bold text-white hover:bg-white/10"
                                                            aria-label={`Increase quantity for ${item.title}`}
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {hasDiscount ? (
                                                            <span className="text-sm font-semibold text-[var(--muted)] line-through">
                                                                {formatEuro(itemTotal)}
                                                            </span>
                                                        ) : null}

                                                        <span className="text-xl font-black tracking-tight text-[var(--gold)]">
                                                            {formatEuro(discountedTotal)}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/#packs"
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                                >
                                    Continue Shopping
                                </Link>

                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 hover:bg-red-500/15"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {items.length ? (
                <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-black/75 backdrop-blur-xl">
                    <div className="container-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                Order Summary
                            </p>
                            <div className="mt-1 flex items-center gap-3">
                                <span className="text-sm text-[var(--muted)]">
                                    {items.length} item{items.length === 1 ? "" : "s"}
                                </span>

                                {hasDiscount ? (
                                    <span className="text-lg font-semibold text-[var(--muted)] line-through">
                                        {formatEuro(summaryOriginal)}
                                    </span>
                                ) : null}

                                <span className="text-2xl font-black tracking-tight text-[var(--gold)]">
                                    {formatEuro(summaryTotal)}
                                </span>
                            </div>

                            {hasDiscount ? (
                                <p className="mt-1 text-xs font-semibold text-green-300">
                                    {hasDeal ? "3 for the price of 2 · " : ""}
                                    {hasMemberDiscount
                                        ? `${discountPercent}% member discount · `
                                        : ""}
                                    you save {formatEuro(savings)}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/#packs"
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
                            >
                                Continue Shopping
                            </Link>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <Footer />
        </main>
    );
}