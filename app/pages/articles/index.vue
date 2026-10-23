<script setup>
const { t } = useI18n();
usePageSeo({
  title: () => t("seo.articles.title"),
  description: () => t("seo.articles.description"),
});

// All articles, newest first (date is ISO so string ordering is chronological).
const { data: articles } = await useAsyncData("articles-index", () =>
  queryCollection("articles").order("date", "DESC").all()
);
// No articles published yet: the section doesn't exist (see useHasArticles).
if (!articles.value?.length) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}
</script>

<template>
  <ArticlesIndex :articles="articles || []" />
</template>
