import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pubquizforge.com"),
  title: "PubQuizForge — Quiz Packs & Memberships",
  description:
    "Ready-to-host pub quiz bundles, themed packs, and membership tiers for quiz masters.",
  openGraph: {
    title: "PubQuizForge",
    description:
      "Ready-to-host pub quiz bundles, themed packs, and membership tiers for quiz masters.",
    url: "https://pubquizforge.com",
    siteName: "PubQuizForge",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PubQuizForge",
    description:
      "Ready-to-host pub quiz bundles, themed packs, and membership tiers for quiz masters."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  );
}
