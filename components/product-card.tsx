// file: components/product-card.tsx
"use client";

import Link from "next/link";
import type { Pack } from "@/data/site";
import { useCart } from "@/components/providers/cart-provider";

type ProductCardProps = {
    pack: Pack;
};

export function ProductCard({ pack }: ProductCardProps) {
    const { addItem } = useCart();

    return (
        <article className="overflow-hidden rounded-3xl border border-white/8 bg-[var(--surface)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(245,200,66,0.24)] hover:shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
            <Link href={`/packs/${pack.id}`} className="block">
                <div className="relative flex h-36 items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-35"
                        style={{ background: pack.glow }}
                    />
                    <span className="relative text-6xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                        {pack.emoji}
                    </span>
                </div>
            </Link>

            <div className="flex h-full flex-col p-5">
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                    {pack.categoryLabel}
                </div>

                <Link href={`/packs/${pack.id}`} className="mt-2 block">
                    <h3 className="flex-1 text-xl font-bold leading-7 hover:text-[var(--gold)]">
                        {pack.title}
                    </h3>
                </Link>

                <div className="mt-4 flex flex-wrap gap-2">
                    {pack.badges.map((badge) => {
                        const isHot = badge.includes("🔥");
                        const isNew = badge.includes("✦");

                        return (
                            <span
                                key={badge}
                                className={[
                                    "rounded-full px-3 py-1 text-xs font-semibold",
                                    isHot
                                        ? "bg-red-500/12 text-red-300"
                                        : isNew
                                            ? "bg-green-500/12 text-green-300"
                                            : "bg-[var(--surface-2)] text-[var(--muted)]"
                                ].join(" ")}
                            >
                                {badge}
                            </span>
                        );
                    })}
                </div>

                <div className="mt-5 flex items-center gap-3">
                    <div className="text-3xl font-black tracking-tight text-[var(--gold)]">
                        {pack.price}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            addItem({
                                id: pack.id,
                                title: pack.title,
                                price: pack.price
                            })
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                    >
                        Add to Cart
                    </button>

                    <Link
                        href={`/packs/${pack.id}`}
                        className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                    >
                        View Pack
                    </Link>
                </div>
            </div>
        </article>
    );
}