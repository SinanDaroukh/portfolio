// Per-page SEO: <title>, meta description, Open Graph + Twitter/X card (with
// the shared preview image) and the robots directive. Canonical, og:url and
// og:locale come from the i18n head in layouts/default.vue.
import type { MaybeRefOrGetter } from "vue";

export const SITE_NAME = "Sinan Daroukh · C9 Corp";

// Public site URL, from nuxt.config (runtimeConfig.public.siteUrl).
export function useSiteUrl(): string {
  return useRuntimeConfig().public.siteUrl as string;
}

interface PageSeo {
  title: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  type?: "website" | "article" | "profile";
  publishedTime?: MaybeRefOrGetter<string | undefined>;
  noindex?: boolean;
}

export function usePageSeo(seo: PageSeo) {
  const ogImage = `${useSiteUrl()}/og-image.png`;
  const title = () => toValue(seo.title);
  const description = () => toValue(seo.description);
  useSeoMeta({
    title,
    description,
    robots: seo.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    ogTitle: title,
    ogDescription: description,
    ogType: seo.type ?? "website",
    ogSiteName: SITE_NAME,
    ogImage: ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: SITE_NAME,
    articlePublishedTime: () => toValue(seo.publishedTime),
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
  });
}
