// file: components/news-list.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type NewsListItem = {
    id: string;
    slug: string;
    title: string;
    category: string;
    published_at: string | null;
};

function formatDate(value: string | null): string {
    if (!value) {
        return "";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

export function NewsList({ posts }: { posts: NewsListItem[] }) {
    const [active, setActive] = useState("All");

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(posts.map((post) => post.category)))],
        [posts]
    );

    const filtered = useMemo(
        () =>
            active === "All"
                ? posts
                : posts.filter((post) => post.category === active),
        [posts, active]
    );

    if (posts.length === 0) {
        return (
            <p className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 text-[var(--muted)]">
                No news yet — check back soon!
            </p>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => setActive(category)}
                        className={[
                            "rounded-full border px-4 py-2 text-sm font-semibold transition",
                            active === category
                                ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                                : "border-white/8 bg-transparent text-[var(--muted)] hover:border-white/20 hover:text-white"
                        ].join(" ")}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filtered.map((post) => (
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

            {filtered.length === 0 ? (
                <p className="text-sm text-[var(--muted)]">
                    No posts in this category yet.
                </p>
            ) : null}
        </div>
    );
}
