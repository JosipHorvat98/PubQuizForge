// file: app/impressum/page.tsx
import { LegalPage } from "@/components/legal-page";
import { legalBusiness } from "@/data/legal";

export default function ImpressumPage() {
    return (
        <LegalPage
            title="Podaci o trgovcu"
            subtitle="Informacije o pružatelju usluga."
        >
            <h2>Pružatelj usluga</h2>
            <ul>
                <li>Naziv: {legalBusiness.tradeName}</li>
                <li>Brend: {legalBusiness.brand}</li>
                <li>Vlasnik: {legalBusiness.owner}</li>
                <li>
                    Adresa: {legalBusiness.address}, {legalBusiness.city},{" "}
                    {legalBusiness.country}
                </li>
                <li>OIB: {legalBusiness.oib}</li>
                <li>
                    Email:{" "}
                    <a href={`mailto:${legalBusiness.email}`}>
                        {legalBusiness.email}
                    </a>
                </li>
                <li>
                    Web:{" "}
                    <a href={legalBusiness.website}>
                        {legalBusiness.website}
                    </a>
                </li>
                <li>PDV status: {legalBusiness.vatNote}</li>
            </ul>

            <h2>Djelatnost</h2>
            <p>
                {legalBusiness.brand} je brend obrta {legalBusiness.tradeName}.
                Prodaja digitalnih sadržaja (quiz paketa u PDF formatu) i
                članstava (pretplata) putem interneta.
            </p>

            <h2>Odgovornost za sadržaj</h2>
            <p>
                Sadržaj je pripremljen s pažnjom, ali ne jamčimo potpunu
                točnost svih pitanja i odgovora. Za pitanja i ispravke
                kontaktirajte nas na navedeni email.
            </p>

            <h2>Autorska prava</h2>
            <p>
                Svi quiz paketi i sadržaj su autorsko djelo i zaštićeni su.
                Zabranjeno je neovlašteno kopiranje, preprodaja ili
                distribucija.
            </p>

            <h2>Online rješavanje sporova</h2>
            <p>
                Potrošači mogu koristiti platformu za online rješavanje sporova
                Europske komisije. Također se mogu obratiti nadležnom tijelu u
                Republici Hrvatskoj.
            </p>
        </LegalPage>
    );
}
