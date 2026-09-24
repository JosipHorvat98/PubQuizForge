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
    | "themed"
    | "pop"
    | "food"
    | "culture";

export type Pack = {
    id: string;
    category: Exclude<PackCategory, "all">;
    categoryLabel: string;
    title: string;
    emoji: string;
    price: string;
    glow: string;
    badges: string[];
    /** Optional themed cover photo (Unsplash). Falls back to the emoji when unset. */
    image?: string | null;
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
    { id: "themed", label: "🎉 Themed Nights" },
    { id: "pop", label: "🎮 Pop Culture" },
    { id: "food", label: "🍕 Food & Drink" },
    { id: "culture", label: "🎨 Arts & Culture" }
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
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1742031893752-87b2539a071b?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1640248471910-4a66d9f8b400?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1609753833670-9c6e07b52084?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/music-through-the-decades.pdf"
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
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/one-hit-wonders.pdf"
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
        image: "https://images.unsplash.com/photo-1579525612525-053cd3e8cbd7?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1633095975779-fd354aa0dc95?auto=format&fit=crop&w=1000&q=80",
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
        image: "https://images.unsplash.com/photo-1580706486641-ebec9f673d36?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/ancient-civilisations.pdf"
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
        image: "https://images.unsplash.com/photo-1494972688394-4cc796f9e4c5?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/world-war-ii-full-story.pdf"
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
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/football-world-cup-edition.pdf"
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
        image: "https://images.unsplash.com/photo-1630484174614-f9176ca48dd5?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/olympics-quiz-pack.pdf"
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
        image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/space-and-the-universe.pdf"
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
        image: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/human-body-basics.pdf"
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
        image: "https://images.unsplash.com/photo-1612979168796-bcae1575b8c5?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/christmas-quiz-night.pdf"
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
        image: "https://images.unsplash.com/photo-1477516561410-f0b5dd8319e4?auto=format&fit=crop&w=1000&q=80",
        pdfPath: "/packs/halloween-special.pdf"
    },
    {
        id: "dinosaurs-prehistoric-earth",
        category: "science",
        categoryLabel: "Science",
        title: "Dinosaurs & Prehistoric Earth",
        emoji: "🦖",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #16a34a, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1661518282703-9ae6ffaf82eb?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "oceans-deep-sea",
        category: "geo",
        categoryLabel: "Geography",
        title: "Oceans & Deep Sea",
        emoji: "🌊",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #0ea5e9, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "animal-kingdom",
        category: "science",
        categoryLabel: "Science",
        title: "Animal Kingdom",
        emoji: "🐾",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #22c55e, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "human-brain-psychology",
        category: "science",
        categoryLabel: "Science",
        title: "Human Brain & Psychology",
        emoji: "🧠",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #8b5cf6, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "medicine-diseases-discoveries",
        category: "science",
        categoryLabel: "Science",
        title: "Medicine, Diseases & Discoveries",
        emoji: "🦠",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #14b8a6, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1602052577122-f73b9710adba?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "science-weird-but-true",
        category: "science",
        categoryLabel: "Science",
        title: "Science: Weird but True",
        emoji: "🔬",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #3b82f6, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1618053448492-2b629c2c912c?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "chemistry-everyday-life",
        category: "science",
        categoryLabel: "Science",
        title: "Chemistry in Everyday Life",
        emoji: "⚗️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #7c3aed, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1761095596584-34731de3e568?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "natural-disasters",
        category: "geo",
        categoryLabel: "Geography",
        title: "Natural Disasters",
        emoji: "🌋",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #ef4444, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1619266465172-02a857c3556d?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "extreme-weather",
        category: "geo",
        categoryLabel: "Geography",
        title: "Extreme Weather",
        emoji: "🌦️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #0ea5e9, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1429552077091-836152271555?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "geography-around-the-world",
        category: "geo",
        categoryLabel: "Geography",
        title: "Geography: Around the World",
        emoji: "🗺️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #10b981, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "islands-of-the-world",
        category: "geo",
        categoryLabel: "Geography",
        title: "Islands of the World",
        emoji: "🏝️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #06b6d4, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "mountains-rivers-lakes",
        category: "geo",
        categoryLabel: "Geography",
        title: "Mountains, Rivers & Lakes",
        emoji: "🏔️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #38bdf8, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1596003903067-bf5762ad5c19?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "famous-landmarks",
        category: "geo",
        categoryLabel: "Geography",
        title: "Famous Landmarks",
        emoji: "🏛️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "europe",
        category: "geo",
        categoryLabel: "Geography",
        title: "Europe",
        emoji: "🇪🇺",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #3b82f6, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1562923928-6078542d1ad1?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "usa-50-states",
        category: "geo",
        categoryLabel: "Geography",
        title: "USA: 50 States",
        emoji: "🇺🇸",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #dc2626, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1580586047177-eaa155789eb4?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "kings-queens-royalty",
        category: "history",
        categoryLabel: "History",
        title: "Kings, Queens & Royalty",
        emoji: "👑",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #b45309, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1630397794941-46ed66b8fbca?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "empires-conquerors",
        category: "history",
        categoryLabel: "History",
        title: "Empires & Conquerors",
        emoji: "⚔️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #a16207, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1621427260125-3cbe2d07e0f4?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "spies-codes-secret-operations",
        category: "history",
        categoryLabel: "History",
        title: "Spies, Codes & Secret Operations",
        emoji: "🕵️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #64748b, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1618371690240-e0d46eead4b8?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "shipwrecks-maritime-disasters",
        category: "history",
        categoryLabel: "History",
        title: "Shipwrecks & Maritime Disasters",
        emoji: "🚢",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #0891b2, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1558256708-bc39e034b935?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "aviation-wright-to-concorde",
        category: "history",
        categoryLabel: "History",
        title: "Aviation: From Wright Brothers to Concorde",
        emoji: "✈️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #2563eb, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1628354215124-dd0ab72828ac?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "inventions-changed-the-world",
        category: "history",
        categoryLabel: "History",
        title: "Inventions That Changed the World",
        emoji: "💡",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #eab308, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1522832712787-3fbd36c9fe2d?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "money-millionaires-fortunes",
        category: "general",
        categoryLabel: "General Knowledge",
        title: "Money, Millionaires & Famous Fortunes",
        emoji: "💰",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #16a34a, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "brands-logos-slogans",
        category: "general",
        categoryLabel: "General Knowledge",
        title: "Brands, Logos & Slogans",
        emoji: "🏢",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f97316, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1781768526555-d3c895f08ee3?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "beer-wine-spirits",
        category: "food",
        categoryLabel: "Food & Drink",
        title: "Beer, Wine & Spirits",
        emoji: "🍺",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "food-around-the-world",
        category: "food",
        categoryLabel: "Food & Drink",
        title: "Food Around the World",
        emoji: "🍕",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #ef4444, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "coffee-tea-chocolate",
        category: "food",
        categoryLabel: "Food & Drink",
        title: "Coffee, Tea & Chocolate",
        emoji: "☕",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #92400e, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "video-games",
        category: "pop",
        categoryLabel: "Pop Culture",
        title: "Video Games",
        emoji: "🎮",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #7c3aed, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "classic-tv",
        category: "tv",
        categoryLabel: "TV & Film",
        title: "Classic TV",
        emoji: "📺",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #ec4899, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "sitcoms",
        category: "tv",
        categoryLabel: "TV & Film",
        title: "Sitcoms",
        emoji: "😂",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #f59e0b, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1577462637488-d74f6206201e?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "superheroes-comic-books",
        category: "pop",
        categoryLabel: "Pop Culture",
        title: "Superheroes & Comic Books",
        emoji: "🦸",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #dc2626, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "fantasy-worlds",
        category: "pop",
        categoryLabel: "Pop Culture",
        title: "Fantasy Worlds",
        emoji: "🧙",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #8b5cf6, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "books-literature",
        category: "culture",
        categoryLabel: "Arts & Culture",
        title: "Books & Literature",
        emoji: "📚",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #a855f7, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "art-famous-masterpieces",
        category: "culture",
        categoryLabel: "Arts & Culture",
        title: "Art & Famous Masterpieces",
        emoji: "🎨",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #ec4899, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1606819717115-9159c900370b?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "sports-records-legends",
        category: "sport",
        categoryLabel: "Sport",
        title: "Sports: Records & Legends",
        emoji: "🏆",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #16a34a, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1667983088885-226788e18a6e?auto=format&fit=crop&w=1000&q=80",
        pdfPath: null
    },
    {
        id: "formula-1",
        category: "sport",
        categoryLabel: "Sport",
        title: "Formula 1",
        emoji: "🏎️",
        price: "€4.99",
        glow: "radial-gradient(circle at 50% 0%, #dc2626, transparent 70%)",
        badges: ["50 questions"],
        image: "https://images.unsplash.com/photo-1635414764966-682bd029bb01?auto=format&fit=crop&w=1000&q=80",
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
