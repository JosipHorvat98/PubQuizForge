// file: app/memberships/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { plans } from "@/data/site";

export default function MembershipsPage() {
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
          {plans.map((plan) => (
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
                className={[
                  "mt-8 w-full rounded-xl px-4 py-3 text-sm font-extrabold",
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
                {plan.name === "Gold" ? "Start Gold — Best Value" : `Start ${plan.name}`}
              </button>
            </article>
          ))}
        </div>

        <div className="container-shell mt-10">
          <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8 md:p-10">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              Which plan should you choose?
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-white/8 bg-[var(--surface-2)] p-6">
                <h3 className="text-xl font-bold">Bronze</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">
                  Best for occasional quiz hosts who run a few events per month and want
                  ready-made content without a big commitment.
                </p>
              </article>

              <article className="rounded-2xl border border-white/8 bg-[var(--surface-2)] p-6">
                <h3 className="text-xl font-bold">Silver</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">
                  Great for weekly hosts who need a steady flow of fresh quiz material
                  and better long-term value.
                </p>
              </article>

              <article className="rounded-2xl border border-white/8 bg-[var(--surface-2)] p-6">
                <h3 className="text-xl font-bold">Gold</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">
                  Made for serious quiz masters who want the full archive, premium tools,
                  and the most flexibility.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
