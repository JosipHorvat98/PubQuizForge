// file: app/contact/page.tsx
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />

      <section className="section-space">
        <div className="container-shell">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(245,200,66,0.3)] bg-[var(--gold-dim)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            Contact
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Let’s talk about your next quiz night.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            Use this page for support, custom pack requests, partnership enquiries,
            or questions about memberships and downloads.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
            <h2 className="text-2xl font-black tracking-tight">Get in touch</h2>

            <div className="mt-6 space-y-5 text-[var(--muted)]">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Email
                </div>
                <p className="mt-2 text-base text-white">hello@pubquizforge.com</p>
              </div>

              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Support
                </div>
                <p className="mt-2 leading-7">
                  Questions about packs, memberships, billing, or downloads.
                </p>
              </div>

              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Custom packs
                </div>
                <p className="mt-2 leading-7">
                  Need a themed quiz for a pub event, fundraiser, company night, or private party?
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/8 bg-[var(--surface)] p-8">
            <h2 className="text-2xl font-black tracking-tight">Send a message</h2>

            <form className="mt-6 grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-white">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help with?"
                  className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Write your message..."
                  className="rounded-xl border border-white/10 bg-[var(--surface-2)] px-4 py-3 text-white outline-none placeholder:text-[var(--muted)] focus:border-[var(--gold)]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-black hover:bg-[var(--gold-strong)]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}