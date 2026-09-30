// Builds the 1200x630 Open Graph images at build time (satori → SVG → PNG with resvg).
// Own artwork only: brand colours, logo, title and category. Never product photos.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) =>
  readFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`));

const fonts = [
  { name: 'Bricolage', data: font('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter', 'inter-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter', 'inter-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

const ORANGE = '#E8500A';
const INK = '#1A1714';

// Same mark as the site header: orange rounded square with a white play triangle.
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 26 26"><rect width="26" height="26" rx="6" fill="${ORANGE}"/><path d="M11 8 L19 13 L11 18 Z" fill="#fff"/></svg>`;
const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOgImage({ title, label }: { title: string; label?: string }): Promise<Buffer> {
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;

  const tree = h('div', {
    width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', background: INK, color: '#fff',
    padding: '64px 72px 0', fontFamily: 'Inter',
  }, [
    h('div', { display: 'flex', alignItems: 'center', gap: '18px' }, [
      h('img', { width: '56px', height: '56px' }, undefined, { src: markSrc, width: 56, height: 56 }),
      h('div', { display: 'flex', alignItems: 'baseline', fontFamily: 'Bricolage', fontSize: '38px', letterSpacing: '-0.02em' }, [
        h('span', { fontWeight: 800 }, 'GuíaDeportiva'),
        h('span', { fontFamily: 'Inter', fontWeight: 500, fontSize: '24px', color: '#8d857d', marginLeft: '6px' }, '.es'),
      ]),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', gap: '26px' }, [
      ...(label
        ? [h('div', { display: 'flex' }, [
            h('span', { background: ORANGE, color: '#fff', fontWeight: 600, fontSize: '24px', padding: '8px 20px', borderRadius: '999px' }, label),
          ])]
        : []),
      h('div', { fontFamily: 'Bricolage', fontWeight: 800, fontSize: `${titleSize}px`, lineHeight: 1.08, letterSpacing: '-0.025em', maxWidth: '1040px' }, title),
    ]),
    h('div', { display: 'flex', flexDirection: 'column' }, [
      h('div', { fontSize: '24px', color: '#b8b0a8', marginBottom: '36px' }, 'Guías de compra independientes de zapatillas deportivas'),
      h('div', { height: '14px', background: ORANGE, margin: '0 -72px' }),
    ]),
  ]);

  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
