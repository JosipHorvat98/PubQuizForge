// file: app/success/page.tsx
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const params = await searchParams;
    const sessionId = params.session_id;

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
                        Payment successful
                    </div>

                    <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Your order is confirmed.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                        Thanks for your purchase. Use the button below to load your downloads from
                        this checkout session.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={sessionId ? `/downloads?session_id=${sessionId}` : "/downloads"}
                            className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                        >
                            Go to Downloads
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