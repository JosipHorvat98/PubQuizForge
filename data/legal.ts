// file: data/legal.ts

/**
 * Central business details used across all legal pages.
 * Replace the bracketed placeholders with your real obrt details.
 */
export const legalBusiness = {
    tradeName: "[Naziv obrta]",
    owner: "[Ime i prezime vlasnika]",
    address: "[Ulica i broj]",
    city: "[Poštanski broj i grad]",
    country: "Hrvatska",
    oib: "[OIB]",
    email: "jojohorvat@gmail.com",
    website: "https://pubquizforge.com",
    vatNote: "Nije u sustavu PDV-a.",
    lastUpdated: "12. studenoga 2026."
};

export const legalLinks = [
    { href: "/legal", label: "Pravne informacije" },
    { href: "/terms", label: "Uvjeti korištenja" },
    { href: "/privacy", label: "Pravila privatnosti" },
    { href: "/refund", label: "Povrati" },
    { href: "/cookies", label: "Kolačići" },
    { href: "/faq", label: "FAQ" },
    { href: "/impressum", label: "Podaci o trgovcu" }
];
