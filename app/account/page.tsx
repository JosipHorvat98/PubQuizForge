// file: app/account/page.tsx
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/logout/actions";

export default async function AccountPage() {
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
                <div className="container-shell max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                        Account
                    </div>

                    <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                        Your account.
                    </h1>

                    <div className="mt-10 rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
                        <div className="grid gap-3">
                            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                                Signed in as
                            </p>
                            <p className="text-2xl font-bold">{user.email}</p>
                            <p className="text-sm text-[var(--muted)]">
                                User ID: {user.id}
                            </p>
                        </div>

                        <form action={logout} className="mt-8">
                            <button
                                type="submit"
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}