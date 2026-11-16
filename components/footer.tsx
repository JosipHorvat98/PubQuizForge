import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { legalBusiness } from "@/data/legal";

export function Footer() {
    return (
        <footer className="border-t border-white/8 py-12 text-sm text-[var(--muted)]">
            <div className="container-shell">
                <div className="mb-10 flex flex-col items-center gap-3 border-b border-white/8 pb-8 text-center">
                    <div className="text-lg font-black tracking-tight text-white">
                        Get the newsletter
                    </div>
                    <p className="text-sm">
                        New packs, offers and quiz-night tips. No spam.
                    </p>
                    <NewsletterForm />
                </div>

                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                            Information
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/#packs" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Search
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/round-explainer" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Round Explainer
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                            Our Policies
                        </h3>
                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link href="/privacy" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/refund" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" prefetch={false} className="font-medium text-white/70 hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-white">
                            Get in Touch
                        </h3>
                        <p className="mt-4 leading-7">
                            Need help with your order, quiz packs, or hosting your
                            next event? We are here to help and will get back to
                            you as soon as possible.
                        </p>
                        <p className="mt-4">
                            Email Us:{" "}
                            <a
                                href={`mailto:${legalBusiness.email}`}
                                className="font-semibold text-white underline hover:text-[var(--gold)]"
                            >
                                {legalBusiness.email}
                            </a>
                        </p>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-xs md:flex-row md:items-center md:justify-between">
                    <p>
                        © 2026{" "}
                        <span className="font-bold text-[var(--gold)]">
                            PubQuizForge
                        </span>{" "}
                        · {legalBusiness.tradeName} · {legalBusiness.vatNote}
                    </p>
                    <nav className="flex flex-wrap gap-4">
                        <Link href="/cookies" prefetch={false} className="font-medium text-white/60 hover:text-white">
                            Cookies
                        </Link>
                        <Link href="/impressum" prefetch={false} className="font-medium text-white/60 hover:text-white">
                            Company details
                        </Link>
                        <Link href="/legal" prefetch={false} className="font-medium text-white/60 hover:text-white">
                            Legal
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
