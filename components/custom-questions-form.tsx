// file: components/custom-questions-form.tsx
"use client";

import { useState } from "react";

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25";

export function CustomQuestionsForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [theme, setTheme] = useState("");
    const [questionCount, setQuestionCount] = useState(10);
    const [details, setDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name.trim() || !email.trim()) {
            setError("Please fill in your name and email.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/custom-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    theme,
                    questionCount,
                    details
                })
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to submit your request.");
            }

            setDone(true);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unable to submit your request.");
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 text-center">
                <div className="text-5xl">✅</div>
                <h2 className="mt-4 text-2xl font-black tracking-tight">
                    Request received!
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                    Thanks, {name}. We&apos;ll review your request and get back
                    to you at <strong className="text-white">{email}</strong>.
                </p>
            </div>
        );
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8"
        >
            <h2 className="text-2xl font-black tracking-tight">
                Request custom questions
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Your name
                    </label>
                    <input
                        className={inputClass}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Jane Host"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Your email
                    </label>
                    <input
                        type="email"
                        className={inputClass}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Theme
                    </label>
                    <input
                        type="text"
                        className={inputClass}
                        value={theme}
                        onChange={(event) => setTheme(event.target.value)}
                        placeholder="e.g. General Knowledge, TV & Film, or describe your theme..."
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Number of questions
                    </label>
                    <input
                        type="number"
                        min={5}
                        max={100}
                        className={inputClass}
                        value={questionCount}
                        onChange={(event) =>
                            setQuestionCount(Number(event.target.value) || 10)
                        }
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Details (optional)
                </label>
                <textarea
                    className={`${inputClass} min-h-[140px]`}
                    value={details}
                    onChange={(event) => setDetails(event.target.value)}
                    placeholder="Audience, difficulty, specific topics, round ideas..."
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? "Sending..." : "Send request"}
            </button>

            {error ? (
                <p className="mt-4 text-sm font-semibold text-red-300">
                    {error}
                </p>
            ) : null}
        </form>
    );
}
