// file: app/cookies/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export default function CookiesPage() {
    return (
        <LegalPage
            title="Politika kolačića"
            subtitle="Koje kolačiće koristimo i zašto."
        >
            <p>
                Kolačići su male datoteke koje se pohranjuju u vaš preglednik.
                Koristimo ih za rad prijave i sigurnost te za plaćanje.
            </p>

            <h2>Nužni kolačići</h2>
            <ul>
                <li>
                    <strong>Supabase (prijava)</strong> — kolačići sesije (npr.
                    sb-…-auth-token) omogućuju prijavu i pristup računu. Bez
                    njih se ne možete prijaviti.
                </li>
            </ul>

            <h2>Plaćanje</h2>
            <ul>
                <li>
                    <strong>Stripe</strong> — tijekom plaćanja koriste se Stripe
                    kolačići na checkout stranici radi sigurnosti i
                    sprječavanja prijevara.
                </li>
            </ul>

            <h2>Analitika</h2>
            <ul>
                <li>
                    <strong>Vercel Web Analytics</strong> — koristimo analitiku
                    koja radi <strong>bez kolačića</strong> i prikuplja
                    agregirane podatke o posjetima.
                </li>
            </ul>

            <h2>Marketinški kolačići</h2>
            <p>
                Trenutačno <strong>ne koristimo</strong> marketinške ni
                profilacijske kolačiće.
            </p>

            <h2>Upravljanje kolačićima</h2>
            <p>
                Kolačiće možete obrisati ili blokirati u postavkama preglednika.
                Blokiranje nužnih kolačića može onemogućiti prijavu i kupnju.
            </p>

            <p>
                Više o obradi osobnih podataka:{" "}
                <Link href="/privacy">Pravila privatnosti</Link>.
            </p>
        </LegalPage>
    );
}
