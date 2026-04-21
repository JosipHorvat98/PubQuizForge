// file: data/site.ts
export type PackCategory =
    | "all"
    | "general"
    | "tv"
    | "music"
    | "geo"
    | "history"
    | "sport"
    | "science"
    | "themed";

export type Pack = {
    id: string;
    category: Exclude<PackCategory, "all">;
    categoryLabel: string;
    title: string;
    emoji: string;
    price: string;
    glow: string;
    badges: string[];
    pdfPath?: string | null;
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
    { label: "Shop", href: "/#packs" },
    { label: "Memberships", href: "/memberships" },
    { label: "My Downloads", href: "/downloads" },
    { label: "About", href: "/about" }
];

export const stats = [
    { value: "2,400+", label: "Questions available" },
    { value: "48+", label: "Quiz packs" },
    { value: "300+", label: "Quiz nights powered" }
];

export const packCategories: Array<{ id: PackCategory; label: string }> = [
    { id: "all", label: "All Packs" },
    { id: "general", label: "🧠 General Knowledge" },
    { id: "tv", label: "📺 TV & Film" },
    { id: "music", label: "🎵 Music" },
    { id: "geo", label: "🌍 Geography" },
    { id: "history", label: "📜 History" },
    { id: "sport", label: "⚽ Sport" },
    { id: "science", label: "🔬 Science" },
    { id: "themed", label: "🎉 Themed Nights" }
];

export const packs: Pack[] = [
    {
        id: "general-knowledge-vol-1",
        category: "general",
        categoryLabel: "General Knowledge",
        title: "General Knowledge Vol. 1",
        emoji: "🧠",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)",
        badges: ["50 questions", "🔥 Bestseller"],
        pdfPath: null
    },
    {
        id: "general-knowledge-vol-2",
        category: "general",
        categoryLabel: "General Knowledge",
        title: "General Knowledge Vol. 2",
        emoji: "🎯",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f97316, transparent 70%)",
        badges: ["50 questions", "✦ New"],
        pdfPath: null
    },
    {
        id: "friends-ultimate-pack",
        category: "tv",
        categoryLabel: "TV & Film",
        title: "F.R.I.E.N.D.S — Ultimate Pack",
        emoji: "📺",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #7c3aed, transparent 70%)",
        badges: ["50 questions", "🔥 Bestseller"],
        pdfPath: null
    },
    {
        id: "movie-mix-80s-90s",
        category: "tv",
        categoryLabel: "TV & Film",
        title: "80s & 90s Movie Mix",
        emoji: "🎬",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #dc2626, transparent 70%)",
        badges: ["50 questions"],
        pdfPath: null
    },
    {
        id: "music-through-the-decades",
        category: "music",
        categoryLabel: "Music",
        title: "Music Through the Decades",
        emoji: "🎵",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #ec4899, transparent 70%)",
        badges: ["50 questions", "🔥 Popular"],
        pdfPath: null
    },
    {
        id: "one-hit-wonders",
        category: "music",
        categoryLabel: "Music",
        title: "One Hit Wonders",
        emoji: "🎤",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #a855f7, transparent 70%)",
        badges: ["50 questions", "✦ New"],
        pdfPath: null
    },
    {
        id: "world-capitals-master-edition",
        category: "geo",
        categoryLabel: "Geography",
        title: "World Capitals — Master Edition",
        emoji: "🌍",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #22c55e, transparent 70%)",
        badges: ["50 questions"],
        pdfPath: null
    },
    {
        id: "flags-of-the-world",
        category: "geo",
        categoryLabel: "Geography",
        title: "Flags of the World",
        emoji: "🚩",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #14b8a6, transparent 70%)",
        badges: ["50 questions", "🔥 Bestseller"],
        pdfPath: null
    },
    {
        id: "ancient-civilisations",
        category: "history",
        categoryLabel: "History",
        title: "Ancient Civilisations",
        emoji: "🏺",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #b45309, transparent 70%)",
        badges: ["50 questions"],
        pdfPath: null
    },
    {
        id: "world-war-ii-full-story",
        category: "history",
        categoryLabel: "History",
        title: "World War II — The Full Story",
        emoji: "📜",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f97316, transparent 70%)",
        badges: ["50 questions", "🔥 Popular"],
        pdfPath: null
    },
    {
        id: "football-world-cup-edition",
        category: "sport",
        categoryLabel: "Sport",
        title: "Football — World Cup Edition",
        emoji: "⚽",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #16a34a, transparent 70%)",
        badges: ["50 questions", "🔥 Bestseller"],
        pdfPath: null
    },
    {
        id: "olympics-quiz-pack",
        category: "sport",
        categoryLabel: "Sport",
        title: "Olympics Quiz Pack",
        emoji: "🏅",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #10b981, transparent 70%)",
        badges: ["50 questions"],
        pdfPath: null
    },
    {
        id: "space-and-the-universe",
        category: "science",
        categoryLabel: "Science",
        title: "Space & The Universe",
        emoji: "🔭",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #3b82f6, transparent 70%)",
        badges: ["50 questions", "✦ New"],
        pdfPath: null
    },
    {
        id: "human-body-basics",
        category: "science",
        categoryLabel: "Science",
        title: "Human Body Basics",
        emoji: "🧬",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #2563eb, transparent 70%)",
        badges: ["50 questions"],
        pdfPath: null
    },
    {
        id: "christmas-quiz-night",
        category: "themed",
        categoryLabel: "Themed Nights",
        title: "Christmas Quiz Night",
        emoji: "🎄",
        price: "€5.99",
        glow: "radial-gradient(circle at 50% 0%, #ef4444, transparent 70%)",
        badges: ["50 questions", "🔥 Seasonal"],
        pdfPath: null
    },
    {
        id: "halloween-special",
        category: "themed",
        categoryLabel: "Themed Nights",
        title: "Halloween Special",
        emoji: "🎃",
        price: "€5.99",
        glow: "radial-gradient(circle at 50% 0%, #f97316, transparent 70%)",
        badges: ["50 questions", "✦ Special"],
        pdfPath: null
    }
];

