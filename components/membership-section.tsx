// file: components/membership-section.tsx
"use client";

import { plans } from "@/data/site";
import { SectionHeading } from "@/components/section-heading";
import { cx } from "@/lib/utils";
import { startCheckout } from "@/lib/checkout";

const subscriptionPriceIds: Record<string, string> = {
    bronze: "price_1TKFNhEDQ5UIKPib0ICI1PuA",
    silver: "price_1TKFNwEDQ5UIKPibn4gyHs1H",
    gold: "price_1TKFO9EDQ5UIKPibl50dVxzs"
};

export function MembershipSection() {
    async function handleSubscribe(planId: string) {
        const priceId = subscriptionPriceIds[planId];

        if (!priceId) {
            alert(`Missing Stripe price ID for ${planId}`);
            return;
        }

        try {
            await startCheckout({
                mode: "subscription",
                priceId,
                slug: planId
            });
        } catch (error) {
            console.error(error);
            alert("Unable to start checkout.");
        }
    }

    return (
        <section
            id="memberships"
            className="section-space bg-[linear-gradient(180deg,transparent,rgba(245,200,66,0.03),transparent)]"
        >
            <div className="container-shell">
                <SectionHeading
                    label="Memberships"
                    title="Quiz Master Tiers"
                    subtitle="Subscribe and save — new packs added every week for members."
                />

                <div className="grid gap-5 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <article
                            key={plan.id}
                            className={cx(
                                "relative rounded-[28px] border p-7",
                                plan.featured
                                    ? "border-[var(--gold)] bg-[linear-gradient(145deg,#1e1c10,#16161a)] shadow-[0_0_0_1px_rgba(245,200,66,0.08),0_24px_64px_rgba(0,0,0,0.35)]"
                                    : "border-white/8 bg-[var(--surface)]"
                            )}
                        >
                            {plan.featured ? (
                                <span className="absolute right-5 top-5 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black">
                                    Most Popular
                                </span>
                            ) : null}

                            <div className="text-4xl">{plan.icon}</div>

                            <div
                                className={cx(
                                    "mt-4 text-3xl font-black tracking-tight",
                                    plan.name === "Bronze" && "text-[var(--bronze)]",
                                    plan.name === "Silver" && "text-[var(--silver)]",
                                    plan.name === "Gold" && "text-[var(--gold)]"
                                )}
                            >
                                {plan.name}
                            </div>

                            <div className="mt-3 text-5xl font-black tracking-tight">
                                {plan.price}
                                <span className="ml-2 text-base font-medium text-[var(--muted)]">
                                    / month
                                </span>
                            </div>

                            <p className="mt-4 min-h-14 text-sm leading-6 text-[var(--muted)]">
                                {plan.description}
                            </p>

                            <div className="my-6 h-px bg-white/8" />

                            <ul className="space-y-3">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature.label}
                                        className={cx(
                                            "flex items-start gap-3 text-sm leading-6",
                                            feature.included ? "text-white" : "text-[var(--muted)]"
                                        )}
                                    >
                                        <span
                                            className={cx(
                                                "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                                feature.included && plan.name === "Bronze" && "bg-[var(--bronze-dim)] text-[var(--bronze)]",
                                                feature.included && plan.name === "Silver" && "bg-[var(--silver-dim)] text-[var(--silver)]",
                                                feature.included && plan.name === "Gold" && "bg-[var(--gold-dim)] text-[var(--gold)]",
                                                !feature.included && "bg-white/6 text-[var(--muted)]"
                                            )}
                                        >
                                            {feature.included ? "✓" : "–"}
                                        </span>

                                        <span className={feature.strong ? "font-semibold" : undefined}>
                                            {feature.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                className={cx(
                                    "mt-8 w-full rounded-xl px-4 py-3 text-sm font-extrabold",
                                    plan.name === "Bronze" &&
                                    "border border-[rgba(205,127,50,0.3)] bg-[var(--bronze-dim)] text-[var(--bronze)] hover:bg-[var(--bronze)] hover:text-white",
                                    plan.name === "Silver" &&
                                    "border border-[rgba(199,208,221,0.3)] bg-[var(--silver-dim)] text-[var(--silver)] hover:bg-[var(--silver)] hover:text-black",
                                    plan.name === "Gold" &&
                                    "bg-[var(--gold)] text-black hover:bg-[var(--gold-strong)]"
                                )}
                            >
                                {plan.name === "Gold" ? "Start Gold — Best Value" : `Start ${plan.name}`}
                            </button>
                        </article>
                    ))}
                </div>

                <p className="mt-6 text-center text-sm text-[var(--muted)]">
                    Cancel anytime · No hidden fees · Billed monthly · VAT may apply
                </p>
            </div>
        </section>
    );
}