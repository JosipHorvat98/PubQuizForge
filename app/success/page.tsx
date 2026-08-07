// file: app/success/page.tsx
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SuccessClient } from "./success-client";

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <Header />

            <Suspense
                fallback={
                    <section className="section-space">
                        <div className="container-shell text-center">
                            <p className="text-[var(--muted)]">Loading...</p>
                        </div>
                    </section>
                }
            >
                <SuccessClient />
            </Suspense>

            <Footer />
        </main>
    );
}
