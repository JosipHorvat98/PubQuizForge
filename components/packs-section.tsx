"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { packCategories, packs, type PackCategory, type PackTier } from "@/data/site";
import {
  packHasPdf,
  canAccessPackWithPlanId,
  packTier,
  PACK_TIER_LABEL,
  PACK_TIER_RANK
} from "@/lib/entitlements";
import { ProductCard } from "@/components/product-card";
import { useMembership } from "@/components/providers/membership-provider";
import { useCart } from "@/components/providers/cart-provider";
import { SectionHeading } from "@/components/section-heading";
import { cx } from "@/lib/utils";

export function PacksSection() {
  const [activeCategory, setActiveCategory] = useState<PackCategory>("all");
  const [activeTier, setActiveTier] = useState<PackTier | "all">("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { addItem } = useCart();
  const { entitlements } = useMembership();
  const router = useRouter();

  // Group packs by tier (free → bronze → silver → gold), then alphabetically,
  // so the grid reads in a sensible order instead of feeling scattered.
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

      return matchesCategory && matchesTier;
    });
  }, [sortedPacks, activeCategory, activeTier]);

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

  function handleOpenPicker() {
    setSelectedIds([]);
    setPickerOpen(true);
  }

  function handleTogglePack(id: string) {
    const pack = packs.find((candidate) => candidate.id === id);

    if (
      !pack ||
      !packHasPdf(pack) ||
      !canAccessPackWithPlanId(pack, entitlements?.planId ?? null)
    ) {
      return;
    }

    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : current.length >= 3
          ? current
          : [...current, id]
    );
  }

  function handleConfirmDeal() {
    if (selectedIds.length !== 3) {
      return;
    }

    selectedIds.forEach((id) => {
      const pack = packs.find((candidate) => candidate.id === id);

      if (pack) {
        addItem({
          id: pack.id,
          title: pack.title,
          price: pack.price
        });
      }
    });

    setPickerOpen(false);
    router.push("/cart");
  }

  return (
    <section id="packs" className="section-space">
      <div className="container-shell">
        <SectionHeading
          label="Digital Packs"
          title="Question Bundles"
          subtitle="50 questions per pack · Answer sheet included · Instant PDF download"
        />

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/8 bg-[linear-gradient(90deg,rgba(239,68,68,0.1),rgba(245,200,66,0.12),rgba(59,130,246,0.08))] p-5 md:flex-row md:items-center">
          <div className="text-2xl">🔥</div>

          <div className="flex-1">
            <div className="font-bold text-red-300">
              Limited offer — 3 packs for the price of 2!
            </div>
            <div className="text-sm text-[var(--muted)]">
              Use code <span className="font-bold text-white">TRIVIA3</span> at checkout.
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenPicker}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Grab the deal →
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
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

        <div className="mb-6 flex flex-wrap items-center gap-2">
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

        {pickerOpen ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/10 bg-[var(--surface)] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-black tracking-tight">
                  Pick your 3 packs
                </h3>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <p className="mt-2 text-sm text-[var(--muted)]">
                Choose any 3 packs. With code{" "}
                <span className="font-bold text-white">TRIVIA3</span> at
                checkout you pay for 2 — one free for every 3.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {sortedPacks.map((pack) => {
                  const selected = selectedIds.includes(pack.id);
                  const unavailable = !packHasPdf(pack);
                  const locked = !canAccessPackWithPlanId(
                    pack,
                    entitlements?.planId ?? null
                  );

                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => handleTogglePack(pack.id)}
                      disabled={locked || unavailable || (!selected && selectedIds.length >= 3)}
                      className={[
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm",
                        selected
                          ? "border-[var(--gold)] bg-[var(--gold-dim)]"
                          : "border-white/10 bg-white/5 hover:border-white/25",
                        !selected && selectedIds.length >= 3
                          ? "opacity-50"
                          : "",
                        unavailable || locked
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      ].join(" ")}
                    >
                      <span className="text-xl">{pack.emoji}</span>
                      <span className="flex-1 font-semibold text-white">
                        {unavailable
                          ? `${pack.title} (unavailable)`
                          : locked
                            ? `${pack.title} — ${PACK_TIER_LABEL[packTier(pack)]} only`
                            : pack.title}
                      </span>
                      <span className="text-xs font-bold text-[var(--muted)]">
                        {selected
                          ? "✓"
                          : unavailable
                            ? "Unavailable"
                            : locked
                              ? PACK_TIER_LABEL[packTier(pack)]
                              : pack.price}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-[var(--muted)]">
                  {selectedIds.length} / 3 selected
                </span>

                <button
                  type="button"
                  onClick={handleConfirmDeal}
                  disabled={selectedIds.length !== 3}
                  className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add 3 packs to cart
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
