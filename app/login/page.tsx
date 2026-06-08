// file: app/login/page.tsx
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AuthSubmitButton } from "@/components/auth-submit-button";
import { login } from "./actions";

export default async function LoginPage({
    searchParams
}: {
    searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
    const params = await searchParams;
    const next = params.next && params.next.startsWith("/") ? params.next : "/account";

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Login
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Sign in to your account.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                        Access your purchases, memberships, and future quiz downloads.
                    </p>

                    <div className="mt-10 rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                        {params.error ? (
                            <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {params.error}
                            </p>
                        ) : null}

                        {params.message ? (
                            <p className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                {params.message}
                            </p>
                        ) : null}

                        <form action={login} className="grid gap-4">
                            <input type="hidden" name="next" value={next} />

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
                                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 outline-none focus:border-[var(--gold)]"
                                />
                            </div>

                            <AuthSubmitButton
                                idleLabel="Sign In"
                                pendingLabel="Signing in..."
                            />
                        </form>

                        <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--muted)]">
                            <p>
                                No account yet?{" "}
                                <Link
                                    href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
                                    className="font-bold text-white hover:text-[var(--gold)]"
                                >
                                    Create one
                                </Link>
                            </p>

                            <p>
                                Forgot your password?{" "}
                                <Link
                                    href="/forgot-password"
                                    className="font-bold text-white hover:text-[var(--gold)]"
                                >
                                    Reset it here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}