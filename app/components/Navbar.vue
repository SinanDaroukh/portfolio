<script setup>
// C9 top nav — logo bubble (top-left); muted links, locale and theme toggle
// (top-right). Wraps under the logo on narrow screens instead of a burger.
const { locale, setLocale } = useI18n();
const route = useRoute();
const { isDark, toggle } = useTheme();
const hasArticles = await useHasArticles();

// Articles only once some are published. Portfolio hidden for now.
const items = computed(() => [
  ...(hasArticles.value ? [{ to: "/articles", label: "Articles" }] : []),
  { to: "/cv", label: "CV" },
]);

function isActive(to) {
  return route.path.startsWith(to);
}
</script>

<template>
  <header class="c9-nav">
    <NuxtLink class="c9-nav__brand" to="/" aria-label="C9 Corp, home">
      <img src="/img/logos/C9-Logo.png" alt="" />
    </NuxtLink>

    <div class="c9-nav__right">
      <nav class="c9-nav__items" aria-label="Primary">
        <NuxtLink
          v-for="it in items"
          :key="it.to"
          :to="it.to"
          class="c9-nav__link"
          :class="{ 'is-active': isActive(it.to) }"
        >
          {{ it.label }}
        </NuxtLink>
      </nav>

      <div class="c9-nav__locale" role="group" aria-label="Language">
        <button lang="fr" :class="{ 'is-active': locale === 'fr' }" :aria-pressed="locale === 'fr'" @click="setLocale('fr')">fr</button>
        <button lang="en" :class="{ 'is-active': locale === 'en' }" :aria-pressed="locale === 'en'" @click="setLocale('en')">en</button>
      </div>

      <button
        type="button"
        class="c9-nav__theme"
        :aria-label="isDark ? $t('nav.toLight') : $t('nav.toDark')"
        @click="toggle"
      >
        <font-awesome-icon :icon="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" />
      </button>
    </div>
  </header>
</template>
