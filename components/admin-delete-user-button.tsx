"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminDeleteUserButtonProps = {
    userId: string;
    email: string;
};

type DeleteUserResponse = {
    success?: boolean;
    error?: string;
};

export function AdminDeleteUserButton({
    userId,
    email
}: AdminDeleteUserButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function deleteUser() {
        const confirmed = window.confirm(
            `Delete ${email}? This permanently removes the Supabase account and its download records.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            setErrorMessage(null);

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE"
            });

            const result = (await response.json()) as DeleteUserResponse;

            if (!response.ok) {
                throw new Error(result.error ?? "Unable to delete user.");
            }

            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to delete user."
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={deleteUser}
                disabled={isDeleting}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isDeleting ? "Deleting..." : "Delete User"}
            </button>

            {errorMessage ? (
                <p className="max-w-xs text-right text-xs text-red-300">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
}