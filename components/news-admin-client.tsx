// file: components/news-admin-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type NewsAdminPost = {
    id: string;
    slug: string;
    title: string;
    category: string;
    content: string;
    is_published: boolean;
    published_at: string | null;
    updated_at: string | null;
};

const CATEGORIES = ["Update", "Fix", "New Pack", "Note", "Other"];

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25";

export function NewsAdminClient({ posts }: { posts: NewsAdminPost[] }) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Update");
    const [content, setContent] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function resetForm() {
        setTitle("");
        setCategory("Update");
        setContent("");
        setIsPublished(true);
        setEditingId(null);
        setMessage(null);
        setError(null);
    }

    function startEdit(post: NewsAdminPost) {
        setEditingId(post.id);
        setTitle(post.title);
        setCategory(post.category);
        setContent(post.content);
        setIsPublished(post.is_published);
        document.getElementById("news-form")?.scrollIntoView({ behavior: "smooth" });
    }

    async function handleSubmit() {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            const url = editingId
                ? `/api/admin/news/${editingId}`
                : "/api/admin/news";

            const method = editingId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    content,
                    is_published: isPublished
                })
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to save post");
            }

            setMessage(editingId ? "Post updated." : "Post published.");
            router.refresh();
            resetForm();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to save post");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(post: NewsAdminPost) {
        const confirmed = window.confirm(`Delete "${post.title}"?`);

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/news/${post.id}`, {
                method: "DELETE"
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to delete post");
            }

            router.refresh();

            if (editingId === post.id) {
                resetForm();
            }
        } catch (e) {
            alert(e instanceof Error ? e.message : "Unable to delete post");
        }
    }

    return (
        <div className="space-y-8">
            <form
                id="news-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleSubmit();
                }}
                className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8"
            >
                <h2 className="text-2xl font-black tracking-tight">
                    {editingId ? "Edit post" : "New post"}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Title
                        </label>
                        <input
                            className={inputClass}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g. New pack release"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Category
                        </label>
                        <select
                            className={inputClass}
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            {CATEGORIES.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Content (supports line breaks)
                    </label>
                    <textarea
                        className={`${inputClass} min-h-[140px]`}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Write the news update, fix list or note..."
                    />
                </div>

                <label className="mt-4 flex items-center gap-3 text-sm text-[var(--muted)]">
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(event) => setIsPublished(event.target.checked)}
                        className="h-5 w-5 accent-[var(--gold)]"
                    />
                    Publish (visible on /news)
                </label>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                                ? "Save changes"
                                : "Publish post"}
                    </button>

                    {editingId ? (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                        >
                            Cancel edit
                        </button>
                    ) : null}
                </div>

                {message ? (
                    <p className="mt-4 text-sm font-semibold text-green-300">
                        {message}
                    </p>
                ) : null}

                {error ? (
                    <p className="mt-4 text-sm font-semibold text-red-300">
                        {error}
                    </p>
                ) : null}
            </form>


            <div>
                <h2 className="text-xl font-black tracking-tight">
                    All posts ({posts.length})
                </h2>

                {posts.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]">
                        No posts yet. Create your first post above.
                    </p>
                ) : (
                    <div className="mt-4 grid gap-3">
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                className="rounded-2xl border border-white/8 bg-[var(--surface)] p-4"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                                            <span
                                                className={
                                                    post.is_published
                                                        ? "text-green-300"
                                                        : "text-yellow-300"
                                                }
                                            >
                                                {post.is_published ? "Published" : "Draft"}
                                            </span>
                                            <span>· {post.category}</span>
                                            <span>· /news/{post.slug}</span>
                                        </div>

                                        <h3 className="mt-1 truncate text-lg font-bold">
                                            {post.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(post)}
                                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => void handleDelete(post)}
                                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
