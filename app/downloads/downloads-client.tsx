// file: app/downloads/downloads-client.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type DownloadItem = {
    id: string;
    title: string;
    email: string;
    type: "pack" | "membership";
    created_at: string;
    pack_slug: string | null;
    download_url: string | null;
};

export function DownloadsClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [email, setEmail] = useState<string | null>(null);
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState<boolean>(!!sessionId);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDownloads() {
            if (!sessionId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/downloads?session_id=${sessionId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error ?? "Unable to load downloads");
                }

                setEmail(data.email ?? null);
                setDownloads(data.downloads ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to load downloads");
            } finally {
                setLoading(false);
            }
        }

        loadDownloads();
    }, [sessionId]);

    if (loading) {
        return <p className="text-[var(--muted)]">Loading downloads...</p>;
    }

    if (error) {
        return <p className="text-red-300">{error}</p>;
    }

    if (!sessionId) {
        return (
            <div>
                <p className="text-[var(--muted)]">
                    No session_id found. Open this page from the success screen after checkout.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight">Purchased items</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    {email ? `Customer: ${email}` : "Customer email not found"}
                </p>
            </div>

            {!downloads.length ? (
                <p className="text-[var(--muted)]">
                    No downloads found yet. Check whether the webhook inserted rows into Supabase.
                </p>
            ) : (
                <div className="grid gap-4">
                    {downloads.map((item) => (
                        <article
                            key={item.id}
                            className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                    {item.type}
                                </div>
                                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                                <p className="mt-2 text-sm text-[var(--muted)]">
                                    {new Date(item.created_at).toLocaleString()}
                                </p>
                            </div>

                            {item.type === "pack" && item.download_url ? (
                                <a
                                    href={item.download_url}
                                    download
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                                >
                                    Download PDF
                                </a>
                            ) : item.type === "pack" ? (
                                <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2.5 text-sm font-bold text-yellow-300">
                                    PDF coming soon
                                </span>
                            ) : (
                                <Link
                                    href="/memberships"
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                                >
                                    View Membership
                                </Link>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </>
    );
}