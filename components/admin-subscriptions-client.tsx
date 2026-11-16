// file: components/admin-subscriptions-client.tsx
"use client";

import { useState } from "react";

export type AdminSubscriptionRow = {
    id: string;
    email: string;
    nickname: string;
    planId: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
    customerId: string | null;
};

type SubscriptionAction = "cancel" | "resume" | "cancel_now";

function formatDate(value: string | null): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(value));
}

export function AdminSubscriptionsClient({
    rows
}: {
    rows: AdminSubscriptionRow[];
}) {
    const [list, setList] = useState(rows);
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function act(row: AdminSubscriptionRow, action: SubscriptionAction) {
        if (
            action === "cancel_now" &&
            !window.confirm(
                `Cancel ${row.email}'s subscription immediately? This ends access now.`
            )
        ) {
            return;
        }

        setBusy(row.id);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscriptionId: row.id, action })
            });

            const result = (await response.json()) as {
                error?: string;
                status?: string;
                cancel_at_period_end?: boolean;
                current_period_end?: string | null;
            };

            if (!response.ok) {
                throw new Error(result.error ?? "Action failed");
            }

            setList((prev) =>
                prev.map((item) =>
                    item.id === row.id
                        ? {
                              ...item,
                              status: result.status ?? item.status,
                              cancelAtPeriodEnd: Boolean(
                                  result.cancel_at_period_end
                              ),
                              currentPeriodEnd:
                                  result.current_period_end ??
                                  item.currentPeriodEnd
                          }
                        : item
                )
            );
            setMessage(`Updated ${row.email}.`);
        } catch (caught) {
            setError(
                caught instanceof Error ? caught.message : "Action failed"
            );
        } finally {
            setBusy(null);
        }
    }

    const activeStatuses = ["active", "trialing", "past_due"];

    return (
        <div className="mt-8">
            {message ? (
                <p className="text-sm font-semibold text-green-300">{message}</p>
            ) : null}
            {error ? (
                <p className="text-sm font-semibold text-red-300">{error}</p>
            ) : null}

            {list.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-white/8 bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--muted)]">
                    No subscriptions yet.
                </p>
            ) : (
                <div className="mt-3 grid gap-4">
                    {list.map((row) => {
                        const isActive = activeStatuses.includes(row.status);

                        return (
                            <article
                                key={row.id}
                                className="rounded-[22px] border border-white/8 bg-[var(--surface)] p-5 md:p-6"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0">
                                        <h2 className="break-all text-lg font-black">
                                            {row.nickname || row.email}
                                        </h2>
                                        <p className="break-all text-xs text-[var(--muted)]">
                                            {row.email}
                                        </p>
                                        <p className="mt-2 text-xs text-[var(--muted)]">
                                            Plan:{" "}
                                            <span className="font-bold uppercase text-white">
                                                {row.planId || "—"}
                                            </span>
                                            {" · "}Status:{" "}
                                            <span className="font-bold text-white">
                                                {row.status || "—"}
                                            </span>
                                            {" · "}Period ends:{" "}
                                            <span className="font-bold text-white">
                                                {formatDate(row.currentPeriodEnd)}
                                            </span>
                                        </p>
                                        {row.cancelAtPeriodEnd ? (
                                            <p className="mt-1 text-xs font-semibold text-amber-300">
                                                Cancellation scheduled (active
                                                until period end)
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {isActive && !row.cancelAtPeriodEnd ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void act(row, "cancel")
                                                }
                                                disabled={busy === row.id}
                                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-60"
                                            >
                                                Cancel at period end
                                            </button>
                                        ) : null}

                                        {isActive && row.cancelAtPeriodEnd ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void act(row, "resume")
                                                }
                                                disabled={busy === row.id}
                                                className="rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:opacity-60"
                                            >
                                                Resume
                                            </button>
                                        ) : null}

                                        {isActive ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void act(row, "cancel_now")
                                                }
                                                disabled={busy === row.id}
                                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15 disabled:opacity-60"
                                            >
                                                Cancel now
                                            </button>
                                        ) : null}

                                        <a
                                            href={`https://dashboard.stripe.com/subscriptions/${row.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
                                        >
                                            Stripe
                                        </a>

                                        {row.customerId ? (
                                            <a
                                                href={`https://dashboard.stripe.com/customers/${row.customerId}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
                                            >
                                                Customer
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
