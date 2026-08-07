// file: components/custom-questions-admin-client.tsx
"use client";

import { useRouter } from "next/navigation";

export type CustomQuestionRow = {
    id: string;
    name: string;
    email: string;
    theme: string;
    question_count: number;
    details: string | null;
    is_handled: boolean;
    created_at: string;
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(value));
}

export function CustomQuestionsAdminClient({
    rows
}: {
    rows: CustomQuestionRow[];
}) {
    const router = useRouter();

    async function toggleHandled(row: CustomQuestionRow) {
        try {
            const response = await fetch(
                `/api/admin/custom-questions/${row.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_handled: !row.is_handled })
                }
            );

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to update request");
            }

            router.refresh();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Unable to update request");
        }
    }

    async function remove(row: CustomQuestionRow) {
        const confirmed = window.confirm(
            `Delete the request from ${row.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/admin/custom-questions/${row.id}`,
                { method: "DELETE" }
            );

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to delete request");
            }

            router.refresh();
        } catch (e) {
            alert(e instanceof Error ? e.message : "Unable to delete request");
        }
    }

    if (rows.length === 0) {
        return (
            <p className="rounded-2xl border border-white/8 bg-[var(--surface)] p-6 text-[var(--muted)]">
                No custom question requests yet.
            </p>
        );
    }

    return (
        <div className="grid gap-4">
            {rows.map((row) => (
                <article
                    key={row.id}
                    className="rounded-[24px] border border-white/8 bg-[var(--surface)] p-5"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                                <span
                                    className={
                                        row.is_handled
                                            ? "text-green-300"
                                            : "text-yellow-300"
                                    }
                                >
                                    {row.is_handled ? "Handled" : "New"}
                                </span>
                                <span>· {formatDate(row.created_at)}</span>
                            </div>

                            <h2 className="mt-2 text-xl font-black">
                                {row.name}
                                <span className="ml-2 text-sm font-medium text-[var(--muted)]">
                                    {row.email}
                                </span>
                            </h2>

                            <p className="mt-2 text-sm text-[var(--muted)]">
                                {row.theme} · {row.question_count} questions
                            </p>

                            {row.details ? (
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                                    {row.details}
                                </p>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => void toggleHandled(row)}
                                className={
                                    row.is_handled
                                        ? "rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
                                        : "rounded-lg bg-[var(--gold)] px-4 py-2 text-xs font-extrabold text-black hover:bg-[var(--gold-strong)]"
                                }
                            >
                                {row.is_handled ? "Mark as new" : "Mark handled"}
                            </button>

                            <button
                                type="button"
                                onClick={() => void remove(row)}
                                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/15"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}