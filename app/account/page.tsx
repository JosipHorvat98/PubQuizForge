// 9. file: app/account/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
    SubscriptionStatusCard,
    type AccountSubscription
} from "@/components/subscription-status-card";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { findActiveMembershipForEmail } from "@/lib/memberships";
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

    const { data: subscription, error: subscriptionError } =
        await supabaseAdmin
            .from("subscriptions")
            .select(
                "plan_id, status, cancel_at_period_end, current_period_end"
            )
            .eq("user_id", user.id)
            .in("status", ["active", "trialing", "past_due"])
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle<AccountSubscription>();

    if (subscriptionError) {
        console.error(
            "Unable to load account subscription:",
            subscriptionError
        );
    }

    // Fallback: if no active subscription row was found in Supabase (e.g. a
    // webhook event hasn't been delivered yet), ask Stripe directly so an
    // active membership is still shown on the account page.
    let activeSubscription = subscription ?? null;

    if (!activeSubscription && user?.email) {
        try {
            activeSubscription =
                (await findActiveMembershipForEmail(user.email)) ?? null;
        } catch (error) {
            console.error(
                "Unable to fetch membership from Stripe:",
                error
            );
        }
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

                        <SubscriptionStatusCard
                            subscription={activeSubscription}
                        />

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