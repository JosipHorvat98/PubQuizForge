// file: app/downloads/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

type DownloadItem = {
    id: string;
    title: string;
    email: string;
    type: "pack" | "membership";
    created_at: string;
    pack_slug: string | null;
    download_url: string | null;
};

export default function DownloadsPage() {
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

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        My Downloads
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Your quiz pack library.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Purchased packs and memberships linked to this checkout session.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                    {loading ? (
                        <p className="text-[var(--muted)]">Loading downloads...</p>
                    ) : error ? (
                        <p className="text-red-300">{error}</p>
                    ) : !sessionId ? (
                        <div>
                            <p className="text-[var(--muted)]">No session_id found.</p>
                            <Link
                                href="/"
                                className="mt-6 inline-flex rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                            >
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-2xl font-black tracking-tight">Purchased items</h2>
                                <p className="mt-2 text-sm text-[var(--muted)]">
                                    {email ? `Customer: ${email}` : "Customer email not found"}
                                </p>
                            </div>

                            {!downloads.length ? (
                                <p className="text-[var(--muted)]">No downloads found.</p>
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
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}