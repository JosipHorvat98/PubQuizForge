// file: components/manage-subscription-button.tsx
"use client";

import { useState } from "react";

type BillingPortalResponse = {
    url?: string;
    error?: string;
};

export function ManageSubscriptionButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function openBillingPortal() {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const response = await fetch("/api/billing-portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = (await response.json()) as BillingPortalResponse;

            if (!response.ok || !result.url) {
                throw new Error(
                    result.error ?? "Unable to open subscription management."
                );
            }

            window.location.assign(result.url);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to open subscription management."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                onClick={openBillingPortal}
                disabled={isLoading}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoading ? "Opening billing portal..." : "Manage Subscription"}
            </button>

            {errorMessage ? (
                <p
                    role="alert"
                    className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
}