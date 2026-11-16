// file: app/privacy/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy Policy"
            subtitle="How we collect, use and protect your personal data."
        >
            <h2>Data controller</h2>
            <p>
                The data controller is {legalBusiness.tradeName},{" "}
                {legalBusiness.address}, {legalBusiness.city} (brand{" "}
                {legalBusiness.brand}). Contact:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Data we collect</h2>
            <ul>
                <li>
                    <strong>Account:</strong> email, nickname, password hash and
                    registration date.
                </li>
                <li>
                    <strong>Purchases and downloads:</strong> email, purchased or
                    downloaded packs, amount and order status.
                </li>
                <li>
                    <strong>Membership:</strong> plan, subscription status,
                    credit balance and renewal dates.
                </li>
                <li>
                    <strong>Newsletter:</strong> email and subscription status.
                </li>
                <li>
                    <strong>Custom questions and contact:</strong> name, email,
                    theme, question count and message.
                </li>
                <li>
                    <strong>Technical data:</strong> IP address and browser
                    details in server logs (security).
                </li>
            </ul>

            <h2>Legal bases and purposes</h2>
            <ul>
                <li>
                    <strong>Performance of a contract</strong> — providing
                    purchased packs, memberships and support.
                </li>
                <li>
                    <strong>Legitimate interest</strong> — security and
                    prevention of fraud and abuse.
                </li>
                <li>
                    <strong>Consent</strong> — newsletter and marketing messages
                    (you can withdraw at any time).
                </li>
                <li>
                    <strong>Legal obligation</strong> — accounting and tax
                    requirements.
                </li>
            </ul>

            <h2>Payments</h2>
            <p>
                Payments are processed by <strong>Stripe</strong>. We do not
                store card data — it is handled by Stripe under its own privacy
                terms.
            </p>

            <h2>Recipients and processors</h2>
            <ul>
                <li>
                    <strong>Supabase</strong> — database and authentication.
                </li>
                <li>
                    <strong>Vercel</strong> — application hosting and cookieless
                    analytics.
                </li>
                <li>
                    <strong>Stripe</strong> — payment processing.
                </li>
                <li>
                    <strong>Resend</strong> — transactional email delivery.
                </li>
            </ul>
            <p>
                These providers may process data outside the EU/EEA with
                appropriate safeguards (e.g. standard contractual clauses).
            </p>

            <h2>Retention</h2>
            <ul>
                <li>
                    Account data — while the account is active, and after
                    deletion until statutory obligations end.
                </li>
                <li>
                    Accounting records — in line with Croatian law (e.g. 11
                    years).
                </li>
                <li>Newsletter — until you unsubscribe.</li>
            </ul>

            <h2>Your rights</h2>
            <p>
                You have the right to access, rectification, erasure,
                restriction, portability, objection and withdrawal of consent.
                Send requests to{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                . You also have the right to lodge a complaint with the Croatian
                Personal Data Protection Agency (AZOP).
            </p>

            <h2>Cookies</h2>
            <p>
                See our <Link href="/cookies">Cookie Policy</Link>.
            </p>

            <h2>Security</h2>
            <p>
                We apply reasonable technical and organisational measures to
                protect data.
            </p>
        </LegalPage>
    );
}
