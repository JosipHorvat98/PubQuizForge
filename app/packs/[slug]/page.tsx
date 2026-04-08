// file: app/packs/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { packs } from "@/data/site";

type PackPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return packs.map((pack) => ({
    slug: pack.id
  }));
}

export default async function PackPage({ params }: PackPageProps) {
  const { slug } = await params;
  const pack = packs.find((item) => item.id === slug);

  if (!pack) {
    notFound();
  }

  const relatedPacks = packs
    .filter((item) => item.category === pack.category && item.id !== pack.id)
    .slice(0, 3);

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
              night experience. Great for pubs, bars, private events, and trivia hosts
              who want quality content without spending hours writing questions.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
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

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-white/8 bg-[var(--surface)] p-5">
                <h2 className="text-lg font-bold">What’s included</h2>
                <ul className="mt-4 space-y-3 text-[var(--muted)]">
                  <li>• 50 quiz questions</li>
                  <li>• Ready-to-print PDF format</li>
                  <li>• Answer sheet included</li>
                  <li>• Suitable for pub and private quiz nights</li>
                </ul>
              </article>

              <article className="rounded-2xl border border-white/8 bg-[var(--surface)] p-5">
                <h2 className="text-lg font-bold">Best for</h2>
                <ul className="mt-4 space-y-3 text-[var(--muted)]">
                  <li>• Weekly pub quizzes</li>
                  <li>• Themed quiz events</li>
                  <li>• Fundraisers and parties</li>
                  <li>• Hosts who need fast setup</li>
                </ul>
              </article>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-[var(--surface-2)]">
              <div
                className="absolute inset-0 opacity-35"
                style={{ background: pack.glow }}
              />
              <span className="relative text-8xl drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                {pack.emoji}
              </span>
            </div>

            <div className="mt-6 text-5xl font-black tracking-tight text-[var(--gold)]">
              {pack.price}
            </div>

            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Instant digital download. Ideal for hosts who want a polished quiz pack
              ready to use with minimal prep.
            </p>

            <div className="mt-6 grid gap-3">
              <button className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]">
                Add to Cart
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
                Buy Now
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-[rgba(245,200,66,0.2)] bg-[var(--gold-dim)] p-4">
              <p className="text-sm leading-6 text-white">
                Looking for better value? A membership may be cheaper if you host quiz
                nights regularly.
              </p>
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
            <p className="mt-3 text-[var(--muted)]">
              More packs from the same category.
            </p>
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
                    <a
                      href={`/packs/${item.id}`}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                    >
                      View Pack
                    </a>
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