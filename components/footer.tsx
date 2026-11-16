import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { legalBusiness, legalLinks } from "@/data/legal";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-10 text-center text-sm text-[var(--muted)]">
      <div className="container-shell flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-lg font-black tracking-tight text-white">
            Get the newsletter
          </div>
          <p className="text-sm">New packs, offers and quiz-night tips. No spam.</p>
          <NewsletterForm />
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          <Link href="/news" prefetch={false} className="font-medium text-white/70 hover:text-white">
            News
          </Link>
          <Link href="/custom-questions" prefetch={false} className="font-medium text-white/70 hover:text-white">
            Custom Questions
          </Link>
          <Link href="/contact" prefetch={false} className="font-medium text-white/70 hover:text-white">
            Contact
          </Link>
        </nav>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="font-medium text-white/60 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 text-xs">
          <p>
            © 2026 <span className="font-bold text-[var(--gold)]">PubQuizForge</span> · All question packs are original content
          </p>
          <p>
            {legalBusiness.tradeName} · {legalBusiness.address}, {legalBusiness.city} · OIB {legalBusiness.oib} · {legalBusiness.vatNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
