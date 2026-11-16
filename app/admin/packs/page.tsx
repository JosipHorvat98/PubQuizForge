// file: app/admin/packs/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { getPackOverrides, getPacksMerged } from "@/lib/packs-server";
import {
    AdminPacksClient,
    type AdminPackRow
} from "@/components/admin-packs-client";

export const dynamic = "force-dynamic";

export default async function AdminPacksPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const [packs, overrides] = await Promise.all([
        getPacksMerged(),
        getPackOverrides()
    ]);

    const rows: AdminPackRow[] = packs.map((pack) => ({
        id: pack.id,
        title: pack.title,
        categoryLabel: pack.categoryLabel,
        tier: pack.tier,
        price: pack.price,
        pdfPath: pack.pdfPath ?? "",
        isHidden: Boolean(overrides.get(pack.id)?.is_hidden),
        hasPdf: Boolean(pack.pdfPath)
    }));

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Packs.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Edit a pack's tier, price, availability and PDF path
                        without touching the code. Changes apply site-wide.
                        <Link href="/admin" className="ml-2 text-[var(--gold)] hover:underline">
                            Back to dashboard
                        </Link>
                    </p>

                    <AdminPacksClient rows={rows} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
