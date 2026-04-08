"use client";

import { useMemo, useState } from "react";
import { packCategories, packs, type PackCategory } from "@/data/site";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { cx } from "@/lib/utils";

export function PacksSection() {
  const [activeCategory, setActiveCategory] = useState<PackCategory>("all");

  const filteredPacks = useMemo(() => {
    if (activeCategory === "all") {
      return packs;
    }

    return packs.filter((pack) => pack.category === activeCategory);
  }, [activeCategory]);

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

          <button className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:opacity-90">
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

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredPacks.map((pack) => (
            <ProductCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
}
