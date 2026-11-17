// file: app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const base = (
        process.env.NEXT_PUBLIC_SITE_URL || "https://pubquizforge.com"
    ).replace(/\/+$/, "");

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/api",
                "/account",
                "/cart",
                "/success",
                "/cancel",
                "/login",
                "/signup",
                "/forgot-password"
            ]
        },
        sitemap: `${base}/sitemap.xml`
    };
}
