// file: components/credits-card.tsx
"use client";

import Link from "next/link";
import { useMembership } from "@/components/providers/membership-provider";

export function CreditsCard() {
  const {
    isMember,
    entitlements,
    creditsAvailable,
    creditsUsed,
    creditsLedgerReady,
    loading
  } = useMembership();

  if (loading) {
    return (
      <section className="rounded-[20px] border border-white/8 bg-[var(--surface-2)] p-6 text-sm text-[var(--muted)]">
        Loading membership credits...
      </section>
    );
  }

  if (!isMember || !entitlements) {
    return null;
  }

  const name = entitlements.name;

  return (
    <section className="rounded-[20px] border border-white/8 bg-[var(--surface-2)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
            Membership
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {entitlements.summary} · {creditsUsed} used this period
          </p>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-[var(--gold)]">
            {creditsLedgerReady && creditsAvailable !== null
              ? creditsAvailable
              : "–"}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            credits left
          </span>
        </div>
      </div>

      {!creditsLedgerReady && creditsAvailable === null && (
        <p className="mt-4 text-xs font-semibold text-yellow-300/80">
          Your credit balance is still being provisioned. Your monthly credit
          is granted on your next billing cycle.
        </p>
      )}

      <div className="mt-5">
        <Link
          href="/memberships"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
        >
          Manage membership
        </Link>
      </div>
    </section>
  );
}
