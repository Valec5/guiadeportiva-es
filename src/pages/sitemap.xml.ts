import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://guiadeportiva.es';

  const staticPages = [
    { url: `${site}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${site}/running/`, priority: '0.9', changefreq: 'weekly' },
    { url: `${site}/comparativas/`, priority: '0.9', changefreq: 'weekly' },
    { url: `${site}/sobre-nosotros/`, priority: '0.5', changefreq: 'monthly' },
    { url: `${site}/contacto/`, priority: '0.4', changefreq: 'yearly' },
  ];

  const articlePages = articles.map(a => ({
    url: `${site}/${a.slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: a.data.publishDate.toISOString().split('T')[0],
  }));

  const allPages = [...staticPages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
