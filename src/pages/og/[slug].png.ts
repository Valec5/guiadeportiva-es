import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgImage } from '../../lib/og';

const categoryLabel = { running: 'Running', comparativas: 'Comparativas' } as const;

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return [
    // Home and static pages share this one.
    { params: { slug: 'default' }, props: { title: 'Las mejores zapatillas deportivas para cada corredor' } },
    ...articles.map(a => ({
      params: { slug: a.slug },
      props: { title: a.data.title, label: categoryLabel[a.data.category] },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as { title: string; label?: string });
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
