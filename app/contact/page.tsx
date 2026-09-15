// file: app/contact/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Contact
                    </div>

                    <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
                        Let&apos;s talk about your next quiz night.
                    </h1>

                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
                        Use this page for support, custom pack requests, partnership enquiries,
                        or questions about memberships and downloads.
                    </p>
                </div>
            </section>

            <section className="pb-20">
                <div className="container-shell grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                    <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                        <h2 className="text-2xl font-black tracking-tight">Get in touch</h2>

                        <div className="mt-6 space-y-5 text-[var(--muted)]">
                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                                    Email
                                </div>
                                <p className="mt-2 text-base text-white">jojohorvat@gmail.com</p>
                            </div>

                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                                    Support
                                </div>
                                <p className="mt-2 leading-7">
                                    Questions about packs, memberships, billing, or downloads.
                                </p>
                            </div>

                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                                    Custom packs
                                </div>
                                <p className="mt-2 leading-7">
                                    Need a themed quiz for a pub event, fundraiser, company night, or private party?
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                        <h2 className="text-2xl font-black tracking-tight">Send a message</h2>

                        <ContactForm />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}