// file: app/packs/[slug]/page.tsx
"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { useCart } from "@/components/providers/cart-provider";
import { packs } from "@/data/site";
import { startCheckout } from "@/lib/checkout";

export default function PackPage() {
    const params = useParams<{ slug: string }>();
    const { addItem } = useCart();
    const pack = packs.find((item) => item.id === params.slug);

    if (!pack) {
        notFound();
    }

    const relatedPacks = packs
        .filter((item) => item.category === pack.category && item.id !== pack.id)
        .slice(0, 3);

    async function handleBuyNow() {
        try {
            const numericPrice = Number(pack.price.replace("€", ""));
            const unitAmount = Math.round(numericPrice * 100);

            await startCheckout({
                mode: "payment",
                productName: pack.title,
                unitAmount,
                quantity: 1,
                slug: pack.id
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
                <div className="container-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                            {pack.categoryLabel}
                        </div>

                        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                            {pack.title}
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                            A ready-to-host quiz pack designed for fast setup and a polished quiz
                            night experience.
                        </p>
                    </div>

                    <aside className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                        <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-[var(--surface-2)]">
                            <div
                                className="absolute inset-0 opacity-35"
                                style={{ background: pack.glow }}
                            />
                            <span className="relative text-8xl">{pack.emoji}</span>
                        </div>

                        <div className="mt-6 text-5xl font-black tracking-tight text-[var(--gold)]">
                            {pack.price}
                        </div>

                        <div className="mt-6 grid gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    addItem({
                                        id: pack.id,
                                        title: pack.title,
                                        price: pack.price
                                    })
                                }
                                className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                            >
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                onClick={handleBuyNow}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                            >
                                Buy Now
                            </button>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                            Related packs
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {relatedPacks.map((item) => (
                            <article
                                key={item.id}
                                className="overflow-hidden rounded-3xl border border-white/8 bg-[var(--surface)]"
                            >
                                <div className="relative flex h-36 items-center justify-center overflow-hidden">
                                    <div
                                        className="absolute inset-0 opacity-35"
                                        style={{ background: item.glow }}
                                    />
                                    <span className="relative text-6xl">{item.emoji}</span>
                                </div>

                                <div className="p-5">
                                    <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                        {item.categoryLabel}
                                    </div>

                                    <h3 className="mt-2 text-xl font-bold">{item.title}</h3>

                                    <div className="mt-4 flex items-center justify-between gap-3">
                                        <span className="text-2xl font-black tracking-tight text-[var(--gold)]">
                                            {item.price}
                                        </span>
                                        <Link
                                            href={`/packs/${item.id}`}
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                                        >
                                            View Pack
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}