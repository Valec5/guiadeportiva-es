import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const isoDate = (d: Date) => d.toISOString().split('T')[0];

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://guiadeportiva.es';

  const modified = (a: (typeof articles)[number]) => a.data.updatedDate ?? a.data.publishDate;
  // Listing pages change whenever one of the articles they list changes.
  const latest = (list: typeof articles) =>
    list.length ? isoDate(new Date(Math.max(...list.map(a => modified(a).getTime())))) : undefined;
  const inCategory = (c: string) => articles.filter(a => a.data.category === c);

  // noindex pages (contacto, legales, afiliados) are intentionally left out.
  const staticPages = [
    { url: `${site}/`, priority: '1.0', changefreq: 'weekly', lastmod: latest(articles) },
    { url: `${site}/running/`, priority: '0.9', changefreq: 'weekly', lastmod: latest(inCategory('running')) },
    { url: `${site}/comparativas/`, priority: '0.9', changefreq: 'weekly', lastmod: latest(inCategory('comparativas')) },
    { url: `${site}/sobre-nosotros/`, priority: '0.5', changefreq: 'monthly' },
    { url: `${site}/metodologia/`, priority: '0.5', changefreq: 'monthly' },
  ];

  const articlePages = articles.map(a => ({
    url: `${site}/${a.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: isoDate(modified(a)),
  }));

  const allPages = [...staticPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>${p.lastmod ? `
    <lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
