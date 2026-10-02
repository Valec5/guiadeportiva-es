// Wraps every Markdown table in <div class="table-scroll"> so wide comparison tables scroll
// horizontally on phones instead of squeezing their columns. Cells whose whole content is a
// measurement (e.g. "311g", "10mm", "9.5mm") or an empty-data dash get class "num" so they render
// in the monospaced data face with tabular numerals.
const NUMERIC = /^\s*(\d+([.,]\d+)?\s?(g|mm|ms|km)|—|-)\s*$/i;

const textOf = node =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

export default function rehypeTableScroll() {
  return tree => {
    const markCells = node => {
      for (const child of node.children ?? []) {
        if (child.type === 'element' && child.tagName === 'td' && NUMERIC.test(textOf(child))) {
          const cls = child.properties.className ?? [];
          child.properties.className = [...(Array.isArray(cls) ? cls : [cls]), 'num'];
        }
        markCells(child);
      }
    };
    const walk = node => {
      if (!node.children) return;
      node.children = node.children.map(child => {
        if (child.type === 'element' && child.tagName === 'table') {
          markCells(child);
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Tabla comparativa' },
            children: [child],
          };
        }
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
