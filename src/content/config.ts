import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['running', 'comparativas']),
    keyword: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    publishDate: z.coerce.date(),
    featured: z.boolean().default(false),
    excerpt: z.string().optional(),
  }),
});

export const collections = { articles };
