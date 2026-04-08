// file: app/about/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />

      <section className="section-space">
        <div className="container-shell">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            About PubQuizForge
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Built for quiz hosts who want better quiz nights.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            PubQuizForge creates ready-to-host quiz packs for pubs, events, private
            parties, fundraisers, and trivia nights. Every pack is designed to save
            hosts time while still delivering a fun, polished experience for players.
          </p>
        </div>
      </section>

      <section className="pb-8">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-white/8 bg-[var(--surface)] p-6">
            <div className="text-3xl">⚡</div>
            <h2 className="mt-4 text-2xl font-bold">Ready in minutes</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Download a pack, print it, and host the same day. No need to write
              questions from scratch.
            </p>
          </article>

          <article className="rounded-3xl border border-white/8 bg-[var(--surface)] p-6">
            <div className="text-3xl">🧠</div>
            <h2 className="mt-4 text-2xl font-bold">Original content</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Our packs are designed for variety, pacing, and replay value, with a
              strong mix of difficulty and entertainment.
            </p>
          </article>

          <article className="rounded-3xl border border-white/8 bg-[var(--surface)] p-6">
            <div className="text-3xl">🍻</div>
            <h2 className="mt-4 text-2xl font-bold">Made for real quiz nights</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Whether you host in a pub, bar, café, school, or at home, the packs are
              built to be practical, fast, and fun to run.
            </p>
          </article>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 md:p-10">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            What you get with PubQuizForge
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-bold">For one-off buyers</h3>
              <ul className="mt-4 space-y-3 text-[var(--muted)]">
                <li>• Instant PDF quiz packs</li>
                <li>• 50 questions per pack</li>
                <li>• Easy themed browsing</li>
                <li>• Great for special events and pub nights</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold">For members</h3>
              <ul className="mt-4 space-y-3 text-[var(--muted)]">
                <li>• Better value for frequent hosts</li>
                <li>• Access to more packs and fresh releases</li>
                <li>• Premium features on higher tiers</li>
                <li>• A growing library built for repeat use</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-[rgba(245,200,66,0.2)] bg-[var(--gold-dim)] p-6">
            <p className="text-base leading-7 text-white">
              PubQuizForge exists to make hosting easier, faster, and more professional
              — without losing the fun that makes quiz nights memorable.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}