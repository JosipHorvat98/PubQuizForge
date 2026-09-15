// file: components/newsletter-form.tsx
"use client";

import { useState } from "react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to subscribe.");
            }

            setDone(true);
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Unable to subscribe."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <p className="text-sm font-semibold text-green-300">
                You&apos;re on the list! 🎉
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm gap-2">
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
            />
            <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? "..." : "Subscribe"}
            </button>
            {error ? <p className="text-sm font-semibold text-red-300">{error}</p> : null}
        </form>
    );
}
