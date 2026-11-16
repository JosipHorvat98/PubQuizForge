// file: app/refund/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function RefundPage() {
    return (
        <LegalPage
            title="Refund Policy"
            subtitle="Refunds, withdrawal and complaints for digital products."
        >
            <h2>Digital products</h2>
            <p>
                All products are digital (PDF) and available immediately after
                payment. There is no physical delivery.
            </p>

            <h2>Right of withdrawal</h2>
            <p>
                Under EU rules, consumers have 14 days to withdraw, except for
                digital content delivered immediately. By purchasing and
                starting the download you give explicit consent and confirm that
                you lose the right of withdrawal.
            </p>

            <h2>When we approve refunds</h2>
            <ul>
                <li>The PDF cannot be downloaded or the file is faulty.</li>
                <li>Duplicate charge or a technical payment error.</li>
                <li>The pack significantly differs from its description.</li>
            </ul>

            <h2>Memberships</h2>
            <ul>
                <li>
                    You can cancel a subscription at any time (in your account or
                    by contacting us).
                </li>
                <li>
                    Access remains until the end of the paid period; it does not
                    renew after that.
                </li>
                <li>
                    Unused credits remain and can be used until spent.
                </li>
                <li>
                    For a started billing period there is generally no refund,
                    except for statutory rights.
                </li>
            </ul>

            <h2>How to request a refund</h2>
            <p>
                Email{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>{" "}
                with: account email, purchase date, pack name and reason. We
                reply within a reasonable time (usually 2–5 business days).
            </p>

            <h2>Refund method</h2>
            <p>
                Refunds are issued to the original payment method (card) via
                Stripe. Posting time depends on your bank.
            </p>

            <h2>Contact</h2>
            <p>
                For any questions:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                . See also <Link href="/terms">Terms of Service</Link>.
            </p>
        </LegalPage>
    );
}
