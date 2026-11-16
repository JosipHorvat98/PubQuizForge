// file: app/shipping/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function ShippingPage() {
    return (
        <LegalPage
            title="Shipping Policy"
            subtitle="Digital delivery information for all products."
        >
            <h2>Digital products only</h2>
            <p>
                All products are digital (PDF) and delivered electronically.
                There is no physical shipping and no shipping fees.
            </p>

            <h2>Delivery method</h2>
            <p>
                After successful payment, packs are available immediately on the
                <Link href="/downloads"> My Downloads</Link> page and/or by email
                with a download link.
            </p>

            <h2>Delivery time</h2>
            <p>
                Access is granted as soon as payment is confirmed (usually
                instantly). If there is a delay, contact us and we will resolve
                it quickly.
            </p>

            <h2>Delivery issues</h2>
            <p>
                If you do not receive access, check your spam folder or contact
                us at{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Contact</h2>
            <p>
                Questions about delivery? Email{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>{" "}
                or see the <Link href="/refund">Refund Policy</Link>.
            </p>
        </LegalPage>
    );
}
