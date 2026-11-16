// file: app/privacy/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Pravila privatnosti"
            subtitle="Kako prikupljamo, koristimo i štitimo vaše osobne podatke."
        >
            <h2>Voditelj obrade</h2>
            <p>
                Voditelj obrade je {legalBusiness.tradeName},{" "}
                {legalBusiness.address}, {legalBusiness.city}, OIB{" "}
                {legalBusiness.oib} (brend {legalBusiness.brand}). Kontakt:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                .
            </p>

            <h2>Koje podatke prikupljamo</h2>
            <ul>
                <li>
                    <strong>Račun:</strong> email, nickname, hash lozinke i
                    datum registracije.
                </li>
                <li>
                    <strong>Kupnje i preuzimanja:</strong> email, kupljeni ili
                    preuzeti paketi, iznos i status narudžbe.
                </li>
                <li>
                    <strong>Članstvo:</strong> plan, status pretplate, broj
                    kredita i datumi obnove.
                </li>
                <li>
                    <strong>Newsletter:</strong> email i status pretplate.
                </li>
                <li>
                    <strong>Custom pitanja i kontakt:</strong> ime, email, tema,
                    broj pitanja i poruka.
                </li>
                <li>
                    <strong>Tehnički podaci:</strong> IP adresa i podaci o
                    pregledniku u poslužiteljskim zapisima (sigurnost).
                </li>
            </ul>

            <h2>Pravne osnove i svrhe</h2>
            <ul>
                <li>
                    <strong>Izvršenje ugovora</strong> — pružanje kupljenih
                    paketa, članstva i podrške.
                </li>
                <li>
                    <strong>Legitimni interes</strong> — sigurnost i
                    sprječavanje prijevara i zloupotreba.
                </li>
                <li>
                    <strong>Privola</strong> — newsletter i marketinške poruke
                    (možete je povući u svakom trenutku).
                </li>
                <li>
                    <strong>Pravna obveza</strong> — računovodstvo i porezni
                    propisi.
                </li>
            </ul>

            <h2>Plaćanje</h2>
            <p>
                Plaćanja obrađuje <strong>Stripe</strong>. Podatke o kartici ne
                pohranjujemo — njima upravlja Stripe u skladu sa svojim
                pravilima privatnosti.
            </p>

            <h2>Primatelji i obrađivači</h2>
            <ul>
                <li>
                    <strong>Supabase</strong> — baza podataka i autentikacija.
                </li>
                <li>
                    <strong>Vercel</strong> — hosting aplikacije i analitika bez
                    kolačića.
                </li>
                <li>
                    <strong>Stripe</strong> — obrada plaćanja.
                </li>
                <li>
                    <strong>Resend</strong> — slanje transakcijskih emailova.
                </li>
            </ul>
            <p>
                Ovi pružatelji mogu obrađivati podatke izvan EU/EEA uz
                odgovarajuće zaštitne mjere (npr. standardne ugovorne
                klauzule).
            </p>

            <h2>Rokovi čuvanja</h2>
            <ul>
                <li>
                    Podaci računa — dok je račun aktivan, a nakon brisanja do
                    prestanka zakonskih obveza.
                </li>
                <li>
                    Računovodstveni podaci — u skladu s hrvatskim propisima
                    (npr. 11 godina).
                </li>
                <li>Newsletter — do odjave.</li>
            </ul>

            <h2>Vaša prava</h2>
            <p>
                Imate pravo na pristup, ispravak, brisanje, ograničenje obrade,
                prenosivost, prigovor te povlačenje privole. Zahtjev pošaljite
                na{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                . Imate i pravo pritužbe Agenciji za zaštitu osobnih podataka
                (AZOP).
            </p>

            <h2>Kolačići</h2>
            <p>
                Detalje potražite u <Link href="/cookies">Politici kolačića</Link>.
            </p>

            <h2>Sigurnost</h2>
            <p>
                Primjenjujemo razumne tehničke i organizacijske mjere zaštite
                podataka.
            </p>
        </LegalPage>
    );
}
