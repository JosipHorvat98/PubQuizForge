// file: components/legal-page.tsx
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { legalBusiness } from "@/data/legal";

export function LegalPage({
    title,
    subtitle,
    children
}: {
    title: string;
    subtitle?: string;
    children: ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space pb-20">
                <div className="container-shell max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                        Legal
                    </div>

                    <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                        {title}
                    </h1>

                    {subtitle ? (
                        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                            {subtitle}
                        </p>
                    ) : null}

                    <p className="mt-2 text-xs text-[var(--muted)]">
                        Last updated: {legalBusiness.lastUpdated}
                    </p>

                    <div className="mt-8 space-y-5 text-sm leading-7 text-[var(--muted)] [&_a]:text-[var(--gold)] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-4 [&_h3]:font-bold [&_h3]:text-white [&_li]:mt-1 [&_strong]:text-white [&_ul]:list-disc [&_ul]:pl-5">
                        {children}
                    </div>

                    <p className="mt-10 border-t border-white/8 pt-6 text-xs text-[var(--muted)]">
                        {legalBusiness.tradeName} · {legalBusiness.address},{" "}
                        {legalBusiness.city} · OIB {legalBusiness.oib} ·{" "}
                        {legalBusiness.vatNote} ·{" "}
                        <a href={`mailto:${legalBusiness.email}`}>
                            {legalBusiness.email}
                        </a>
                    </p>
                </div>
            </section>

            <Footer />
        </main>
    );
}
