// file: app/admin/credits/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    AdminCreditsClient,
    type AdminCreditRow
} from "@/components/admin-credits-client";

export const dynamic = "force-dynamic";

export default async function AdminCreditsPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const { data: authData, error: usersError } =
        await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (usersError) {
        throw new Error(`Unable to load users: ${usersError.message}`);
    }

    const { data: creditRows, error: creditsError } = await supabaseAdmin
        .from("membership_credits")
        .select("*");

    if (creditsError) {
        throw new Error(`Unable to load credits: ${creditsError.message}`);
    }

    const byEmail = new Map(
        (creditRows ?? []).map((row) => [
            String(row.email ?? "").toLowerCase(),
            row
        ])
    );

    const rows: AdminCreditRow[] = (authData.users ?? [])
        .map((user) => {
            const email = (user.email ?? "").toLowerCase();
            const credits = byEmail.get(email);

            return {
                userId: user.id,
                email,
                nickname: String(user.user_metadata?.nickname ?? "").trim(),
                planId: credits?.plan_id ?? null,
                creditsAvailable: credits?.credits_available ?? 0,
                monthlyCredits: credits?.monthly_credits ?? 0,
                maxRollover: credits?.max_rollover ?? 0,
                lastPeriodStart: credits?.last_period_start ?? null,
                hasLedger: Boolean(credits)
            };
        })
        .filter((row) => Boolean(row.email));

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Credits.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Grant, set or reset pack credits for any user.
                        <Link
                            href="/admin"
                            className="ml-2 text-[var(--gold)] hover:underline"
                        >
                            Back to dashboard
                        </Link>
                    </p>

                    <AdminCreditsClient rows={rows} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
