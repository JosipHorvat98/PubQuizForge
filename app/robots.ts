// file: app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
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
        sitemap: "https://pubquizforge.com/sitemap.xml"
    };
}
