// file: app/news/[slug]/page.tsx
import { notFound } from "next/navigation";
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

export default async function NewsDetailPage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const { data: post } = await supabaseAdmin
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell mx-auto max-w-4xl">
                    <Link
                        href="/news"
                        className="text-sm font-semibold text-[var(--muted)] hover:text-white"
                    >
                        ← Back to news
                    </Link>

                    <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[var(--gold)]">
                            {post.category}
                        </span>
                        <span>{formatDate(post.published_at ?? post.created_at)}</span>
                    </div>

                    <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">
                        {post.title}
                    </h1>

                    <div className="mt-8 whitespace-pre-wrap text-lg leading-8 text-[var(--muted)]">
                        {post.content}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}