import type { Pack } from "@/data/site";

type ProductCardProps = {
  pack: Pack;
};

export function ProductCard({ pack }: ProductCardProps) {
  return (
    <article className="card-hover rounded-3xl border border-white/8 bg-[var(--surface)] hover:card-hover-hover overflow-hidden">
      <div className="relative flex h-36 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-35"
          style={{ background: pack.glow }}
        />
        <span className="relative text-6xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
          {pack.emoji}
        </span>
      </div>

      <div className="flex h-full flex-col p-5">
        <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
          {pack.categoryLabel}
        </div>

        <h3 className="mt-2 flex-1 text-xl font-bold leading-7">{pack.title}</h3>

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

          <button className="ml-auto rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}