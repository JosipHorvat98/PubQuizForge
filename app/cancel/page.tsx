// file: app/cancel/page.tsx
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function CancelPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Checkout cancelled
                    </div>

                    <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        No payment was completed.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                        You can go back and try again whenever you’re ready.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/memberships"
                            className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                        >
                            Back to Memberships
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}