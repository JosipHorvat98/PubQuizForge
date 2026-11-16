// file: components/admin-orders-client.tsx
"use client";

import { useMemo, useState } from "react";

export type AdminOrderItem = {
    id: string;
    title: string;
    type: string;
    source: string | null;
    createdAt: string;
    packSlug: string | null;
};

export type AdminOrderGroup = {
    email: string;
    nickname: string;
    purchases: number;
    redemptions: number;
    items: AdminOrderItem[];
};

function formatDate(value: string): string {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

function sourceLabel(source: string | null): string {
    if (source === "purchase") {
        return "Purchase";
    }

    if (source === "membership") {
        return "Credit";
    }

    return "—";
}

export function AdminOrdersClient({ groups }: { groups: AdminOrderGroup[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) {
            return groups;
        }

        return groups
            .map((group) => ({
                ...group,
                items: group.items.filter((item) =>
                    [group.email, group.nickname, item.title, item.packSlug ?? ""]
                        .join(" ")
                        .toLowerCase()
                        .includes(needle)
                )
            }))
            .filter((group) => group.items.length > 0);
    }, [groups, query]);

    return (
        <div className="mt-8">
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by email, nickname, or pack title..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            />

            <p className="mt-3 text-xs text-[var(--muted)]">
                {filtered.length} user(s)
            </p>

            <div className="mt-5 grid gap-4">
                {filtered.length === 0 ? (
                    <p className="rounded-2xl border border-white/8 bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--muted)]">
                        No orders match this search.
                    </p>
                ) : (
                    filtered.map((group) => (
                        <article
                            key={group.email}
                            className="rounded-[22px] border border-white/8 bg-[var(--surface)] p-5 md:p-6"
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <div className="min-w-0">
                                    <h2 className="break-all text-lg font-black">
                                        {group.nickname || group.email}
                                    </h2>
                                    <p className="break-all text-xs text-[var(--muted)]">
                                        {group.email}
                                    </p>
                                </div>
                                <p className="text-xs font-semibold text-[var(--muted)]">
                                    {group.purchases} purchase(s) ·{" "}
                                    {group.redemptions} credit redemption(s)
                                </p>
                            </div>

                            <div className="mt-4 grid gap-2">
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-white">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-[var(--muted)]">
                                                {formatDate(item.createdAt)}
                                                {item.packSlug
                                                    ? ` · /packs/${item.packSlug}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={[
                                                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                                                    item.source === "purchase"
                                                        ? "bg-emerald-500/12 text-emerald-300"
                                                        : item.source === "membership"
                                                            ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                                                            : "bg-white/5 text-[var(--muted)]"
                                                ].join(" ")}
                                            >
                                                {sourceLabel(item.source)}
                                            </span>

                                            {item.packSlug ? (
                                                <a
                                                    href={`/packs/${item.packSlug}`}
                                                    className="text-xs font-bold text-[var(--gold)] hover:underline"
                                                >
                                                    View
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
