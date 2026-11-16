// file: app/legal/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness, legalLinks } from "@/data/legal";

export default function LegalHubPage() {
    return (
        <LegalPage
            title="Legal"
            subtitle="Terms, privacy and business information in one place."
        >
            <ul>
                {legalLinks
                    .filter((link) => link.href !== "/legal")
                    .map((link) => (
                        <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
            </ul>

            <h2>Business</h2>
            <p>
                {legalBusiness.tradeName} ({legalBusiness.brand}) · owner{" "}
                {legalBusiness.owner} · {legalBusiness.address},{" "}
                {legalBusiness.city}. Contact:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>
            <p>{legalBusiness.vatNote}</p>
        </LegalPage>
    );
}
