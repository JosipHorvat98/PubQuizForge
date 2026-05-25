// file: components/auth-submit-button.tsx
"use client";

import { useFormStatus } from "react-dom";

type AuthSubmitButtonProps = {
    idleLabel: string;
    pendingLabel: string;
    className?: string;
};

export function AuthSubmitButton({
    idleLabel,
    pendingLabel,
    className
}: AuthSubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className={
                className ??
                "mt-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black transition duration-150 hover:bg-[var(--gold-strong)] disabled:cursor-not-allowed disabled:opacity-70"
            }
        >
            {pending ? pendingLabel : idleLabel}
        </button>
    );
}