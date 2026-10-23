import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Generic page content (home, etc.). Excludes articles/ so those files
    // belong to a single collection only.
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['articles/**'],
      },
    }),
    // C9 Corp blog articles. `page` type → each file maps to a route path
    // (content/articles/foo.md → /articles/foo). The schema mirrors the fields
    // the C9 article card / reader render.
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string(),
        lead: z.string(),
        tag: z.string(),
        read: z.string(),
        date: z.string(), // ISO (e.g. 2026-03-12), formatted for display
        live: z.boolean().default(false),
      }),
    }),
  },
})
