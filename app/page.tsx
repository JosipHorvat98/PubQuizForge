import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MembershipSection } from "@/components/membership-section";
import { PacksSection } from "@/components/packs-section";
import { getPacksMerged } from "@/lib/packs-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const packs = await getPacksMerged();

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <Hero />
      <PacksSection packs={packs} />
      <MembershipSection />
      <CTASection />
      <Footer />
    </main>
  );
}