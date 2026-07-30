// file: app/account/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { createClient } from "@/utils/supabase/server";

async function signOut() {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();

    redirect("/");
}

export default async function AccountPage() {
    const supabase = await createClient();

    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login?next=/account");
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell max-w-4xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Account
                    </div>

                    <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Your account.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                        Manage your purchases, downloads, membership, and billing details.
                    </p>

                    <div className="mt-10 overflow-hidden rounded-[28px] border border-white/8 bg-[var(--surface)]">
                        <section className="p-7 md:p-8">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                Signed in as
                            </p>

                            <h2 className="mt-3 break-all text-2xl font-black tracking-tight md:text-3xl">
                                {user.email}
                            </h2>

                            <p className="mt-3 break-all text-sm text-[var(--muted)]">
                                User ID: {user.id}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href="/downloads"
                                    className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[var(--gold-strong)] active:scale-[0.98]"
                                >
                                    My Downloads
                                </Link>

                                <Link
                                    href="/memberships"
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
                                >
                                    View Memberships
                                </Link>
                            </div>
                        </section>

                        <section className="border-t border-white/8 p-7 md:p-8">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                                Billing
                            </p>

                            <h2 className="mt-3 text-2xl font-black tracking-tight">
                                Manage your membership
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Update your payment method, review invoices, or cancel your
                                membership through the secure Stripe Customer Portal.
                            </p>

                            <div className="mt-6">
                                <ManageSubscriptionButton />
                            </div>
                        </section>

                        <section className="border-t border-white/8 p-7 md:p-8">
                            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                Security
                            </p>

                            <h2 className="mt-3 text-2xl font-black tracking-tight">
                                Account access
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                                Reset your password or sign out from your current session.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link
                                    href="/forgot-password"
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
                                >
                                    Reset Password
                                </Link>

                                <form action={signOut}>
                                    <button
                                        type="submit"
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/15 active:scale-[0.98]"
                                    >
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}