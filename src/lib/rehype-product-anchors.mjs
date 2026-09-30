// Gives each reviewed product's <h2> a stable id (#producto-1, #producto-2…) so the ItemList
// JSON-LD can point at it. Matches the same headings as extractProducts() in src/lib/seo.ts:
// "N. Nombre — Subtítulo" (guides) and "Nombre en detalle" (comparativas).
const text = node =>
  node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

export default function rehypeProductAnchors() {
  return tree => {
    let n = 0;
    const walk = node => {
      if (node.type === 'element' && node.tagName === 'h2') {
        const t = text(node).trim();
        if (/^\d+\.\s+.+\s+—/.test(t) || /\sen detalle$/.test(t)) {
          node.properties = { ...node.properties, id: `producto-${++n}` };
        }
        return;
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}
