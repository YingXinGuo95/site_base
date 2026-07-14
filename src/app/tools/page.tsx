import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, tools } from "@/data/tools";
import { ToolCard } from "@/components/layout/ToolCard";
import { ToolShell } from "./ToolShell";

export const metadata: Metadata = {
  title: "Tools",
  description: "Browse all available tools.",
};

const toolContent: Record<string, { title: string; description: string }> = {
  "text-counter": {
    title: "Text Counter",
    description:
      "Count words, characters, sentences, and reading time for any text.",
  },
  "color-converter": {
    title: "Color Converter",
    description:
      "Convert colors between HEX, RGB, and HSL with live previews.",
  },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string }>;
}) {
  const { tool: toolSlug } = await searchParams;

  // If a specific tool is selected via ?tool=slug
  if (toolSlug) {
    const tool = getToolBySlug(toolSlug);
    if (!tool) {
      notFound();
    }
    const content = toolContent[toolSlug] ?? { title: toolSlug, description: "" };
    const thumbnailHtml = tool.thumbnailSvg(content.title);

    return (
      <ToolShell
        title={content.title}
        description={content.description}
        thumbnailHtml={thumbnailHtml}
      />
    );
  }

  // Otherwise show the tool listing grid
  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Tools</h1>
        <p className="mb-8 text-muted-foreground">
          A collection of lightweight, self-contained browser tools.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
