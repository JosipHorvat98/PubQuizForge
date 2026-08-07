// file: app/admin/news/page.tsx
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { requireAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { NewsAdminClient } from "@/components/news-admin-client";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
    try {
        await requireAdmin();
    } catch {
        redirect("/account");
    }

    const { data: posts, error } = await supabaseAdmin
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Unable to load posts: ${error.message}`);
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                        Admin
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        News.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Publish updates, fixes and notes. Published stories appear
                        on the public /news page.
                    </p>

                    <div className="mt-10">
                        <NewsAdminClient posts={posts ?? []} />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}