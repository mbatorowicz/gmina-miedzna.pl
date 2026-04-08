import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const newsCollection = defineCollection({
  // W nowym Astro używamy dedykowanego loadera do odczytu markdownu jako bazy danych
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
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
