// file: components/packs-section.tsx
"use client";

import { useMemo, useState } from "react";
import {
    packCategories,
    packs,
    type PackCategory,
    type PackTier
} from "@/data/site";
import {
    packHasPdf,
    packTier,
    PACK_TIER_RANK
} from "@/lib/entitlements";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { cx } from "@/lib/utils";

type AvailabilityFilter = "all" | "available" | "unavailable";

export function PacksSection() {
    const [activeCategory, setActiveCategory] = useState<PackCategory>("all");
    const [activeTier, setActiveTier] = useState<PackTier | "all">("all");
    const [activeAvailability, setActiveAvailability] =
        useState<AvailabilityFilter>("all");

    // Group by tier (free → bronze → silver → gold), then alphabetically.
    const sortedPacks = useMemo(
        () =>
            packs.slice().sort((a, b) => {
                const byTier =
                    PACK_TIER_RANK[packTier(a)] - PACK_TIER_RANK[packTier(b)];

                return byTier !== 0 ? byTier : a.title.localeCompare(b.title);
            }),
        []
    );

    const filteredPacks = useMemo(() => {
        return sortedPacks.filter((pack) => {
            const matchesCategory =
                activeCategory === "all" || pack.category === activeCategory;
            const matchesTier =
                activeTier === "all" || packTier(pack) === activeTier;
            const available = packHasPdf(pack);
            const matchesAvailability =
                activeAvailability === "all" ||
                (activeAvailability === "available" ? available : !available);

            return matchesCategory && matchesTier && matchesAvailability;
        });
    }, [sortedPacks, activeCategory, activeTier, activeAvailability]);

    const tierFilters: Array<{ id: PackTier | "all"; label: string }> = [
        { id: "all", label: "All tiers" },
        { id: "free", label: "No tier" },
        { id: "bronze", label: "Bronze" },
        { id: "silver", label: "Silver" },
        { id: "gold", label: "Gold" }
    ];

    const tierCounts = useMemo(() => {
        const counts: Record<string, number> = {
            all: packs.length,
            free: 0,
            bronze: 0,
            silver: 0,
            gold: 0
        };

        for (const pack of packs) {
            counts[packTier(pack)] += 1;
        }

        return counts;
    }, []);

    const availabilityFilters: Array<{
        id: AvailabilityFilter;
        label: string;
    }> = [
        { id: "all", label: "All" },
        { id: "available", label: "Available" },
        { id: "unavailable", label: "Unavailable" }
    ];

    const availabilityCounts = useMemo(() => {
        let available = 0;

        for (const pack of packs) {
            if (packHasPdf(pack)) {
                available += 1;
            }
        }

        return {
            all: packs.length,
            available,
            unavailable: packs.length - available
        } as Record<AvailabilityFilter, number>;
    }, []);

    function tierActiveClass(id: PackTier | "all"): string {
        switch (id) {
            case "free":
                return "border-emerald-400/50 bg-emerald-500/15 text-emerald-300";
            case "bronze":
                return "border-[var(--bronze)] bg-[var(--bronze-dim)] text-[var(--bronze)]";
            case "silver":
                return "border-[var(--silver)] bg-[var(--silver-dim)] text-[var(--silver)]";
            case "gold":
                return "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]";
            default:
                return "border-[var(--gold)] bg-[var(--gold)] text-black";
        }
    }

    return (
        <section id="packs" className="section-space">
            <div className="container-shell">
                <SectionHeading
                    label="Digital Packs"
                    title="Question Bundles"
                    subtitle="50 questions per pack · Answer sheet included · Instant PDF download"
                />

                <div className="mb-4 flex flex-wrap gap-3">
                    {packCategories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setActiveCategory(category.id)}
                            className={cx(
                                "rounded-full border px-4 py-2 text-sm font-semibold",
                                activeCategory === category.id
                                    ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                                    : "border-white/8 bg-transparent text-[var(--muted)] hover:border-white/20 hover:text-white"
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                        Tier
                    </span>
                    {tierFilters.map((tier) => {
                        const isActive = activeTier === tier.id;

                        return (
                            <button
                                key={tier.id}
                                type="button"
                                onClick={() => setActiveTier(tier.id)}
                                className={cx(
                                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                    isActive
                                        ? tierActiveClass(tier.id)
                                        : "border-white/8 bg-transparent text-[var(--muted)] hover:border-white/20 hover:text-white"
                                )}
                            >
                                {tier.label}
                                <span className="ml-2 text-xs opacity-70">
                                    {tierCounts[tier.id]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="mr-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                        Availability
                    </span>
                    {availabilityFilters.map((option) => {
                        const isActive = activeAvailability === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setActiveAvailability(option.id)}
                                className={cx(
                                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                                    isActive
                                        ? option.id === "available"
                                            ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                                            : option.id === "unavailable"
                                                ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                                                : "border-[var(--gold)] bg-[var(--gold)] text-black"
                                        : "border-white/8 bg-transparent text-[var(--muted)] hover:border-white/20 hover:text-white"
                                )}
                            >
                                {option.label}
                                <span className="ml-2 text-xs opacity-70">
                                    {availabilityCounts[option.id]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {filteredPacks.length === 0 ? (
                    <p className="rounded-2xl border border-white/8 bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--muted)]">
                        No packs match this filter yet.
                    </p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {filteredPacks.map((pack) => (
                            <ProductCard key={pack.id} pack={pack} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
