// file: app/admin/subscriptions/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    AdminSubscriptionsClient,
    type AdminSubscriptionRow
} from "@/components/admin-subscriptions-client";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const [subsResult, usersResult] = await Promise.all([
        supabaseAdmin
            .from("subscriptions")
            .select("*")
            .order("updated_at", { ascending: false }),
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    ]);

    if (subsResult.error) {
        throw new Error(
            `Unable to load subscriptions: ${subsResult.error.message}`
        );
    }

    const nicknameByEmail = new Map(
        (usersResult.data?.users ?? []).map((user) => [
            (user.email ?? "").toLowerCase(),
            String(user.user_metadata?.nickname ?? "").trim()
        ])
    );

    const rows: AdminSubscriptionRow[] = (subsResult.data ?? [])
        .map((row) => {
            const email = String(row.email ?? "").toLowerCase();

            return {
                id: String(row.stripe_subscription_id ?? ""),
                email,
                nickname: nicknameByEmail.get(email) ?? "",
                planId: String(row.plan_id ?? ""),
                status: String(row.status ?? ""),
                cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
                currentPeriodEnd: row.current_period_end
                    ? String(row.current_period_end)
                    : null,
                customerId: row.stripe_customer_id
                    ? String(row.stripe_customer_id)
                    : null
            };
        })
        .filter((row) => Boolean(row.id));

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Subscriptions.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Cancel, resume, or open a subscription in Stripe.
                        <Link href="/admin" className="ml-2 text-[var(--gold)] hover:underline">
                            Back to dashboard
                        </Link>
                    </p>

                    <AdminSubscriptionsClient rows={rows} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
