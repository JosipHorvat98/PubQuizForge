// file: app/downloads/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const purchasedPacks = [
  {
    id: "general-knowledge-vol-1",
    title: "General Knowledge Vol. 1",
    category: "General Knowledge",
    date: "Downloaded on Apr 8, 2026",
    status: "Available",
    href: "#"
  },
  {
    id: "friends-ultimate-pack",
    title: "F.R.I.E.N.D.S — Ultimate Pack",
    category: "TV & Film",
    date: "Downloaded on Apr 3, 2026",
    status: "Available",
    href: "#"
  },
  {
    id: "christmas-quiz-night",
    title: "Christmas Quiz Night",
    category: "Themed Nights",
    date: "Downloaded on Dec 18, 2025",
    status: "Available",
    href: "#"
  }
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />

      <section className="section-space">
        <div className="container-shell">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            My Downloads
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Your quiz pack library.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            This page will later be connected to user accounts and purchases. For now,
            it shows a styled placeholder for a future customer downloads area.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell">
          <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Purchased Packs</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Available downloads tied to your future account.
                </p>
              </div>

              <a
                href="/#packs"
                className="inline-flex rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
              >
                Browse More Packs
              </a>
            </div>

            <div className="grid gap-4">
              {purchasedPacks.map((pack) => (
                <article
                  key={pack.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {pack.category}
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{pack.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{pack.date}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-green-500/12 px-3 py-1 text-xs font-semibold text-green-300">
                      {pack.status}
                    </span>
                    <a
                      href={pack.href}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                    >
                      Download PDF
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}