// file: app/account/settings/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AccountSettingsClient } from "@/components/account-settings-client";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/account/settings");
    }

    const nickname = String(user.user_metadata?.nickname ?? "").trim();

    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <section className="section-space">
                <div className="container-shell max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Settings
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Your settings.
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
                        Change how you appear and update your password.
                        <Link
                            href="/account"
                            className="ml-2 text-[var(--gold)] hover:underline"
                        >
                            ← Back to account
                        </Link>
                    </p>

                    <AccountSettingsClient
                        email={user.email ?? ""}
                        initialNickname={nickname}
                    />
                </div>
            </section>

            <Footer />
        </main>
    );
}
