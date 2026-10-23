<script setup>
// C9 article card — single entry in the articles index.
// `article` is a Nuxt Content doc (frontmatter fields + `path`).
defineProps({
  article: { type: Object, required: true },
});
const { t, locale } = useI18n();
</script>

<template>
  <NuxtLink
    :to="article.path"
    class="c9-article-card"
    :class="{ 'is-live': article.live }"
  >
    <div class="c9-article-card__meta">
      <span class="c9-article-card__tag">{{ article.tag }}</span>
      <span class="c9-article-card__dot" aria-hidden="true">·</span>
      <span class="c9-article-card__date">{{ formatDate(article.date, locale) }}</span>
      <span class="c9-article-card__dot" aria-hidden="true">·</span>
      <span class="c9-article-card__read">
        <font-awesome-icon icon="fa-regular fa-clock" aria-hidden="true" /> {{ article.read }}
      </span>
    </div>
    <h3 class="c9-article-card__title">{{ article.title }}</h3>
    <p class="c9-article-card__lead">{{ article.lead }}</p>
    <div class="c9-article-card__foot">
      <div class="c9-article-card__cta">
        {{ t("articles.read") }} <font-awesome-icon icon="fa-solid fa-arrow-right" aria-hidden="true" />
      </div>
      <span v-if="article.live" class="c9-article-card__live">
        <span class="c9-article-card__pulse"></span>{{ t("articles.live") }}
      </span>
    </div>
  </NuxtLink>
</template>
