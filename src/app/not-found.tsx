import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold tracking-tight text-muted-foreground/40">
        404
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        &larr; Back to {siteConfig.name}
      </Link>
    </div>
  );
}
