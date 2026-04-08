export type PackCategory =
  | "all"
  | "tv"
  | "music"
  | "geo"
  | "history"
  | "sport"
  | "science";

export type Pack = {
  id: string;
  category: Exclude<PackCategory, "all">;
  categoryLabel: string;
  title: string;
  emoji: string;
  price: string;
  glow: string;
  badges: string[];
};

export type Plan = {
  id: string;
  name: "Bronze" | "Silver" | "Gold";
  icon: string;
  price: string;
  description: string;
  featured?: boolean;
  features: Array<{
    label: string;
    included: boolean;
    strong?: boolean;
  }>;
};

export const navLinks = [
  { label: "Shop", href: "#packs" },
  { label: "Memberships", href: "#memberships" },
  { label: "My Downloads", href: "#downloads" },
  { label: "About", href: "#about" }
];

export const stats = [
  { value: "2,400+", label: "Questions available" },
  { value: "48", label: "Category packs" },
  { value: "3,100+", label: "Happy quiz masters" }
];

export const packCategories: Array<{ id: PackCategory; label: string }> = [
  { id: "all", label: "All Packs" },
  { id: "tv", label: "📺 TV & Film" },
  { id: "music", label: "🎵 Music" },
  { id: "geo", label: "🌍 Geography" },
  { id: "history", label: "📜 History" },
  { id: "sport", label: "⚽ Sport" },
  { id: "science", label: "🔬 Science" }
];

export const packs: Pack[] = [
  {
    id: "friends-ultimate-pack",
    category: "tv",
    categoryLabel: "TV & Film",
    title: "F.R.I.E.N.D.S — Ultimate Pack",
    emoji: "📺",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #7c3aed, transparent 70%)",
    badges: ["50 questions", "🔥 Bestseller"]
  },
  {
    id: "marvel-cinematic-universe",
    category: "tv",
    categoryLabel: "TV & Film",
    title: "Marvel Cinematic Universe",
    emoji: "🕷️",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #dc2626, transparent 70%)",
    badges: ["50 questions", "🔥 Bestseller"]
  },
  {
    id: "breaking-bad-better-call-saul",
    category: "tv",
    categoryLabel: "TV & Film",
    title: "Breaking Bad & Better Call Saul",
    emoji: "⚗️",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #0ea5e9, transparent 70%)",
    badges: ["50 questions", "✦ New"]
  },
  {
    id: "game-of-thrones",
    category: "tv",
    categoryLabel: "TV & Film",
    title: "Game of Thrones",
    emoji: "🏰",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #facc15, transparent 70%)",
    badges: ["50 questions"]
  },
  {
    id: "nineties-pop-rock",
    category: "music",
    categoryLabel: "Music",
    title: "90s Pop & Rock Anthems",
    emoji: "🎸",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #ec4899, transparent 70%)",
    badges: ["50 questions", "🔥 Popular"]
  },
  {
    id: "one-hit-wonders",
    category: "music",
    categoryLabel: "Music",
    title: "One Hit Wonders — Guess the Year",
    emoji: "🎤",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #a855f7, transparent 70%)",
    badges: ["50 questions", "✦ New"]
  },
  {
    id: "world-capitals-master-edition",
    category: "geo",
    categoryLabel: "Geography",
    title: "World Capitals — Master Edition",
    emoji: "🌍",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #22c55e, transparent 70%)",
    badges: ["50 questions"]
  },
  {
    id: "flags-of-the-world",
    category: "geo",
    categoryLabel: "Geography",
    title: "Flags of the World",
    emoji: "🚩",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #14b8a6, transparent 70%)",
    badges: ["50 questions", "🔥 Bestseller"]
  },
  {
    id: "world-war-ii-full-story",
    category: "history",
    categoryLabel: "History",
    title: "World War II — The Full Story",
    emoji: "📜",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #f97316, transparent 70%)",
    badges: ["50 questions", "🔥 Popular"]
  },
  {
    id: "ancient-civilisations",
    category: "history",
    categoryLabel: "History",
    title: "Ancient Civilisations",
    emoji: "🏺",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #b45309, transparent 70%)",
    badges: ["50 questions", "✦ New"]
  },
  {
    id: "football-world-cup-edition",
    category: "sport",
    categoryLabel: "Sport",
    title: "Football — World Cup Edition",
    emoji: "⚽",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #16a34a, transparent 70%)",
    badges: ["50 questions", "🔥 Bestseller"]
  },
  {
    id: "space-and-the-universe",
    category: "science",
    categoryLabel: "Science",
    title: "Space & The Universe",
    emoji: "🔭",
    price: "€4.99",
    glow: "radial-gradient(circle at 50% 0%, #3b82f6, transparent 70%)",
    badges: ["50 questions", "✦ New"]
  }
];

export const plans: Plan[] = [
  {
    id: "bronze",
    name: "Bronze",
    icon: "🥉",
    price: "€5.99",
    description:
      "Perfect for casual hosts who need a few great packs per month.",
    features: [
      { label: "3 pack downloads per month", included: true, strong: true },
      { label: "Access to Bronze-only category packs", included: true },
      { label: "PDF download immediately on purchase", included: true },
      { label: "10% off individual pack purchases", included: true },
      { label: "Weekly new pack drops", included: false },
      { label: "Custom round builder", included: false },
      { label: "Full archive access (48 packs)", included: false }
    ]
  },
  {
    id: "silver",
    name: "Silver",
    icon: "🥈",
    price: "€9.99",
    description:
      "For regular quiz hosts who want fresh content every single week.",
    features: [
      { label: "Unlimited downloads from current packs", included: true, strong: true },
      { label: "Access to Silver + Bronze category packs", included: true },
      { label: "Early access to new weekly pack drops", included: true },
      { label: "20% off individual pack purchases", included: true },
      { label: "Themed mega-packs (100 questions)", included: true },
      { label: "Custom round builder", included: false },
      { label: "Full archive access (48 packs)", included: false }
    ]
  },
  {
    id: "gold",
    name: "Gold",
    icon: "🥇",
    price: "€14.99",
    description:
      "The full experience — unlimited access, tools, and priority new releases.",
    featured: true,
    features: [
      { label: "Unlimited access to all 48+ packs", included: true, strong: true },
      { label: "Full archive — every pack ever released", included: true },
      { label: "Priority access to new drops before anyone else", included: true },
      { label: "Custom round builder — mix questions from any pack", included: true },
      { label: "Request a custom topic pack (1/month)", included: true },
      { label: "Printable scoresheets & host guides included", included: true },
      { label: "Private Discord community for quiz masters", included: true }
    ]
  }
];
