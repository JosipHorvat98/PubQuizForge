// file: app/news/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { NewsList } from "@/components/news-list";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
    const { data: posts } = await supabaseAdmin
        .from("news_posts")
        .select("id, slug, title, category, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        News
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        What&apos;s new at PubQuizForge.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Updates, fixes, packs and notes from the quiz master.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell">
                    <NewsList posts={posts ?? []} />
                </div>
            </section>

            <Footer />
        </main>
    );
}