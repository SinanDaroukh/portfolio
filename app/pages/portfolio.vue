<script setup>
// Placeholder projects for now: kept out of search engines (noindex, and not
// in the sitemap) until real content lands.
const { t } = useI18n();
usePageSeo({
  title: () => t("seo.portfolio.title"),
  description: () => t("seo.portfolio.description"),
  noindex: true,
});
</script>

<template>
  <Portfolio />
</template>
