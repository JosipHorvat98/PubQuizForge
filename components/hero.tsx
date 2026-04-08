import { stats } from "@/data/site";

export function Hero() {
  return (
    <section className="section-space relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(245,200,66,0.14)_0%,transparent_70%)]" />

      <div className="container-shell text-center">
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
          ✦ Instant PDF Download
        </div>

        <h1 className="fade-up mx-auto mt-6 max-w-4xl text-balance text-5xl font-black leading-none tracking-tight md:text-7xl">
          Quiz Packs for{" "}
          <span className="text-[var(--gold)] italic">Every Occasion</span>
        </h1>

        <p className="fade-up mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Ready-to-host pub quiz bundles — 50 questions, fully formatted,
          print-and-play in minutes.
        </p>

        <div className="fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#packs"
            className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-black hover:bg-[var(--gold-strong)]"
          >
            Browse Packs
          </a>
          <a
            href="#memberships"
            className="rounded-xl border border-white/10 bg-white/4 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white hover:bg-white/8"
          >
            View Memberships
          </a>
        </div>

        <div className="fade-up mt-14 grid gap-6 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/3 px-6 py-5">
              <div className="text-4xl font-black tracking-tight text-[var(--gold)]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}