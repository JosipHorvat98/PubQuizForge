// file: app/memberships/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { plans } from "@/data/site";
import { startCheckout } from "@/lib/checkout";

const subscriptionPriceIds: Record<string, string> = {
    bronze: "price_1TKFNhEDQ5UIKPib0ICI1PuA",
    silver: "price_1TKFNwEDQ5UIKPibn4gyHs1H",
    gold: "price_1TKFO9EDQ5UIKPibl50dVxzs"
};

const CHECKOUT_STORAGE_KEY = "pqf_checkout_plan";
const CHECKOUT_RETURN_KEY = "pqf_checkout_returned";

export default function MembershipsPage() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        const markReturnedAndReload = () => {
            const activeCheckout = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);

            if (activeCheckout && !sessionStorage.getItem(CHECKOUT_RETURN_KEY)) {
                sessionStorage.setItem(CHECKOUT_RETURN_KEY, "1");
                window.location.reload();
                return;
            }

            setLoadingPlan(null);
            sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
            sessionStorage.removeItem(CHECKOUT_RETURN_KEY);
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                markReturnedAndReload();
                return;
            }

            markReturnedAndReload();
        };

        window.addEventListener("pageshow", handlePageShow);

        markReturnedAndReload();

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    async function handleSubscribe(planId: string) {
        const priceId = subscriptionPriceIds[planId];

        if (!priceId) {
            alert(`Missing Stripe price ID for ${planId}`);
            return;
        }

        try {
            setLoadingPlan(planId);
            sessionStorage.setItem(CHECKOUT_STORAGE_KEY, planId);
            sessionStorage.removeItem(CHECKOUT_RETURN_KEY);

            await startCheckout({
                mode: "subscription",
                priceId,
                slug: planId
            });
        } catch (error) {
            console.error(error);
            setLoadingPlan(null);
            sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
            sessionStorage.removeItem(CHECKOUT_RETURN_KEY);
            alert(error instanceof Error ? error.message : "Unable to start checkout.");
        }
    }

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Memberships
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Choose the tier that fits your quiz nights.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Subscribe for better value, faster access to new quiz packs, and more tools
                        for regular hosts. Upgrade anytime as your quiz nights grow.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell grid gap-5 lg:grid-cols-3">
                    {plans.map((plan) => {
                        const isLoading = loadingPlan === plan.id;

                        return (
                            <article
                                key={plan.id}
                                className={[
                                    "relative rounded-[28px] border p-7",
                                    plan.featured
                                        ? "border-[var(--gold)] bg-[linear-gradient(145deg,#1e1c10,#16161a)] shadow-[0_0_0_1px_rgba(245,200,66,0.08),0_24px_64px_rgba(0,0,0,0.35)]"
                                        : "border-white/8 bg-[var(--surface)]"
                                ].join(" ")}
                            >
                                {plan.featured ? (
                                    <span className="absolute right-5 top-5 rounded-full bg-[var(--gold)] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black">
                                        Most Popular
                                    </span>
                                ) : null}

                                <div className="text-4xl">{plan.icon}</div>

                                <div
                                    className={[
                                        "mt-4 text-3xl font-black tracking-tight",
                                        plan.name === "Bronze" ? "text-[var(--bronze)]" : "",
                                        plan.name === "Silver" ? "text-[var(--silver)]" : "",
                                        plan.name === "Gold" ? "text-[var(--gold)]" : ""
                                    ].join(" ")}
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
                                            className={[
                                                "flex items-start gap-3 text-sm leading-6",
                                                feature.included ? "text-white" : "text-[var(--muted)]"
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                                    feature.included && plan.name === "Bronze"
                                                        ? "bg-[var(--bronze-dim)] text-[var(--bronze)]"
                                                        : "",
                                                    feature.included && plan.name === "Silver"
                                                        ? "bg-[var(--silver-dim)] text-[var(--silver)]"
                                                        : "",
                                                    feature.included && plan.name === "Gold"
                                                        ? "bg-[var(--gold-dim)] text-[var(--gold)]"
                                                        : "",
                                                    !feature.included ? "bg-white/6 text-[var(--muted)]" : ""
                                                ].join(" ")}
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
                                    type="button"
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isLoading}
                                    className={[
                                        "mt-8 w-full rounded-xl px-4 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60",
                                        plan.name === "Bronze"
                                            ? "border border-[rgba(205,127,50,0.3)] bg-[var(--bronze-dim)] text-[var(--bronze)] hover:bg-[var(--bronze)] hover:text-white"
                                            : "",
                                        plan.name === "Silver"
                                            ? "border border-[rgba(199,208,221,0.3)] bg-[var(--silver-dim)] text-[var(--silver)] hover:bg-[var(--silver)] hover:text-black"
                                            : "",
                                        plan.name === "Gold"
                                            ? "bg-[var(--gold)] text-black hover:bg-[var(--gold-strong)]"
                                            : ""
                                    ].join(" ")}
                                >
                                    {isLoading
                                        ? "Redirecting..."
                                        : plan.name === "Gold"
                                            ? "Start Gold — Best Value"
                                            : `Start ${plan.name}`}
                                </button>
                            </article>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </main>
    );
}