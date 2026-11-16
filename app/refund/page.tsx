// file: app/refund/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function RefundPage() {
    return (
        <LegalPage
            title="Politika povrata"
            subtitle="Povrati, odustajanje i reklamacije za digitalne proizvode."
        >
            <h2>Digitalni proizvodi</h2>
            <p>
                Svi proizvodi su digitalni (PDF) i dostupni su odmah nakon
                plaćanja. Nema fizičke dostave.
            </p>

            <h2>Pravo na odustajanje</h2>
            <p>
                Prema EU pravilima potrošač ima 14 dana na odustajanje, osim za
                digitalni sadržaj koji se preuzima odmah. Kupnjom i početkom
                preuzimanja dajete izričitu privolu i potvrđujete da gubite
                pravo na jednostrano odustajanje.
            </p>

            <h2>Kada odobravamo povrat</h2>
            <ul>
                <li>PDF se ne može preuzeti ili je datoteka neispravna.</li>
                <li>Dupla naplata ili tehnička greška pri plaćanju.</li>
                <li>Paket značajno odstupa od opisa.</li>
            </ul>

            <h2>Članstva</h2>
            <ul>
                <li>
                    Pretplatu možete otkazati u svakom trenutku (u računu ili
                    kontaktom).
                </li>
                <li>
                    Pristup ostaje do kraja plaćenog perioda; nakon toga se ne
                    obnavlja.
                </li>
                <li>
                    Neiskorišteni krediti ostaju i mogu se koristiti do
                    potroška.
                </li>
                <li>
                    Za započeti period naplate u pravilu nema povrata, osim
                    zakonskih prava.
                </li>
            </ul>

            <h2>Kako zatražiti povrat</h2>
            <p>
                Pošaljite email na{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>{" "}
                s: email računa, datum kupnje, naziv paketa i razlog. Odgovaramo u
                razumnom roku (najčešće 2–5 radnih dana).
            </p>

            <h2>Način povrata</h2>
            <p>
                Povrat se vrši na isti način plaćanja (kartica) preko Stripea.
                Vrijeme knjiženja ovisi o banci.
            </p>

            <h2>Kontakt</h2>
            <p>
                Za sva pitanja:{" "}
                <a href={`mailto:${legalBusiness.email}`}>
                    {legalBusiness.email}
                </a>
                . Također pogledajte{" "}
                <Link href="/terms">Uvjete korištenja</Link>.
            </p>
        </LegalPage>
    );
}
