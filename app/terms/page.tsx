// file: app/terms/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function TermsPage() {
    return (
        <LegalPage
            title="Uvjeti korištenja"
            subtitle="Pravila kupnje i korištenja digitalnih quiz paketa i članstava."
        >
            <h2>Pružatelj usluga</h2>
            <p>
                Usluge pruža {legalBusiness.tradeName} ({legalBusiness.brand}),{" "}
                {legalBusiness.address}, {legalBusiness.city}, OIB{" "}
                {legalBusiness.oib}. Kontakt:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Predmet</h2>
            <p>
                Prodajemo digitalne quiz pakete (PDF) i članstva (pretplate) za
                osobnu upotrebu pri organizaciji quiz večeri.
            </p>

            <h2>Račun</h2>
            <ul>
                <li>
                    Za kupnju i članstvo potreban je račun s točnim podacima.
                </li>
                <li>
                    Odgovorni ste za čuvanje lozinke i aktivnosti na računu.
                </li>
                <li>
                    Kršenje ovih uvjeta može dovesti do suspenzije računa.
                </li>
            </ul>

            <h2>Kupnja i cijene</h2>
            <ul>
                <li>Cijene su izražene u eurima (EUR).</li>
                <li>
                    Cijene su konačne. {legalBusiness.vatNote}
                </li>
                <li>
                    Plaćanje se obrađuje putem <strong>Stripea</strong>.
                    Promo kodovi se primjenjuju na stranici plaćanja.
                </li>
            </ul>

            <h2>Dostava digitalnog sadržaja</h2>
            <p>
                Nakon uspješnog plaćanja paket je dostupan za preuzimanje na
                stranici „My Downloads“ i/ili putem emaila. Sadržaj je digitalan
                — nema fizičke dostave.
            </p>

            <h2>Licenca</h2>
            <p>
                Kupnjom stječete osobnu, neprenosivu licencu za korištenje
                paketa na vlastitim quiz događajima. Zabranjeno je preprodavati,
                dijeliti ili javno objavljivati pakete.
            </p>

            <h2>Članstva i krediti</h2>
            <ul>
                <li>Svaki plan daje mjesečne kredite za preuzimanje paketa.</li>
                <li>
                    Neiskorišteni krediti prenose se u sljedeći mjesec do
                    najviše dopuštenog limita (rollover cap).
                </li>
                <li>
                    Krediti ostaju važi i nakon otkazivanja pretplate te se mogu
                    iskoristiti do potroška.
                </li>
                <li>
                    Pristup paketima prema tier-u (bronze/silver/gold) vrijedi
                    dok traje pretplata ili dok imate kredite.
                </li>
            </ul>

            <h2>Pravo na odustajanje</h2>
            <p>
                Za digitalni sadržaj koji se preuzima odmah, potrošač gubi pravo
                na jednostrano odustajanje nakon što je preuzimanje započelo uz
                izričitu privolu. Detalji su u{" "}
                <Link href="/refund">Politici povrata</Link>.
            </p>

            <h2>Odgovornost</h2>
            <p>
                Sadržaj pružamo „takav kakav jest“. Ne jamčimo da će pitanja
                odgovarati svakom događaju ni potpunu točnost svih odgovora.
                Odgovornost je ograničena na iznos plaćen za konkretan paket ili
                članstvo, u granicama dopuštenim zakonom.
            </p>

            <h2>Intelektualno vlasništvo</h2>
            <p>
                Svi paketi i sadržaj zaštićeni su autorskim pravom. Zabranjeno je
                neovlašteno kopiranje i distribucija.
            </p>

            <h2>Izmjene uvjeta</h2>
            <p>
                Uvjete možemo povremeno ažurirati. Važne izmjene objavit ćemo na
                ovoj stranici s datumom ažuriranja.
            </p>

            <h2>Mjerodavno pravo</h2>
            <p>
                Primjenjuje se pravo Republike Hrvatske. Za sporove je nadležan
                stvarno nadležni sud u Republici Hrvatskoj, osim ako zakon
                propisuje drugačije za potrošače.
            </p>
        </LegalPage>
    );
}
