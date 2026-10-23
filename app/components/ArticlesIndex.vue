<script setup>
// C9 articles index — section header + tag filter chips + grid of cards.
// `articles` is the list of Nuxt Content docs, passed in by the page.
const props = defineProps({
  articles: { type: Array, default: () => [] },
});
const { t } = useI18n();

// null = every tag ("All"); otherwise the selected tag.
const filter = ref(null);

const tags = computed(() => Array.from(new Set(props.articles.map((a) => a.tag))));
const filtered = computed(() =>
  filter.value === null ? props.articles : props.articles.filter((a) => a.tag === filter.value)
);
</script>

<template>
  <div class="c9-articles">
    <div class="c9-articles__head">
      <span class="c9-eyebrow">{{ t("articles.eyebrow", articles.length) }}</span>
      <h1 class="c9-articles__title">{{ t("articles.title") }}</h1>
      <p class="c9-articles__lead">{{ t("articles.lead") }}</p>
      <hr class="c9-rule" />
    </div>

    <div class="c9-articles__filters" role="tablist" :aria-label="t('articles.filter')">
      <button
        v-for="tag in [null, ...tags]"
        :key="tag ?? 'all'"
        role="tab"
        :aria-selected="filter === tag"
        class="c9-chip"
        :class="{ 'is-active': filter === tag }"
        @click="filter = tag"
      >
        {{ tag ?? t("articles.all") }}
      </button>
    </div>

    <div class="c9-articles__grid">
      <ArticleCard v-for="a in filtered" :key="a.path" :article="a" />
    </div>
  </div>
</template>
