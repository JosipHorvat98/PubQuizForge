// file: components/product-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Pack } from "@/data/site";
import { useCart } from "@/components/providers/cart-provider";
import { useMembership } from "@/components/providers/membership-provider";
import { canRedeemWithCredits } from "@/lib/entitlements";

function formatEuro(amount: number) {
    return `€${amount.toFixed(2)}`;
}

function parsePrice(price: string): number {
    return Number(price.replace("€", "").trim()) || 0;
}

type ProductCardProps = {
    pack: Pack;
};

export function ProductCard({ pack }: ProductCardProps) {
    const { addItem } = useCart();
    const {
        isMember,
        entitlements,
        creditsAvailable,
        loading: membershipLoading,
        reload: reloadMembership
    } = useMembership();
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const hasPdf = canRedeemWithCredits(pack);

    // Member a-la-carte price with the tier discount (mirrors the checkout API).
    const discountPercent =
        isMember && entitlements ? entitlements.extraPackDiscount : 0;
    const hasDiscount = discountPercent > 0;
    const memberPrice = hasDiscount
        ? parsePrice(pack.price) * ((100 - discountPercent) / 100)
        : parsePrice(pack.price);

    // A member can redeem the pack only when they have at least one credit
    // available and the pack actually ships a PDF.
    const canRedeem =
        isMember && creditsAvailable !== null && creditsAvailable > 0 && hasPdf;

    async function handleMemberDownload() {
        setDownloadError(null);
        setDownloading(true);

        try {
            const response = await fetch("/api/membership/downloads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packId: pack.id })
            });

            const data = (await response.json()) as {
                download_url?: string;
                error?: string;
            };

            if (!response.ok || !data.download_url) {
                setDownloadError(data.error ?? "Unable to start download.");
                return;
            }

            window.open(data.download_url, "_blank", "noopener,noreferrer");
            // Refresh the credit balance shown across the UI.
            void reloadMembership();
        } catch {
            setDownloadError("Unable to start download.");
        } finally {
            setDownloading(false);
        }
    }

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
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                        {pack.categoryLabel}
                    </span>

                    {isMember && hasPdf && creditsAvailable !== null ? (
                        <span
                            className={
                                canRedeem
                                    ? "rounded-full bg-green-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-300"
                                    : "rounded-full bg-white/6 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]"
                            }
                        >
                            {canRedeem
                                ? `${creditsAvailable} credit${creditsAvailable === 1 ? "" : "s"} left`
                                : "No credits left"}
                        </span>
                    ) : null}
                </div>

                <Link href={`/packs/${pack.id}`} className="mt-2 block">
                    <h3 className="flex-1 text-xl font-bold leading-7 hover:text-[var(--gold)]">
                        {pack.title}
                    </h3>
                </Link>

                <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-tight text-[var(--gold)]">
                        {hasDiscount ? formatEuro(memberPrice) : pack.price}
                    </span>

                    {hasDiscount ? (
                        <>
                            <span className="text-sm font-semibold text-[var(--muted)] line-through">
                                {pack.price}
                            </span>
                            <span className="rounded-full bg-green-500/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-300">
                                {discountPercent}% off
                            </span>
                        </>
                    ) : null}
                </div>

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
                {downloadError ? (
                    <p className="mt-3 text-xs font-semibold text-red-300">
                        {downloadError}
                    </p>
                ) : null}

                <div className="mt-5 flex items-center gap-3">
                    {isMember && !membershipLoading && canRedeem ? (
                        <button
                            type="button"
                            onClick={handleMemberDownload}
                            disabled={downloading}
                            className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {downloading ? "Preparing..." : "Redeem · 1 credit"}
                        </button>
                    ) : (
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
                    )}

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
