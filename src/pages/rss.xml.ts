import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  articles.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: 'GuíaDeportiva.es — Guías de zapatillas running',
    description: 'Guías y comparativas honestas de zapatillas running para corredores en España.',
    site: context.site!,
    items: articles.map(article => ({
      title: article.data.title,
      pubDate: article.data.publishDate,
      description: article.data.seoDescription,
      link: `/${article.slug}/`,
    })),
    customData: '<language>es-es</language>',
  });
}
