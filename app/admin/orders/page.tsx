// file: app/admin/orders/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    AdminOrdersClient,
    type AdminOrderGroup,
    type AdminOrderItem
} from "@/components/admin-orders-client";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const [downloadsResult, usersResult] = await Promise.all([
        supabaseAdmin
            .from("downloads")
            .select("id, title, email, type, source, created_at, pack_slug")
            .order("created_at", { ascending: false })
            .limit(1000),
        supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    ]);

    if (downloadsResult.error) {
        throw new Error(`Unable to load downloads: ${downloadsResult.error.message}`);
    }

    const nicknameByEmail = new Map(
        (usersResult.data?.users ?? []).map((user) => [
            (user.email ?? "").toLowerCase(),
            String(user.user_metadata?.nickname ?? "").trim()
        ])
    );

    const groups = new Map<string, AdminOrderGroup>();

    for (const row of downloadsResult.data ?? []) {
        const email = String(row.email ?? "").toLowerCase();

        if (!email) {
            continue;
        }

        const group =
            groups.get(email) ??
            ({
                email,
                nickname: nicknameByEmail.get(email) ?? "",
                purchases: 0,
                redemptions: 0,
                items: []
            } satisfies AdminOrderGroup);

        const item: AdminOrderItem = {
            id: String(row.id ?? ""),
            title: String(row.title ?? ""),
            type: String(row.type ?? ""),
            source: row.source ? String(row.source) : null,
            createdAt: String(row.created_at ?? ""),
            packSlug: row.pack_slug ? String(row.pack_slug) : null
        };

        if (item.source === "purchase") {
            group.purchases += 1;
        } else if (item.source === "membership") {
            group.redemptions += 1;
        }

        group.items.push(item);
        groups.set(email, group);
    }

    const rows = Array.from(groups.values()).sort((a, b) => {
        const aTime = a.items[0]?.createdAt ?? "";
        const bTime = b.items[0]?.createdAt ?? "";

        return bTime.localeCompare(aTime);
    });

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Orders.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Purchases and membership redemptions, grouped by user.
                        <Link href="/admin" className="ml-2 text-[var(--gold)] hover:underline">
                            Back to dashboard
                        </Link>
                    </p>

                    <AdminOrdersClient groups={rows} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
