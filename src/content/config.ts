import { z, defineCollection } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().default('Administrator'),
    category: z.string(),
    categoryName: z.string(),
    coverImage: image().optional(),
  }),
});

export const collections = {
  'news': newsCollection,
};
