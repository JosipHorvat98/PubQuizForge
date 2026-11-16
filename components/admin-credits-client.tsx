// file: components/admin-credits-client.tsx
"use client";

import { useState } from "react";

export type AdminCreditRow = {
    userId: string;
    email: string;
    nickname: string;
    planId: string | null;
    creditsAvailable: number;
    monthlyCredits: number;
    maxRollover: number;
    lastPeriodStart: string | null;
    hasLedger: boolean;
};

type CreditAction = "add" | "set" | "reset";

export function AdminCreditsClient({ rows }: { rows: AdminCreditRow[] }) {
    const [list, setList] = useState(rows);
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function amountFor(email: string): number {
        const parsed = Number(amounts[email] ?? "");

        return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
    }

    async function apply(email: string, action: CreditAction) {
        setBusy(email);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/admin/credits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    action,
                    amount: action === "reset" ? 0 : amountFor(email)
                })
            });

            const result = (await response.json()) as {
                error?: string;
                credits_available?: number;
                plan_id?: string;
                monthly_credits?: number;
                max_rollover?: number;
                last_period_start?: string | null;
            };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to update credits");
            }

            setList((prev) =>
                prev.map((row) =>
                    row.email === email
                        ? {
                              ...row,
                              creditsAvailable:
                                  result.credits_available ??
                                  row.creditsAvailable,
                              planId: result.plan_id ?? row.planId,
                              monthlyCredits:
                                  result.monthly_credits ?? row.monthlyCredits,
                              maxRollover:
                                  result.max_rollover ?? row.maxRollover,
                              lastPeriodStart:
                                  result.last_period_start ??
                                  row.lastPeriodStart,
                              hasLedger: true
                          }
                        : row
                )
            );
            setMessage(`Updated credits for ${email}.`);
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : "Unable to update credits"
            );
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="mt-8 grid gap-4">
            {message ? (
                <p className="text-sm font-semibold text-green-300">{message}</p>
            ) : null}
            {error ? (
                <p className="text-sm font-semibold text-red-300">{error}</p>
            ) : null}

            {list.length === 0 ? (
                <p className="rounded-2xl border border-white/8 bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--muted)]">
                    No users yet.
                </p>
            ) : (
                list.map((row) => (
                    <article
                        key={row.userId}
                        className="rounded-[22px] border border-white/8 bg-[var(--surface)] p-5 md:p-6"
                    >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                                <h2 className="break-all text-lg font-black">
                                    {row.nickname || row.email}
                                </h2>
                                <p className="mt-1 break-all text-xs text-[var(--muted)]">
                                    {row.email}
                                </p>
                                <p className="mt-2 text-xs text-[var(--muted)]">
                                    Plan:{" "}
                                    <span className="font-bold text-white">
                                        {row.planId ?? "none"}
                                    </span>
                                    {" · "}Monthly: {row.monthlyCredits}
                                    {" · "}Rollover cap: {row.maxRollover}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
                                        Credits
                                    </p>
                                    <p className="text-3xl font-black text-[var(--gold)]">
                                        {row.creditsAvailable}
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={amounts[row.email] ?? ""}
                                        onChange={(event) =>
                                            setAmounts((prev) => ({
                                                ...prev,
                                                [row.email]: event.target.value
                                            }))
                                        }
                                        placeholder="0"
                                        className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/25"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void apply(row.email, "add")
                                        }
                                        disabled={busy === row.email}
                                        className="rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void apply(row.email, "set")
                                        }
                                        disabled={busy === row.email}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Set
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void apply(row.email, "reset")
                                        }
                                        disabled={busy === row.email}
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
