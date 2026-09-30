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

export interface TopPick {
  name: string;
  url: string;
}

const AMAZON_HREF = /href="(https:\/\/(?:www\.amazon\.es|link\.amazon)\/[^"]+)"/;

/**
 * The article's headline recommendation for the mobile sticky bar: the "Mejor general" quick pick
 * (or the first pick), resolved to its product section and that section's Amazon link.
 * `override` (frontmatter `topPick`) names the product directly, for articles without quick picks.
 */
export function extractTopPick(body: string, override?: string): TopPick | undefined {
  const sections = [...body.matchAll(/^## (?:\d+\.\s+(.+?)\s+—.*|(.+?) en detalle)\s*$([\s\S]*?)(?=^## |(?![\s\S]))/gm)]
    .map(m => ({ name: plainText(m[1] ?? m[2]), url: m[3].match(AMAZON_HREF)?.[1] }))
    .filter((p): p is TopPick => !!p.url);
  if (!sections.length) return undefined;

  let wanted = override;
  if (!wanted) {
    const picks = (section(body, /Resumen rápido/) ?? '')
      .split('\n')
      .filter(l => l.startsWith('- ') && l.includes('→'));
    const pick = picks.find(l => /Mejor general/i.test(l)) ?? picks[0];
    wanted = pick ? plainText(pick.split('→')[1].replace(/<a [^>]*>.*?<\/a>/g, '')) : undefined;
  }
  if (!wanted) return undefined;
  // Match on the longest product name contained in the pick (picks may omit "Mujer", etc.).
  const norm = (s: string) => s.toLowerCase().replace(/\s+mujer$/, '');
  return [...sections]
    .sort((a, b) => b.name.length - a.name.length)
    .find(p => norm(wanted!).includes(norm(p.name)) || norm(p.name).includes(norm(wanted!)));
}
