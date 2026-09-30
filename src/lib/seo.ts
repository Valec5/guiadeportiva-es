// Extracts structured data (FAQ, reviewed products) from article MDX bodies,
// so the JSON-LD always matches the visible content without duplicating it in frontmatter.

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductItem {
  name: string;
  /** Id of the product heading, set by src/lib/rehype-product-anchors.mjs. */
  anchor: string;
}

/** Markdown/MDX inline syntax → plain text. */
export function plainText(md: string): string {
  return md
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*|__|\*|`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Body of the `## <title>` section, up to the next h2. */
function section(body: string, title: RegExp): string | undefined {
  const m = body.match(new RegExp(`^## ${title.source}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'));
  return m?.[1];
}

/** "**¿Pregunta?**\nRespuesta" pairs from the "Preguntas frecuentes" section. */
export function extractFAQ(body: string): FAQItem[] {
  const faq = section(body, /Preguntas frecuentes/);
  if (!faq) return [];
  const items: FAQItem[] = [];
  const re = /^\*\*(.+?)\*\*\s*\n([\s\S]+?)(?=\n\s*\n|\n\*\*|$(?![\s\S]))/gm;
  for (const m of faq.matchAll(re)) {
    const question = plainText(m[1]);
    const answer = plainText(m[2]);
    if (question.endsWith('?') && answer) items.push({ question, answer });
  }
  return items;
}

/**
 * Reviewed products in page order: "## 1. Nombre — Subtítulo" (guides) or "## Nombre en detalle"
 * (comparativas). Must match the headings rehype-product-anchors.mjs numbers as #producto-N.
 */
export function extractProducts(body: string): ProductItem[] {
  const re = /^## (?:\d+\.\s+(.+?)\s+—.*|(.+?) en detalle)\s*$/gm;
  return [...body.matchAll(re)].map((m, i) => ({
    name: plainText(m[1] ?? m[2]),
    anchor: `producto-${i + 1}`,
  }));
}
