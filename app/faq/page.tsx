// file: app/faq/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function FaqPage() {
    return (
        <LegalPage
            title="Frequently Asked Questions"
            subtitle="Quick answers about packs, memberships and payments."
        >
            <h2>What is a quiz pack?</h2>
            <p>
                A ready-made set of questions and answers (usually 50) in PDF
                format, ready to print and host at a quiz night.
            </p>

            <h2>How do I download a pack?</h2>
            <p>
                After payment the pack is available on the{" "}
                <Link href="/downloads">My Downloads</Link> page and/or by email
                with a download link.
            </p>

            <h2>Do I need an account?</h2>
            <p>
                We recommend an account so your downloads and membership stay
                linked to you. Signing up is quick.
            </p>

            <h2>How do memberships and credits work?</h2>
            <p>
                Each plan grants monthly credits. One credit = one pack
                download. Unused credits roll over up to the allowed limit.
            </p>

            <h2>What does tier (bronze/silver/gold) mean?</h2>
            <p>
                The tier is the minimum membership needed to buy or redeem a
                given pack. Gold gives access to all packs. Some packs are open
                to everyone (No tier).
            </p>

            <h2>Do my credits stay if I cancel?</h2>
            <p>
                Yes. Credits remain and can be used until spent, based on the
                plan that granted them.
            </p>

            <h2>What format are the packs?</h2>
            <p>
                PDF, formatted for A4 printing. Packs include questions, answers
                and answer sheets where relevant.
            </p>

            <h2>Can I resell or share packs?</h2>
            <p>
                No. The licence is personal and non-transferable. Resale and
                public distribution are not allowed.
            </p>

            <h2>How do I pay?</h2>
            <p>
                By card through the secure <strong>Stripe</strong> checkout. Card
                details never pass through our site.
            </p>

            <h2>Do you have promo codes?</h2>
            <p>
                Yes — enter the code on the payment page (Add promotion code).
            </p>

            <h2>How do refunds work?</h2>
            <p>
                See the <Link href="/refund">Refund Policy</Link>. For download
                or payment issues, contact{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Can I order custom questions?</h2>
            <p>
                Yes — via the{" "}
                <Link href="/custom-questions">Custom Questions</Link> page. We
                will get back to you with the details.
            </p>

            <h2>How do I contact you?</h2>
            <p>
                Email:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                , or use the <Link href="/contact">Contact</Link> page.
            </p>
        </LegalPage>
    );
}
