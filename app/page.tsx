import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MembershipSection } from "@/components/membership-section";
import { PacksSection } from "@/components/packs-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <Hero />
      <PacksSection />
      <MembershipSection />
      <CTASection />
      <Footer />
    </main>
  );
}