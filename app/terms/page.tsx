// file: app/terms/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms of Service"
            subtitle="Rules for purchasing and using digital quiz packs and memberships."
        >
            <h2>Service provider</h2>
            <p>
                Services are provided by {legalBusiness.tradeName} (
                {legalBusiness.brand}), {legalBusiness.address},{" "}
                {legalBusiness.city}, OIB {legalBusiness.oib}. Contact:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Scope</h2>
            <p>
                We sell digital quiz packs (PDF) and memberships (subscriptions)
                for personal use when hosting quiz nights.
            </p>

            <h2>Account</h2>
            <ul>
                <li>
                    Purchases and memberships require an account with accurate
                    information.
                </li>
                <li>
                    You are responsible for keeping your password safe and for
                    activity on your account.
                </li>
                <li>
                    Violation of these terms may result in account suspension.
                </li>
            </ul>

            <h2>Purchases and prices</h2>
            <ul>
                <li>Prices are shown in euros (EUR).</li>
                <li>
                    Prices are final. {legalBusiness.vatNote}
                </li>
                <li>
                    Payments are processed by <strong>Stripe</strong>. Promo
                    codes are applied on the payment page.
                </li>
            </ul>

            <h2>Digital delivery</h2>
            <p>
                After successful payment, the pack is available for download on
                the “My Downloads” page and/or by email. Content is digital —
                there is no physical delivery.
            </p>

            <h2>Licence</h2>
            <p>
                Purchasing grants you a personal, non-transferable licence to
                use the pack at your own quiz events. Resale, sharing or public
                publishing of packs is prohibited.
            </p>

            <h2>Memberships and credits</h2>
            <ul>
                <li>
                    Each plan grants monthly credits for downloading packs.
                </li>
                <li>
                    Unused credits roll over to the next month up to the allowed
                    limit (rollover cap).
                </li>
                <li>
                    Credits remain valid after cancelling a subscription and can
                    be used until spent.
                </li>
                <li>
                    Access to packs by tier (bronze/silver/gold) applies while
                    the subscription is active or while you have credits.
                </li>
            </ul>

            <h2>Right of withdrawal</h2>
            <p>
                For digital content delivered immediately, the consumer loses
                the right of withdrawal once download has begun with explicit
                consent. See the <Link href="/refund">Refunds</Link> policy.
            </p>

            <h2>Liability</h2>
            <p>
                Content is provided “as is”. We do not guarantee that questions
                suit every event or that all answers are fully accurate.
                Liability is limited to the amount paid for the specific pack or
                membership, within the limits permitted by law.
            </p>

            <h2>Intellectual property</h2>
            <p>
                All packs and content are protected by copyright. Unauthorised
                copying and distribution are prohibited.
            </p>

            <h2>Changes to these terms</h2>
            <p>
                We may update these terms from time to time. Material changes
                will be published on this page with the updated date.
            </p>

            <h2>Governing law</h2>
            <p>
                The law of the Republic of Croatia applies. The competent court
                in the Republic of Croatia has jurisdiction, unless the law
                provides otherwise for consumers.
            </p>
        </LegalPage>
    );
}
