import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-8 text-center text-sm text-[var(--muted)]">
      <div className="container-shell flex flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-6">
          <Link href="/news" className="font-medium text-white/70 hover:text-white">
            News
          </Link>
          <Link href="/custom-questions" className="font-medium text-white/70 hover:text-white">
            Custom Questions
          </Link>
          <Link href="/contact" className="font-medium text-white/70 hover:text-white">
            Contact
          </Link>
        </nav>

        <p>
          © 2026 <span className="font-bold text-[var(--gold)]">PubQuizForge</span> ·
          All question packs are original content · Built for quiz masters everywhere
        </p>
      </div>
    </footer>
  );
}