// file: app/news/page.tsx
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

function formatDate(value: string | null | undefined): string {
    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

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
                    {!posts || posts.length === 0 ? (
                        <p className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 text-[var(--muted)]">
                            No news yet — check back soon!
                        </p>
                    ) : (
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/news/${post.slug}`}
                                    className="group block rounded-[24px] border border-white/8 bg-[var(--surface)] p-5 md:p-6 transition duration-200 hover:border-[rgba(245,200,66,0.24)]"
                                >
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[var(--gold)]">
                                            {post.category}
                                        </span>
                                        <span>{formatDate(post.published_at)}</span>
                                    </div>

                                    <h2 className="mt-3 text-2xl font-black tracking-tight text-white group-hover:text-[var(--gold)]">
                                        {post.title}
                                    </h2>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}