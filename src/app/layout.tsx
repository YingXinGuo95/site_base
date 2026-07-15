import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProviderWrapper } from "@/components/auth/SessionProviderWrapper";
import { auth } from "@/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  // ── Base URL (required by Next.js for resolving relative OG images) ─
  metadataBase: new URL(siteConfig.url),

  // ── Page title ────────────────────────────────────────────────────
  title: siteConfig.title,

  // ── Description & keywords ────────────────────────────────────────
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  // ── Robots & indexing ─────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  // ── Open Graph ────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title.default,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // ── Twitter Card ──────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title.default,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.creator,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html className={cn("font-sans", inter.variable)} lang={siteConfig.language}>
      <body className="min-h-screen bg-background antialiased">
        <SessionProviderWrapper session={session}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
