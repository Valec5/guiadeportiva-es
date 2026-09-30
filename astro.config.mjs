import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeProductAnchors from './src/lib/rehype-product-anchors.mjs';
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';

export default defineConfig({
  site: 'https://guiadeportiva.es',
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    rehypePlugins: [rehypeProductAnchors, rehypeTableScroll],
    shikiConfig: { theme: 'github-light' },
  },
});
