// file: app/admin/newsletter/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { listNewsletterSubscribers } from "@/lib/newsletter";
import { NewsletterAdminClient } from "@/components/newsletter-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const subscribers = await listNewsletterSubscribers();

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Newsletter.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Manage the opt-in subscriber list, export it, and send
                        the next edition to everyone who subscribed.
                        <Link href="/admin" className="ml-2 text-[var(--gold)] hover:underline">
                            ← Back to dashboard
                        </Link>
                    </p>

                    <div className="mt-10">
                        <NewsletterAdminClient subscribers={subscribers} />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
