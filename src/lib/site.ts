// ── Site-wide configuration ──────────────────────────────────────────────
// When reusing this template for a new site, edit this file and everything
// — metadata, sitemap, robots, OG tags — updates automatically.
// You should never need to hard-code your site name/URL anywhere else.

export const siteConfig = {
  // ── Identity ─────────────────────────────────────────────────────────
  name: "Template",
  shortName: "Template",
  tagline: "A starter template for lightweight web tools",
  description:
    "A Next.js starter template for shipping small, self-contained browser tools. Clone it, add your own tools, and ship fast.",

  // ── URLs ─────────────────────────────────────────────────────────────
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Path prefix for the entire site (e.g. "/docs"). Default: root. */
  basePath: "/" as `/${string}`,

  // ── Locale ───────────────────────────────────────────────────────────
  locale: "en_US",
  /** ISO 639-1 */
  language: "en",

  // ── Social / Branding ────────────────────────────────────────────────
  twitter: {
    site: "@yourhandle", // ← replace with your Twitter handle
    creator: "@yourhandle",
  },

  // ── SEO metadata helpers ─────────────────────────────────────────────
  /** Default <title> shown on the homepage. */
  title: {
    default: "Template — A starter template for lightweight web tools",
    /** Template used for sub-pages: "Page Title | Template" */
    template: "%s | Template",
  },

  /** Open Graph image (1200×630 px recommended). Place in /public/og.png */
  ogImage: "/og.png",

  keywords: [
    "tools",
    "web utilities",
    "starter template",
    "Next.js",
    "shadcn",
  ],
} as const;

// ── Derived helpers (used by sitemap / metadata / robots) ─────────────

export type SiteConfig = typeof siteConfig;

/** Absolute URL builder — always produces a trailing-slash-free string. */
export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/+$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
