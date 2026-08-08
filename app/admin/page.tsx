// file: app/admin/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name}`);
    }
    return value;
}

const stripe = new Stripe(getEnv("STRIPE_SECRET_KEY"));

type StatCardProps = {
    label: string;
    value: string;
    hint?: string;
    accent?: boolean;
};

function StatCard({ label, value, hint, accent }: StatCardProps) {
    return (
        <article
            className={`rounded-[22px] border p-6 ${accent ? "border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)]" : "border-white/8 bg-[var(--surface)]"}`}
        >
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
            <p className={`mt-3 text-4xl font-black tracking-tight ${accent ? "text-[var(--gold)]" : "text-white"}`}>{value}</p>
            {hint ? <p className="mt-2 text-sm text-[var(--muted)]">{hint}</p> : null}
        </article>
    );
}

function formatCurrency(cents: number | null): string {
    if (cents === null) {
        return "—";
    }
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

async function getStripeRevenueCents(): Promise<number | null> {
    try {
        let total = 0;
        let hasMore = true;
        let startingAfter: string | undefined;
        while (hasMore) {
            const sessions = await stripe.checkout.sessions.list({ limit: 100, status: "complete", starting_after: startingAfter });
            for (const session of sessions.data) {
                total += session.amount_total ?? 0;
            }
            hasMore = sessions.has_more;
            startingAfter = sessions.data[sessions.data.length - 1]?.id;
        }
        return total;
    } catch (error) {
        console.error("Unable to fetch Stripe revenue:", error);
        return null;
    }
}

export default async function AdminDashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const [usersResult, newsResult, questionsResult] = await Promise.all([
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        supabaseAdmin.from("news_posts").select("id, is_published"),
        supabaseAdmin.from("custom_questions").select("id, is_handled").eq("is_handled", false)
    ]);

    const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
        .from("subscriptions")
        .select("plan_id, status");

    if (subscriptionsError) {
        throw new Error(`Unable to load subscriptions: ${subscriptionsError.message}`);
    }

    const { data: downloads, error: downloadsError } = await supabaseAdmin
        .from("downloads")
        .select("id, title, email, type, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

    if (downloadsError) {
        throw new Error(`Unable to load orders: ${downloadsError.message}`);
    }

    const revenueCents = await getStripeRevenueCents();

    const activeStatuses = ["active", "trialing", "past_due"];
    const activeSubscriptions = (subscriptions ?? []).filter((item) => activeStatuses.includes(item.status));

    const planBreakdown = activeSubscriptions.reduce<Record<string, number>>((acc, item) => {
        const plan = item.plan_id || "unknown";
        acc[plan] = (acc[plan] ?? 0) + 1;
        return acc;
    }, {});

    const totalUsers = usersResult.data?.users?.length ?? 0;
    const newsPosts = newsResult.data ?? [];
    const publishedNews = newsPosts.filter((post) => post.is_published).length;
    const pendingQuestions = questionsResult.data?.length ?? 0;

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />
            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">Admin</div>
                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">Overview.</h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">A quick look at your shop — users, memberships, orders and pending work.</p>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard label="Registered users" value={String(totalUsers)} hint="Total accounts" />
                        <StatCard label="Active memberships" value={String(activeSubscriptions.length)} hint="Active, trialing or past due" accent />
                        <StatCard label="Revenue (Stripe)" value={formatCurrency(revenueCents)} hint="Completed checkouts, all time" />
                        <StatCard label="Pending questions" value={String(pendingQuestions)} hint="Custom question requests to handle" />
                        <StatCard label="Published news" value={`${publishedNews} / ${newsPosts.length}`} hint="Live posts on /news" />
                        <StatCard label="Pack orders" value={String((downloads ?? []).length)} hint="Recent downloads only" />
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[22px] border border-white/8 bg-[var(--surface)] p-6">
                            <h2 className="text-xl font-black tracking-tight">Memberships by plan</h2>
                            <div className="mt-5 space-y-3">
                                {Object.entries(planBreakdown).length === 0 ? (
                                    <p className="text-sm text-[var(--muted)]">No active memberships yet.</p>
                                ) : (
                                    Object.entries(planBreakdown).sort((a, b) => b[1] - a[1]).map(([plan, count]) => (
                                        <div key={plan} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                            <span className="text-sm font-bold capitalize text-white">{plan}</span>
                                            <span className="text-sm font-black text-[var(--gold)]">{count}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-white/8 bg-[var(--surface)] p-6">
                            <h2 className="text-xl font-black tracking-tight">Recent orders</h2>
                            <div className="mt-5 space-y-3">
                                {(downloads ?? []).length === 0 ? (
                                    <p className="text-sm text-[var(--muted)]">No orders yet.</p>
                                ) : (
                                    (downloads ?? []).map((order) => (
                                        <div key={order.id} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-white">{order.title}</p>
                                                <p className="truncate text-xs text-[var(--muted)]">{order.email}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs font-semibold text-[var(--muted)]">{formatDate(order.created_at)}</p>
                                                <p className="text-xs font-bold capitalize text-[var(--gold)]">{order.type}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                    <section className="mt-10 rounded-[22px] border border-white/8 bg-[var(--surface)] p-6">
                        <h2 className="text-xl font-black tracking-tight">Manage</h2>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link href="/admin/users" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Users</Link>
                            <Link href="/admin/news" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">News</Link>
                            <Link href="/admin/custom-questions" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Custom questions</Link>
                        </div>
                    </section>
                </div>
            </section>
            <Footer />
        </main>
    );
}
