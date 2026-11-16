// file: app/cookies/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export default function CookiesPage() {
    return (
        <LegalPage
            title="Cookie Policy"
            subtitle="Which cookies we use and why."
        >
            <p>
                Cookies are small files stored in your browser. We use them to
                operate login and security, and for payments.
            </p>

            <h2>Essential cookies</h2>
            <ul>
                <li>
                    <strong>Supabase (login)</strong> — session cookies (e.g.
                    sb-…-auth-token) enable sign-in and account access. Without
                    them you cannot sign in.
                </li>
            </ul>

            <h2>Payments</h2>
            <ul>
                <li>
                    <strong>Stripe</strong> — during checkout, Stripe cookies are
                    used on the payment page for security and fraud prevention.
                </li>
            </ul>

            <h2>Analytics</h2>
            <ul>
                <li>
                    <strong>Vercel Web Analytics</strong> — we use cookieless
                    analytics that collects aggregated visit data.
                </li>
            </ul>

            <h2>Marketing cookies</h2>
            <p>
                We currently do <strong>not</strong> use marketing or profiling
                cookies.
            </p>

            <h2>Managing cookies</h2>
            <p>
                You can delete or block cookies in your browser settings.
                Blocking essential cookies may prevent sign-in and checkout.
            </p>

            <p>
                For more on personal data:{" "}
                <Link href="/privacy">Privacy Policy</Link>.
            </p>
        </LegalPage>
    );
}
