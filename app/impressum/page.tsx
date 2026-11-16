// file: app/impressum/page.tsx
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function ImpressumPage() {
    return (
        <LegalPage
            title="Company details"
            subtitle="Information about the service provider."
        >
            <h2>Service provider</h2>
            <ul>
                <li>Name: {legalBusiness.tradeName}</li>
                <li>Brand: {legalBusiness.brand}</li>
                <li>Owner: {legalBusiness.owner}</li>
                <li>
                    Address: {legalBusiness.address}, {legalBusiness.city},{" "}
                    {legalBusiness.country}
                </li>
                <li>
                    Email:{" "}
                    <a href={`mailto:${legalBusiness.email}`}>
                        {legalBusiness.email}
                    </a>
                </li>
                <li>
                    Website:{" "}
                    <a href={legalBusiness.website}>
                        {legalBusiness.website}
                    </a>
                </li>
                <li>VAT status: {legalBusiness.vatNote}</li>
            </ul>

            <h2>Business activity</h2>
            <p>
                {legalBusiness.brand} is a brand of {legalBusiness.tradeName}.
                Sale of digital content (quiz packs in PDF format) and
                memberships (subscriptions) online.
            </p>

            <h2>Content responsibility</h2>
            <p>
                Content is prepared with care, but we do not guarantee that
                every question and answer is fully accurate. For questions or
                corrections, contact us at the email above.
            </p>

            <h2>Copyright</h2>
            <p>
                All quiz packs and content are original works and are protected
                by copyright. Unauthorised copying, resale or distribution is
                prohibited.
            </p>

            <h2>Online dispute resolution</h2>
            <p>
                Consumers may use the Online Dispute Resolution platform of the
                European Commission. They may also contact the competent
                authority in the Republic of Croatia.
            </p>
        </LegalPage>
    );
}
