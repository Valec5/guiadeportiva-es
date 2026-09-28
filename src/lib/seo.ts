// Extracts structured data (FAQ, reviewed products) from article MDX bodies,
// so the JSON-LD always matches the visible content without duplicating it in frontmatter.

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductItem {
  name: string;
  brand?: string;
  description?: string;
  url?: string;
}

// Multi-word brands first so "New Balance 860v14" doesn't resolve to "New".
const BRANDS = [
  'New Balance', 'Under Armour', 'ASICS', 'Brooks', 'Saucony', 'Nike', 'Adidas', 'Hoka', 'On',
  'Mizuno', 'Puma', 'Reebok', 'Salomon', 'Merrell', 'Inov-8', 'NoBull', 'TYR', 'Shimano',
  'Specialized', 'Fizik', 'Bontrager', 'Liv', 'Bullpadel', 'Wilson', 'Joma', 'Lotto', 'Head',
];

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

function brandOf(name: string): string | undefined {
  const lower = name.toLowerCase();
  return BRANDS.find(b => lower === b.toLowerCase() || lower.startsWith(b.toLowerCase() + ' '));
}

/**
 * Reviewed products: "## 1. Nombre — Subtítulo" (listicles) or "## Nombre en detalle" (comparativas).
 * Description is the first prose paragraph of the section; url the first Amazon link, if any.
 */
export function extractProducts(body: string): ProductItem[] {
  const products: ProductItem[] = [];
  const re = /^## (?:\d+\.\s+(.+?)\s+—.*|(.+?) en detalle)\s*$([\s\S]*?)(?=^## |(?![\s\S]))/gm;
  for (const m of body.matchAll(re)) {
    const name = plainText(m[1] ?? m[2]);
    const content = m[3];
    const paragraph = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .find(p => p && !/^(\*\*|-|\||<|\d+\.)/.test(p));
    const url = content.match(/href="(https:\/\/[^"]*amazon[^"]*)"/)?.[1];
    products.push({
      name,
      brand: brandOf(name),
      description: paragraph ? plainText(paragraph) : undefined,
      url,
    });
  }
  return products;
}
