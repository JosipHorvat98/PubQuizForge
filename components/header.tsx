// file: components/header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/site";
import { createClient } from "@/utils/supabase/client";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";

export function Header() {
  const { user, isAuthReady, isAdmin } = useAuth();
  const [isCartBumping, setIsCartBumping] = useState(false);
  const { count, cartPulseKey, isHydrated } = useCart();

  useEffect(() => {
    if (cartPulseKey === 0) {
      return;
    }

    // Trigger the bump on the next event-loop tick (rather than synchronously)
    // to keep the effect free of direct state mutations.
    const bumpOn = window.setTimeout(() => setIsCartBumping(true), 0);
    const bumpOff = window.setTimeout(() => setIsCartBumping(false), 280);

    return () => {
      window.clearTimeout(bumpOn);
      window.clearTimeout(bumpOff);
    };
  }, [cartPulseKey]);

  async function handleLogout() {
    await createClient().auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/45 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black uppercase tracking-[0.18em]">
          PubQuiz<span className="text-[var(--gold)]">Forge</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={
                index === 0
                  ? "text-sm font-semibold text-white"
                  : "text-sm font-medium text-[var(--muted)] hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            prefetch={false}
            className="text-sm font-medium text-[var(--muted)] hover:text-white"
          >
            Contact
          </Link>

          {isAuthReady ? (
            user ? (
              <>
                <Link
                  href="/downloads"
                  prefetch={false}
                  className="text-sm font-medium text-[var(--muted)] hover:text-white"
                >
                  My Downloads
                </Link>

                <Link
                  href="/account"
                  prefetch={false}
                  className="text-sm font-semibold text-white hover:text-[var(--gold)]"
                >
                  Account
                </Link>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    prefetch={false}
                    className="text-sm font-semibold text-[var(--gold)] hover:text-white"
                  >
                    Admin
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-[var(--muted)] hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className="text-sm font-semibold text-white hover:text-[var(--gold)]"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  prefetch={false}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  Sign Up
                </Link>
              </>
            )
          ) : (
            <span className="text-sm text-[var(--muted)]">Loading...</span>
          )}
        </nav>

        <Link
          href="/cart"
          className={`rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black transition-transform duration-200 hover:bg-[var(--gold-strong)] ${
            isCartBumping ? "scale-110" : "scale-100"
          }`}
        >
          Cart ({isHydrated ? count : 0})
        </Link>
      </div>
    </header>
  );
}