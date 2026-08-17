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
    /** Pack credits granted each billing month. */
    monthlyCredits: number;
    /** Max unused credits carried into the next billing month. */
    maxRollover: number;
    /** Percentage discount on a-la-carte pack purchases. */
    extraPackDiscount: number;
    features: Array<{
        label: string;
        included: boolean;
        strong?: boolean;
    }>;
};

export const navLinks = [
    { label: "Shop", href: "/#packs" },
    { label: "Memberships", href: "/memberships" },
    { label: "Custom Questions", href: "/custom-questions" },
    { label: "News", href: "/news" },
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
    { id: "history", label: "📖 History" },
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
        pdfPath: "/packs/general-knowledge-vol-1.pdf"
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
        pdfPath: "/packs/general-knowledge-vol-2.pdf"
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
        pdfPath: "/packs/friends-ultimate-pack.pdf"
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
        pdfPath: "/packs/movie-mix-80s-90s.pdf"
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
        pdfPath: "/packs/world-capitals-master-edition.pdf"
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
        pdfPath: "/packs/flags-of-the-world.pdf"
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
        emoji: "📖",
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
        emoji: "🚀",
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
        price: "€8.90",
        description:
            "For casual hosts who run the occasional quiz. One free pack every month," +
            " a small discount, and bonus questions cover you without a big commitment.",
        monthlyCredits: 1,
        maxRollover: 2,
        extraPackDiscount: 10,
        features: [
            { label: "1 pack credit every month", included: true, strong: true },
            { label: "Roll over up to 2 unused credits", included: true },
            { label: "10% off extra pack purchases", included: true },
            { label: "Bonus questions every month", included: true },
            { label: "Member newsletter", included: true },
            { label: "Instant PDF downloads", included: true },
            { label: "Cancel anytime", included: true }
        ]
    },
    {
        id: "silver",
        name: "Silver",
        icon: "🥈",
        price: "€19.90",
        description:
            "Our most popular plan for regular quiz hosts. Three pack credits a month," +
            " early access and premium extras make it the best value per pack.",
        featured: true,
        monthlyCredits: 3,
        maxRollover: 6,
        extraPackDiscount: 20,
        features: [
            { label: "3 pack credits every month", included: true, strong: true },
            { label: "Roll over up to 6 unused credits", included: true },
            { label: "Early access to new packs", included: true },
            { label: "20% off extra pack purchases", included: true },
            { label: "Premium newsletter + bonus rounds", included: true },
            { label: "Seasonal mini-packs", included: true },
            { label: "Priority email support", included: true }
        ]
    },
    {
        id: "gold",
        name: "Gold",
        icon: "🥇",
        price: "€34.90",
        description:
            "For professional hosts and agencies. Five credits monthly, the deepest" +
            " discounts, and exclusive content for high-volume quiz nights.",
        monthlyCredits: 5,
        maxRollover: 12,
        extraPackDiscount: 30,
        features: [
            { label: "5 pack credits every month", included: true, strong: true },
            { label: "Roll over up to 12 unused credits", included: true },
            { label: "30% off all existing packs", included: true },
            { label: "Exclusive Gold packs", included: true },
            { label: "Premium newsletter + bonus rounds", included: true },
            { label: "Early access + priority support", included: true },
            { label: "Vote / request future quiz themes", included: true }
        ]
    }
];
