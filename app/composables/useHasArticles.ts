// Whether any article is published. While there are none, the site ships
// without its articles section: no nav link, /articles is a 404, no sitemap
// entry, and the home page's "blog" mention isn't a link. Await it in setup so
// the server render already knows (no hydration flip).
export async function useHasArticles() {
  const { data } = await useAsyncData("articles-count", () => queryCollection("articles").count());
  return computed(() => (data.value ?? 0) > 0);
}
