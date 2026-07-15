import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProviderWrapper } from "@/components/auth/SessionProviderWrapper";
import { auth } from "@/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Template — A starter template for lightweight web tools",
    template: "%s | Template",
  },
  description:
    "Template is a Next.js starter template for shipping small, self-contained browser tools. Clone it, add your own tools, and ship fast.",
  keywords: ["tools", "web utilities", "starter template", "Next.js", "shadcn"],
  openGraph: {
    title: "Template — A starter template for lightweight web tools",
    description:
      "A Next.js starter template for shipping small, self-contained browser tools.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html className={cn("font-sans", inter.variable)} lang="en">
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
