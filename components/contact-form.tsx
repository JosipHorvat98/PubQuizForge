// file: components/contact-form.tsx
"use client";

import { useState } from "react";

export function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            setError("Please fill in your name, email, and message.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to send your message.");
            }

            setDone(true);
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "Unable to send your message."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 text-center">
                <div className="text-5xl">✅</div>
                <h2 className="mt-4 text-2xl font-black tracking-tight">
                    Message sent!
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                    Thanks, {name}. We&apos;ve received your message and will get
                    back to you at{" "}
                    <strong className="text-white">{email}</strong>.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-white">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-white">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
            </div>

            <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-white">
                    Subject
                </label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="What can we help with?"
                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
            </div>

            <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-white">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Write your message..."
                    className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
            </div>

            {error ? (
                <p className="text-sm font-semibold text-red-300">{error}</p>
            ) : null}

            <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
