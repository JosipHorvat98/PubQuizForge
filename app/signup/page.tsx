// file: app/signup/page.tsx
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { signup } from "./actions";

export default async function SignupPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const params = await searchParams;

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Sign Up
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Create your account.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                        Save purchases, manage your membership, and access downloads from one place.
                    </p>

                    <div className="mt-10 rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                        {params.error ? (
                            <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {params.error}
                            </p>
                        ) : null}

                        <form action={signup} className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-semibold">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-semibold">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-[var(--muted)]">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-white hover:text-[var(--gold)]">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}