<script setup>
// C9 article reader — single-article long-form reading layout.
// `doc` is a Nuxt Content page doc (frontmatter + parsed body).
defineProps({
  doc: { type: Object, required: true },
});
const { t, locale } = useI18n();
</script>

<template>
  <article class="c9-reader">
    <NuxtLink class="c9-reader__back" to="/articles">
      <font-awesome-icon icon="fa-solid fa-arrow-left" aria-hidden="true" /> {{ t("articles.allArticles") }}
    </NuxtLink>

    <header class="c9-reader__head">
      <div class="c9-reader__meta">
        <span>{{ doc.tag }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ formatDate(doc.date, locale) }}</span>
        <span aria-hidden="true">·</span>
        <span><font-awesome-icon icon="fa-regular fa-clock" aria-hidden="true" /> {{ doc.read }}</span>
      </div>
      <h1 class="c9-reader__title">{{ doc.title }}</h1>
      <p class="c9-reader__lead">{{ doc.lead }}</p>
      <hr class="c9-rule" />
    </header>

    <div class="c9-reader__body">
      <ContentRenderer :value="doc" />
    </div>

    <footer class="c9-reader__foot">
      <div class="c9-reader__author">
        <img src="/img/smol-me-avatar.webp" alt="" />
        <div>
          <div class="c9-reader__author-name">Sinan DAROUKH</div>
          <div class="c9-reader__author-role">{{ t("articles.authorRole") }}</div>
        </div>
      </div>
      <Button to="/articles">{{ t("articles.back") }}</Button>
    </footer>
  </article>
</template>
