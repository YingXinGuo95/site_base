import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// ── robots.txt ──────────────────────────────────────────────────────────
// Next.js automatically serves this at /robots.txt
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
