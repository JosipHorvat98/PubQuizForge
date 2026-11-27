// file: components/admin-packs-client.tsx
"use client";

import { useMemo, useState } from "react";
import type { PackTier } from "@/data/site";
import { priceInputValue } from "@/lib/price";

export type AdminPackRow = {
    id: string;
    title: string;
    categoryLabel: string;
    tier: PackTier;
    price: string;
    pdfPath: string;
    isHidden: boolean;
    hasPdf: boolean;
};

const TIERS: PackTier[] = ["free", "bronze", "silver", "gold"];

export function AdminPacksClient({ rows }: { rows: AdminPackRow[] }) {
    const [list, setList] = useState(rows);
    const [drafts, setDrafts] = useState<Record<string, AdminPackRow>>(() =>
        Object.fromEntries(rows.map((row) => [row.id, row]))
    );
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    function draft(row: AdminPackRow): AdminPackRow {
        return drafts[row.id] ?? row;
    }

    function updateDraft(row: AdminPackRow, patch: Partial<AdminPackRow>) {
        setDrafts((prev) => ({
            ...prev,
            [row.id]: { ...(prev[row.id] ?? row), ...patch }
        }));
    }

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) {
            return list;
        }

        return list.filter((row) =>
            [row.title, row.id, row.categoryLabel]
                .join(" ")
                .toLowerCase()
                .includes(needle)
        );
    }, [list, query]);

    async function save(row: AdminPackRow) {
        const current = draft(row);

        setBusy(row.id);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/packs", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    packId: row.id,
                    tier: current.tier,
                    price: current.price,
                    pdfPath: current.pdfPath,
                    isHidden: current.isHidden
                })
            });

            const result = (await response.json()) as {
                error?: string;
                pack?: { tier: PackTier; price: string; pdfPath?: string | null };
            };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to save pack");
            }

            const nextRow: AdminPackRow = {
                ...current,
                tier: result.pack?.tier ?? current.tier,
                price: result.pack?.price ?? current.price,
                pdfPath: result.pack?.pdfPath ?? "",
                hasPdf: Boolean(result.pack?.pdfPath)
            };

            setList((prev) =>
                prev.map((item) => (item.id === row.id ? nextRow : item))
            );
            setDrafts((prev) => ({ ...prev, [row.id]: nextRow }));
            setMessage(`Saved ${nextRow.title}.`);
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : "Unable to save pack"
            );
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="mt-8">
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, id, or category..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            />

            {message ? (
                <p className="mt-3 text-sm font-semibold text-green-300">{message}</p>
            ) : null}
            {error ? (
                <p className="mt-3 text-sm font-semibold text-red-300">{error}</p>
            ) : null}

            <div className="mt-5 grid gap-3">
                {filtered.map((row) => {
                    const current = draft(row);

                    return (
                        <article
                            key={row.id}
                            className="rounded-[20px] border border-white/8 bg-[var(--surface)] p-4 md:p-5"
                        >
                            <div className="min-w-0">
                                <h2 className="break-all text-base font-bold text-white">
                                    {row.title}
                                </h2>
                                <p className="text-xs text-[var(--muted)]">
                                    {row.categoryLabel} · {row.id} ·{" "}
                                    <span
                                        className={
                                            current.hasPdf
                                                ? "text-emerald-300"
                                                : "text-amber-300"
                                        }
                                    >
                                        {current.hasPdf ? "Available" : "Unavailable"}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                        Tier
                                    </label>
                                    <select
                                        value={current.tier}
                                        onChange={(event) =>
                                            updateDraft(row, {
                                                tier: event.target.value as PackTier
                                            })
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                                    >
                                        {TIERS.map((tier) => (
                                            <option key={tier} value={tier}>
                                                {tier}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                        Price
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--muted)]">
                                            €
                                        </span>
                                        <input
                                            value={priceInputValue(current.price)}
                                            onChange={(event) =>
                                                updateDraft(row, {
                                                    price: event.target.value
                                                })
                                            }
                                            inputMode="decimal"
                                            placeholder="4.99"
                                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-3 text-sm text-white outline-none focus:border-white/25"
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                        PDF path (optional)
                                    </label>
                                    <input
                                        value={current.pdfPath}
                                        onChange={(event) =>
                                            updateDraft(row, {
                                                pdfPath: event.target.value
                                            })
                                        }
                                        placeholder="/packs/example.pdf"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                                    <input
                                        type="checkbox"
                                        checked={current.isHidden}
                                        onChange={(event) =>
                                            updateDraft(row, {
                                                isHidden: event.target.checked
                                            })
                                        }
                                        className="h-4 w-4 accent-[var(--gold)]"
                                    />
                                    Hidden (unavailable)
                                </label>

                                <button
                                    type="button"
                                    onClick={() => void save(row)}
                                    disabled={busy === row.id}
                                    className="rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {busy === row.id ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
