export function CTASection() {
  return (
    <section className="pb-20">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[28px] border border-[rgba(245,200,66,0.22)] bg-[linear-gradient(135deg,#1a1600_0%,#16161a_60%)] px-6 py-14 text-center md:px-10">
          <div className="pointer-events-none absolute right-8 top-[-1rem] text-[8rem] opacity-5">
            🍺
          </div>

          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            Not sure where to start?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Download a free 10-question sample pack and see the quality for yourself
            — no email needed.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]">
              ⬇ Download Free Sample
            </button>
            <a
              href="#packs"
              className="rounded-xl border border-white/10 bg-white/4 px-6 py-3 text-sm font-bold text-white hover:bg-white/8"
            >
              Browse All Packs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}