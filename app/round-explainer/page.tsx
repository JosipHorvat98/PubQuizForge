// file: app/round-explainer/page.tsx
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export default function RoundExplainerPage() {
    return (
        <LegalPage
            kicker="Guide"
            title="Round Explainer"
            subtitle="How our quiz packs are structured and how to host a great night."
        >
            <h2>What is a round?</h2>
            <p>
                A quiz night is usually split into rounds — small blocks of
                questions on a theme. Teams answer a round, then you read the
                answers before moving on.
            </p>

            <h2>How the packs are structured</h2>
            <p>
                Most packs contain 50 questions, grouped into rounds so you can
                host a full night without extra prep. Each pack includes the
                answer key, and many include printable answer sheets.
            </p>

            <h2>Hosting tips</h2>
            <ul>
                <li>Print the pack and answer sheets before the event.</li>
                <li>Mix easy and harder rounds to keep everyone engaged.</li>
                <li>Read each question twice and keep a steady pace.</li>
                <li>Reveal answers round by round to keep the energy up.</li>
            </ul>

            <h2>Choosing packs</h2>
            <p>
                Browse the <Link href="/#packs">shop</Link> and filter by category,
                tier and availability. You can also see the{" "}
                <Link href="/faq">FAQ</Link> for quick answers.
            </p>

            <h2>Custom rounds</h2>
            <p>
                Need a tailored theme? Use the{" "}
                <Link href="/custom-questions">Custom Questions</Link> page and
                tell us what you need.
            </p>
        </LegalPage>
    );
}
