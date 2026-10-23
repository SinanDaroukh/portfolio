<script setup>
// C9 home — the story (and recent articles) on the left, a profile card on the
// right (name, pitch, booking, socials), footer below. On phones the card comes
// first. Type and margins follow the window width (see components.css). Copy
// is i18n-driven (home.*).
const { t, locale } = useI18n();

const { data: articles } = await useAsyncData("home-articles", () =>
  queryCollection("articles").order("date", "DESC").limit(3).all()
);

function shortDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale.value === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const year = new Date().getFullYear();
const LINKEDIN_URL = "https://www.linkedin.com/in/sdaroukh/";
</script>

<template>
  <div class="c9-home c9-art-host">
    <LogoArt />

    <div class="c9-home__inner">
      <div class="c9-home__main">
        <section class="c9-home__intro">
          <p class="c9-home__hello">{{ t("home.hello") }}</p>
          <i18n-t keypath="home.intro1" tag="p" scope="global">
            <template #c9><strong>C9 Corp</strong></template>
          </i18n-t>
          <i18n-t keypath="home.intro2" tag="p" scope="global">
            <template #isima><strong>ISIMA</strong></template>
            <template #esc><strong>ESC Clermont</strong></template>
            <template #cern><strong>CERN</strong></template>
            <template #beys><strong>be ys Cloud</strong></template>
            <template #michelin><strong>Michelin</strong></template>
            <template #braincube><strong>Braincube</strong></template>
            <template #booklink><strong>Booklink</strong></template>
          </i18n-t>
          <ul class="c9-home__list">
            <li>{{ t("home.can.scope") }}</li>
            <li>{{ t("home.can.build") }}</li>
            <li>{{ t("home.can.maintain") }}</li>
          </ul>
          <i18n-t keypath="home.intro3" tag="p" scope="global">
            <template #blog>
              <NuxtLink v-if="articles?.length" class="c9-home__link" to="/articles">{{ t("home.blog") }}</NuxtLink>
              <template v-else>{{ t("home.blog") }}</template>
            </template>
          </i18n-t>
        </section>

        <section v-if="articles?.length" class="c9-home__section">
          <h2 class="c9-home__label">{{ t("home.writing") }}</h2>
          <ul class="c9-home__rows">
            <li v-for="a in articles" :key="a.path">
              <NuxtLink :to="a.path">{{ a.title }}</NuxtLink>
              <span class="c9-home__date">{{ shortDate(a.date) }}</span>
            </li>
          </ul>
        </section>
      </div>

      <aside id="contact" class="c9-home__card">
        <img class="c9-home__avatar" src="/img/smol-me-avatar.webp" :alt="t('alt.SmolMeBackground')" />
        <div class="c9-home__who">
          <h1 class="c9-home__name">Sinan<br />Daroukh</h1>
          <span class="c9-home__role">{{ t("home.role") }}</span>
        </div>
        <span class="c9-home__rule" aria-hidden="true"></span>
        <p class="c9-home__pitch">{{ t("home.pitch") }}</p>
        <div class="c9-home__actions">
          <a class="c9-home__cta" :href="C9_CALENDLY_URL" target="_blank" rel="noopener noreferrer">{{ t("home.book") }}</a>
          <i18n-t keypath="home.or" tag="span" class="c9-home__or" scope="global">
            <template #linkedin>
              <a class="c9-home__link" :href="LINKEDIN_URL" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </template>
          </i18n-t>
        </div>
        <div class="c9-home__card-foot">
          <span class="c9-home__where">{{ t("home.where") }}</span>
          <span class="c9-home__where">{{ t("home.modes") }}</span>
        </div>
      </aside>

      <footer class="c9-home__foot">
        <span>© {{ year }} C9 Corp · SIRET 104&nbsp;569&nbsp;157&nbsp;00019</span>
        <nav :aria-label="t('home.legal')">
          <NuxtLink to="/mentions-legales">{{ t("home.legalNotice") }}</NuxtLink>
        </nav>
      </footer>
    </div>
  </div>
</template>
