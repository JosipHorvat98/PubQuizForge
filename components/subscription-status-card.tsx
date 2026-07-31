import Link from "next/link";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";

export type AccountSubscription = {
  plan_id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
};

type SubscriptionStatusCardProps = {
  subscription: AccountSubscription | null;
};

function formatPlanName(planId: string): string {
  if (!planId) {
    return "Membership";
  }

  return `${planId.charAt(0).toUpperCase()}${planId.slice(1)}`;
}

function formatStatus(status: string): string {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function SubscriptionStatusCard({
  subscription
}: SubscriptionStatusCardProps) {
  if (!subscription) {
    return (
      <section className="border-t border-white/8 p-7 md:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
          Membership
        </p>

        <h2 className="mt-3 text-2xl font-black tracking-tight">
          No active membership
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          You can continue buying individual quiz packs or subscribe to a
          membership plan.
        </p>

        <div className="mt-6">
          <Link
            href="/memberships"
            className="inline-flex rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[var(--gold-strong)] active:scale-[0.98]"
          >
            View Memberships
          </Link>
        </div>
      </section>
    );
  }

  const periodEnd = formatDate(subscription.current_period_end);

  return (
    <section className="border-t border-white/8 p-7 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
            Current Membership
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            {formatPlanName(subscription.plan_id)}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
              {formatStatus(subscription.status)}
            </span>

            {subscription.cancel_at_period_end ? (
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                Cancellation scheduled
              </span>
            ) : null}
          </div>

          {periodEnd ? (
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {subscription.cancel_at_period_end
                ? `Your access remains active until ${periodEnd}.`
                : `Your current billing period ends on ${periodEnd}.`}
            </p>
          ) : null}
        </div>

        <ManageSubscriptionButton />
      </div>
    </section>
  );
}