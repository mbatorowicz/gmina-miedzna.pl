import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    author: z.string().optional(),
    category: z.string(),
    categoryName: z.string().optional(),
    coverImage: image().optional(),
    galleryImages: z.array(image()).optional(),
    pinned: z.boolean().default(false).optional(),
  })
});

export const collections = {
  news: newsCollection,
};
