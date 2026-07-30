// file: components/delete-user-button.tsx
"use client";

import { useState } from "react";

type DeleteUserButtonProps = {
    userId: string;
    onDeleted?: () => void;
};

export function DeleteUserButton({
    userId,
    onDeleted
}: DeleteUserButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Delete this user? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error ?? "Unable to delete user");
            }

            onDeleted?.();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Unable to delete user.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-300 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? "Deleting..." : "Delete User"}
        </button>
    );
}