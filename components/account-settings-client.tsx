// file: components/account-settings-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/25";

export function AccountSettingsClient({
    email,
    initialNickname
}: {
    email: string;
    initialNickname: string;
}) {
    const router = useRouter();

    const [nickname, setNickname] = useState(initialNickname);
    const [nickSaving, setNickSaving] = useState(false);
    const [nickMessage, setNickMessage] = useState<string | null>(null);
    const [nickError, setNickError] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMessage, setPwMessage] = useState<string | null>(null);
    const [pwError, setPwError] = useState<string | null>(null);

    async function handleNickname(event: React.FormEvent) {
        event.preventDefault();
        setNickError(null);
        setNickMessage(null);

        const value = nickname.trim();

        if (value.length < 2) {
            setNickError("Nickname must be at least 2 characters.");
            return;
        }

        setNickSaving(true);

        try {
            const { error } = await createClient().auth.updateUser({
                data: { nickname: value }
            });

            if (error) {
                throw error;
            }

            setNickMessage("Nickname updated.");
            router.refresh();
        } catch (caught) {
            setNickError(
                caught instanceof Error
                    ? caught.message
                    : "Unable to update nickname."
            );
        } finally {
            setNickSaving(false);
        }
    }

    async function handlePassword(event: React.FormEvent) {
        event.preventDefault();
        setPwError(null);
        setPwMessage(null);

        if (password.length < 6) {
            setPwError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirm) {
            setPwError("Passwords do not match.");
            return;
        }

        setPwSaving(true);

        try {
            const { error } = await createClient().auth.updateUser({ password });

            if (error) {
                throw error;
            }

            setPwMessage("Password updated.");
            setPassword("");
            setConfirm("");
        } catch (caught) {
            setPwError(
                caught instanceof Error
                    ? caught.message
                    : "Unable to update password."
            );
        } finally {
            setPwSaving(false);
        }
    }

    return (
        <div className="mt-8 grid gap-6">
            <form
                onSubmit={handleNickname}
                className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8"
            >
                <h2 className="text-2xl font-black tracking-tight">Nickname</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    This is the name shown next to your account ({email}).
                </p>

                <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                        Display name
                    </label>
                    <input
                        className={inputClass}
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                        maxLength={30}
                        placeholder="QuizMasterJosip"
                    />
                </div>

                <button
                    type="submit"
                    disabled={nickSaving}
                    className="mt-5 rounded-xl bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {nickSaving ? "Saving..." : "Save nickname"}
                </button>

                {nickMessage ? (
                    <p className="mt-3 text-sm font-semibold text-green-300">
                        {nickMessage}
                    </p>
                ) : null}
                {nickError ? (
                    <p className="mt-3 text-sm font-semibold text-red-300">
                        {nickError}
                    </p>
                ) : null}
            </form>

            <form
                onSubmit={handlePassword}
                className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8"
            >
                <h2 className="text-2xl font-black tracking-tight">Password</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">
                    Choose a new password for your account.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            New password
                        </label>
                        <input
                            type="password"
                            className={inputClass}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={6}
                            placeholder="At least 6 characters"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            className={inputClass}
                            value={confirm}
                            onChange={(event) => setConfirm(event.target.value)}
                            minLength={6}
                            placeholder="Repeat password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={pwSaving}
                    className="mt-5 rounded-xl bg-[var(--gold)] px-5 py-2.5 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {pwSaving ? "Saving..." : "Update password"}
                </button>

                {pwMessage ? (
                    <p className="mt-3 text-sm font-semibold text-green-300">
                        {pwMessage}
                    </p>
                ) : null}
                {pwError ? (
                    <p className="mt-3 text-sm font-semibold text-red-300">
                        {pwError}
                    </p>
                ) : null}
            </form>
        </div>
    );
}
