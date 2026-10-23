// sitemap.xml: the public pages plus every article (from Nuxt Content).
// /portfolio is left out on purpose (placeholder content, noindex), and
// /articles while no article is published (it's a 404 then).
// Prerendered at build time (nuxt.config nitro.prerender).
import { queryCollection } from "@nuxt/content/server";

const PAGES = ["/", "/cv", "/mentions-legales"];

export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl as string;
  const articles = await queryCollection(event, "articles").select("path", "date").all();
  const urls = [
    ...[...PAGES, ...(articles.length ? ["/articles"] : [])].map((path) => ({ path, lastmod: undefined as string | undefined })),
    ...articles.map((a) => ({ path: a.path, lastmod: a.date })),
  ];
  const body = urls
    .map(({ path, lastmod }) => {
      const loc = path === "/" ? site : `${site}${path}`; // same form as the canonical links
      return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    })
    .join("\n");
  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
});
