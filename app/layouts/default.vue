<script setup>
// Canonical URL, og:url and og:locale come from i18n here; each page sets its
// own title, description and preview card with usePageSeo().
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: true,
});
// Explicit theme choice → class on <html> (rendered server-side from the cookie).
const { saved: theme } = useTheme();
</script>

<template>
  <div class="c9-page">
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" :class="theme ?? undefined">
      <Head>
        <template v-for="link in head.link" :key="link.id">
          <Link
            :id="link.id"
            :rel="link.rel"
            :href="link.href"
            :hreflang="link.hreflang"
          />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta
            :id="meta.id"
            :property="meta.property"
            :content="meta.content"
          />
        </template>
      </Head>
      <Body>
        <DotGrid />
        <Navbar />
        <main class="c9-main">
          <slot />
        </main>
        <Cats />

      </Body>
    </Html>
  </div>
</template>
