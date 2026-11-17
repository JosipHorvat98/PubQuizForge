// file: app/sitemap.ts
import type { MetadataRoute } from "next";
import { packs } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const base = (
        process.env.NEXT_PUBLIC_SITE_URL || "https://pubquizforge.com"
    ).replace(/\/+$/, "");
    const now = new Date();

    const staticRoutes = [
        "",
        "/about",
        "/news",
        "/contact",
        "/custom-questions",
        "/memberships",
        "/faq",
        "/privacy",
        "/terms",
        "/refund",
        "/shipping",
        "/cookies",
        "/impressum",
        "/legal",
        "/round-explainer"
    ];

    return [
        ...staticRoutes.map((route) => ({
            url: `${base}${route}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: route === "" ? 1 : 0.7
        })),
        ...packs.map((pack) => ({
            url: `${base}/packs/${pack.id}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.6
        }))
    ];
}
