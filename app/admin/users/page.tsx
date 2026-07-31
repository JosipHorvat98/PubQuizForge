import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AdminDeleteUserButton } from "@/components/admin-delete-user-button";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

function formatDate(value?: string | null): string {
    if (!value) {
        return "Never";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

export default async function AdminUsersPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const {
        data: { users },
        error: usersError
    } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 100
    });

    if (usersError) {
        throw new Error(`Unable to load users: ${usersError.message}`);
    }

    const { data: subscriptions, error: subscriptionsError } =
        await supabaseAdmin
            .from("subscriptions")
            .select("user_id, plan_id, status, cancel_at_period_end");

    if (subscriptionsError) {
        throw new Error(
            `Unable to load subscriptions: ${subscriptionsError.message}`
        );
    }

    const subscriptionByUserId = new Map(
        (subscriptions ?? []).map((subscription) => [
            subscription.user_id,
            subscription
        ])
    );

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Users.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Review registered users and their current membership status.
                    </p>

                    <div className="mt-10 grid gap-4">
                        {users.map((user) => {
                            const subscription = subscriptionByUserId.get(user.id);

                            return (
                                <article
                                    key={user.id}
                                    className="rounded-[24px] border border-white/8 bg-[var(--surface)] p-5 md:p-6"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="break-all text-xl font-black">
                                                {user.email ?? "No email"}
                                            </h2>

                                            <p className="mt-2 break-all text-xs text-[var(--muted)]">
                                                {user.id}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                                                <span>
                                                    Created: {formatDate(user.created_at)}
                                                </span>

                                                <span>
                                                    Last sign in: {formatDate(user.last_sign_in_at)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                            {subscription ? (
                                                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                                                    <p className="font-bold text-white">
                                                        {subscription.plan_id}
                                                    </p>

                                                    <p className="mt-1 text-[var(--muted)]">
                                                        {subscription.status}
                                                        {subscription.cancel_at_period_end
                                                            ? " - cancellation scheduled"
                                                            : ""}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
                                                    No membership
                                                </span>
                                            )}

                                            <AdminDeleteUserButton
                                                userId={user.id}
                                                email={user.email ?? user.id}
                                            />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}