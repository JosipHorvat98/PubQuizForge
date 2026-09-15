// file: components/newsletter-admin-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type NewsletterAdminSubscriber = {
    id: string;
    email: string;
    is_active: boolean;
    source: string;
    created_at: string | null;
    unsubscribed_at: string | null;
};

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25";

export function NewsletterAdminClient({
    subscribers
}: {
    subscribers: NewsletterAdminSubscriber[];
}) {
    const router = useRouter();
    const activeCount = subscribers.filter((entry) => entry.is_active).length;

    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const hasSubscribers = subscribers.length > 0;

    function handleExportCsv() {
        const header = "email,is_active,source,created_at,unsubscribed_at";
        const rows = subscribers.map((entry) =>
            [
                `"${entry.email}"`,
                entry.is_active ? "active" : "inactive",
                `"${entry.source}"`,
                entry.created_at ?? "",
                entry.unsubscribed_at ?? ""
            ].join(",")
        );
        const csv = [header, ...rows].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "newsletter-subscribers.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
async function handleBroadcast() {
        if (!subject.trim() || !html.trim()) {
            setError("Subject and content are required.");
            return;
        }

        if (!activeCount) {
            setError("No active subscribers to send to.");
            return;
        }

        const ok = window.confirm(
            `Send this edition to ${activeCount} active subscriber(s)?`
        );

        if (!ok) {
            return;
        }

        setSending(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, html })
            });

            const result = (await response.json()) as {
                error?: string;
                sent?: number;
            };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to send broadcast.");
            }

            setMessage(`Sent to ${result.sent ?? 0} subscribers.`);
            setSubject("");
            setHtml("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to send broadcast.");
        } finally {
            setSending(false);
        }
    }

    async function handleUnsubscribe(email: string) {
        const ok = window.confirm(`Unsubscribe ${email}?`);

        if (!ok) {
            return;
        }

        setError(null);

        try {
            const response = await fetch("/api/admin/newsletter", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to unsubscribe.");
            }

            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to unsubscribe.");
        }
    }
return (
        <div className="grid gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                    <h2 className="text-xl font-black tracking-tight">Send an edition</h2>

                    <div className="mt-4 grid gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                                Subject
                            </label>
                            <input
                                className={inputClass}
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                placeholder="New packs just landed 🎉"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                                Content (HTML)
                            </label>
                            <textarea
                                className={`${inputClass} min-h-[160px] font-mono text-xs`}
                                value={html}
                                onChange={(event) => setHtml(event.target.value)}
                                placeholder={"<h2>Hello!</h2><p>Write your newsletter here.</p>"}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => void handleBroadcast()}
                            disabled={sending || activeCount === 0}
                            className="rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {sending
                                ? "Sending..."
                                : `Broadcast to ${activeCount} subscriber${activeCount === 1 ? "" : "s"}`}
                        </button>

                        <p className="text-xs leading-6 text-[var(--muted)]">
                            Sends through Resend using the configured EMAIL_FROM.
                            For reliable bulk delivery, verify a custom domain in
                            Resend first.
                        </p>
                    </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-black tracking-tight">
                            Subscribers ({activeCount} active / {subscribers.length} total)
                        </h2>
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            disabled={!hasSubscribers}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export CSV
                        </button>
                    </div>
                    {!hasSubscribers ? (
                        <p className="mt-4 rounded-2xl border border-white/8 bg-[var(--surface-2)] p-5 text-sm text-[var(--muted)]">
                            No subscribers yet. Anyone who signs up in the footer
                            appears here.
                        </p>
                    ) : (
                        <div className="mt-4 max-h-[420px] overflow-y-auto pr-1">
                            <div className="grid gap-2">
                                {subscribers.map((entry) => (
                                    <article
                                        key={entry.id}
                                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-semibold text-white">
                                                {entry.email}
                                            </div>
                                            <div className="text-xs text-[var(--muted)]">
                                                {entry.is_active ? "Active" : "Unsubscribed"} ·{" "}
                                                {entry.source} ·{" "}
                                                {entry.created_at
                                                    ? new Date(entry.created_at).toLocaleDateString()
                                                    : ""}
                                            </div>
                                        </div>
                                        {entry.is_active ? (
                                            <button
                                                type="button"
                                                onClick={() => void handleUnsubscribe(entry.email)}
                                                className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/15"
                                            >
                                                Unsubscribe
                                            </button>
                                        ) : null}
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {message ? (
                <p className="text-sm font-semibold text-green-300">{message}</p>
            ) : null}
            {error ? (
                <p className="text-sm font-semibold text-red-300">{error}</p>
            ) : null}
        </div>
    );
}
