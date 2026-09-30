import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeProductAnchors from './src/lib/rehype-product-anchors.mjs';

export default defineConfig({
  site: 'https://guiadeportiva.es',
  integrations: [
    mdx(),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    rehypePlugins: [rehypeProductAnchors],
    shikiConfig: { theme: 'github-light' },
  },
});
