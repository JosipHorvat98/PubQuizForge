// file: app/faq/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function FaqPage() {
    return (
        <LegalPage
            title="Često postavljena pitanja"
            subtitle="Brzi odgovori o paketima, članstvima i plaćanju."
        >
            <h2>Što je quiz pack?</h2>
            <p>
                Gotov set pitanja i odgovora (obično 50 pitanja) u PDF formatu,
                spreman za ispis i vođenje quiz večeri.
            </p>

            <h2>Kako preuzimam paket?</h2>
            <p>
                Nakon plaćanja paket je dostupan na stranici{" "}
                <Link href="/downloads">My Downloads</Link> i/ili putem emaila s
                poveznicom za preuzimanje.
            </p>

            <h2>Trebam li račun?</h2>
            <p>
                Za kupnju i članstvo preporučujemo račun kako bi preuzimanja i
                članstvo bili vezani uz vas. Registracija je brza.
            </p>

            <h2>Kako rade članstva i krediti?</h2>
            <p>
                Svaki plan daje mjesečne kredite. Jedan kredit = jedno
                preuzimanje paketa. Neiskorišteni krediti prenose se do
                dopuštenog limita.
            </p>

            <h2>Što znači tier (bronze/silver/gold)?</h2>
            <p>
                Tier označava minimalno članstvo potrebno za kupnju ili
                preuzimanje određenog paketa. Gold daje pristup svim paketima.
                Neki paketi su dostupni svima (No tier).
            </p>

            <h2>Ostaju li mi krediti ako otkažem pretplatu?</h2>
            <p>
                Da. Krediti ostaju i možete ih iskoristiti do potroška, prema
                planu koji ih je dodijelio.
            </p>

            <h2>Koji je format paketa?</h2>
            <p>PDF, prilagođen ispisu (A4). Sadrži pitanja, odgovore i listiće po potrebi.</p>

            <h2>Mogu li preprodavati ili dijeliti pakete?</h2>
            <p>
                Ne. Licenca je osobna i neprenosiva. Preprodaja i javna
                distribucija nisu dopuštene.
            </p>

            <h2>Kako plaćam?</h2>
            <p>
                Karticom putem sigurnog <strong>Stripe</strong> checkouta.
                Podaci o kartici ne prolaze kroz našu stranicu.
            </p>

            <h2>Imate promo kodove?</h2>
            <p>
                Da — promo kod se upisuje na stranici plaćanja („Add promotion
                code“).
            </p>

            <h2>Kako funkcioniraju povrati?</h2>
            <p>
                Detalji su u <Link href="/refund">Politici povrata</Link>. Za
                problem s preuzimanjem ili naplatom javite se na{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Mogu li naručiti custom pitanja?</h2>
            <p>
                Da — putem stranice{" "}
                <Link href="/custom-questions">Custom Questions</Link>. Nakon
                zahtjeva javit ćemo se s detaljima.
            </p>

            <h2>Kako vas kontaktiram?</h2>
            <p>
                Email:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                , ili putem stranice <Link href="/contact">Contact</Link>.
            </p>
        </LegalPage>
    );
}
