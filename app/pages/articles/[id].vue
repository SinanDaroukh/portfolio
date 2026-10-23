<script setup>
const route = useRoute();
const id = computed(() => String(route.params.id));

const { data: doc } = await useAsyncData(`article-${id.value}`, () =>
  queryCollection("articles").path(`/articles/${id.value}`).first()
);

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
}

const { t } = useI18n();
const SITE_URL = useSiteUrl();
usePageSeo({
  title: () => `${doc.value?.title} — ${t("seo.articleSuffix")}`,
  description: () => doc.value?.lead ?? "",
  type: "article",
  publishedTime: () => doc.value?.date,
});
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: () =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: doc.value?.title,
          description: doc.value?.lead,
          datePublished: doc.value?.date,
          url: `${SITE_URL}${doc.value?.path}`,
          author: { "@type": "Person", name: "Sinan Daroukh", url: SITE_URL },
        }),
    },
  ],
});
</script>

<template>
  <ArticleReader v-if="doc" :doc="doc" />
</template>
