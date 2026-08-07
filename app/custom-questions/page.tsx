// file: app/custom-questions/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CustomQuestionsForm } from "@/components/custom-questions-form";

export default function CustomQuestionsPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Custom Questions
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Need questions written just for you?
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Tell us the theme, audience and style, and we&apos;ll
                        write a custom set of questions for your quiz night.
                        We&apos;ll get back to you by email.
                    </p>
                </div>
            </section>

            <section className="pb-24">
                <div className="container-shell max-w-2xl">
                    <CustomQuestionsForm />
                </div>
            </section>

            <Footer />
        </main>
    );
}