export const plans: Plan[] = [
    {
        id: "bronze",
        name: "Bronze",
        icon: "🥉",
        price: "€5.99",
        description:
            "Ideal for casual hosts who want ready-made quiz content each month without overpaying.",
        features: [
            { label: "3 pack downloads per month", included: true, strong: true },
            { label: "Access to Bronze-only packs", included: true },
            { label: "Instant PDF downloads", included: true },
            { label: "10% off extra pack purchases", included: true },
            { label: "Weekly new pack drops", included: false },
            { label: "Custom round builder", included: false },
            { label: "Full archive access", included: false }
        ]
    },
    {
        id: "silver",
        name: "Silver",
        icon: "🥈",
        price: "€9.99",
        description:
            "Best for regular quiz hosts who need fresh weekly material and more variety.",
        features: [
            { label: "Unlimited downloads from current packs", included: true, strong: true },
            { label: "Access to Silver + Bronze packs", included: true },
            { label: "Early access to weekly releases", included: true },
            { label: "20% off extra pack purchases", included: true },
            { label: "Themed mega-packs", included: true },
            { label: "Custom round builder", included: false },
            { label: "Full archive access", included: false }
        ]
    },
    {
        id: "gold",
        name: "Gold",
        icon: "🥇",
        price: "€14.99",
        description:
            "For serious quiz masters who want the full library, premium tools, and maximum flexibility.",
        featured: true,
        features: [
            { label: "Unlimited access to all packs", included: true, strong: true },
            { label: "Full archive access", included: true },
            { label: "Priority access to new drops", included: true },
            { label: "Custom round builder", included: true },
            { label: "1 custom topic request per month", included: true },
            { label: "Printable host guides and scoresheets", included: true },
            { label: "Private quiz master community access", included: true }
        ]
    }
];