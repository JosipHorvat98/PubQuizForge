// file: app/downloads/page.tsx
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { DownloadsClient } from "./downloads-client";

export default async function DownloadsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />

      <section className="section-space">
        <div className="container-shell">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            My Downloads
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Your quiz pack library.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            All purchases linked to your account.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell rounded-[28px] border border-white/8 bg-[var(--surface)] p-6 md:p-8">
          <DownloadsClient />
        </div>
      </section>

      <Footer />
    </main>
  );
}