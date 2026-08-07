// file: app/success/success-client.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type DownloadItem = {
    id: string;
    title: string;
    email: string;
    type: "pack" | "membership";
    pack_slug: string | null;
    download_url: string | null;
};

export function SuccessClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const packDownloads = downloads.filter((item) => item.type === "pack");
    const hasSession = Boolean(sessionId);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        let isMounted = true;

        async function load() {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/downloads?session_id=${encodeURIComponent(sessionId ?? "")}`
                );
                const data = (await response.json()) as {
                    downloads?: DownloadItem[];
                    error?: string;
                };

                if (!response.ok) {
                    throw new Error(data.error ?? "Unable to load downloads.");
                }

                if (isMounted) {
                    setDownloads(data.downloads ?? []);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load downloads."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            isMounted = false;
        };
    }, [sessionId]);

    return (
        <section className="section-space">
            <div className="container-shell text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
                    Payment successful
                </div>

                <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                    Your order is confirmed.
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                    {hasSession
                        ? "Your packs are ready to download below."
                        : "Thanks for your purchase. You can now view your account downloads."}
                </p>
            </div>

            {hasSession ? (
                <div className="container-shell pb-20">
                    <div className="grid gap-4">
                        {loading ? (
                            <p className="text-[var(--muted)]">
                                Loading your downloads...
                            </p>
                        ) : error ? (
                            <p className="text-red-300">{error}</p>
                        ) : packDownloads.length ? (
                            packDownloads.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                                            {item.type}
                                        </div>
                                        <h3 className="mt-2 text-xl font-bold">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {item.download_url ? (
                                        <a
                                            href={item.download_url}
                                            download
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
                                        >
                                            Download PDF
                                        </a>
                                    ) : (
                                        <span className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-2.5 text-sm font-bold text-yellow-300">
                                            PDF coming soon
                                        </span>
                                    )}
                                </article>
                            ))
                        ) : (
                            <p className="text-[var(--muted)]">
                                No downloadable packs found for this purchase yet.
                            </p>
                        )}
                    </div>

                    {!downloads.length && !loading && !error ? (
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/downloads"
                                className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                            >
                                My Downloads
                            </Link>
                            <Link
                                href="/"
                                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                            >
                                Back to Home
                            </Link>
                        </div>
                    ) : null}
                </div>
            ) : (

                <div className="container-shell pb-20">
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/downloads"
                            className="rounded-xl bg-[var(--gold)] px-6 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
                        >
                            Go to Downloads
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            )}
        </section>
    );
}

