<script setup>
// C9 CV — printable résumé, designed in-system.
// Content is localized (EN/FR) via useCv(); section labels via $t('cv.*').
const d = useCv();
const LINK_ICONS = { GitHub: "fa-brands fa-github", LinkedIn: "fa-brands fa-linkedin" };
</script>

<template>
  <section class="c9-cv">
    <header class="c9-cv__head">
      <div class="c9-cv__head-left">
        <span class="c9-eyebrow">{{ $t("cv.eyebrow") }}</span>
        <h1 class="c9-cv__name">{{ d.name }}</h1>
        <p class="c9-cv__role">{{ d.role }}</p>
        <hr class="c9-rule" />
        <p class="c9-cv__contact">
          <span><font-awesome-icon icon="fa-solid fa-location-dot" aria-hidden="true" /> {{ d.location }}</span>
          <span class="c9-cv__sep" aria-hidden="true">·</span>
          <ProtectedEmail v-slot="{ text }" :address="d.email"
            ><font-awesome-icon icon="fa-solid fa-envelope" aria-hidden="true" /> {{ text }}</ProtectedEmail
          >
          <template v-for="l in d.links" :key="l.kind">
            <span class="c9-cv__sep" aria-hidden="true">·</span>
            <a :href="l.href" target="_blank" rel="noopener noreferrer"
              ><font-awesome-icon :icon="LINK_ICONS[l.kind] ?? 'fa-solid fa-link'" aria-hidden="true" /> {{ l.kind }}</a
            >
          </template>
        </p>
      </div>
      <div class="c9-cv__head-right">
        <img src="/img/smol-me-avatar.webp" :alt="d.name" />
      </div>
    </header>

    <div class="c9-cv__body">
      <section>
        <h2 class="c9-cv__h2">{{ $t("cv.experience") }}</h2>
        <article v-for="(e, i) in d.experience" :key="i" class="c9-cv__entry">
          <div class="c9-cv__entry-when">{{ e.period }}<br /><span>{{ e.city }}</span></div>
          <div class="c9-cv__entry-what">
            <div class="c9-cv__entry-role">{{ e.role }}</div>
            <div class="c9-cv__entry-org">{{ e.org }}</div>
            <p v-if="e.lead" class="c9-cv__entry-lead"><CvText :text="e.lead" /></p>
            <ul v-if="e.bullets?.length">
              <li v-for="(b, j) in e.bullets" :key="j"><CvText :text="b" /></li>
            </ul>
          </div>
        </article>
      </section>

      <section>
        <h2 class="c9-cv__h2">{{ $t("cv.education") }}</h2>
        <article v-for="(e, i) in d.education" :key="i" class="c9-cv__entry">
          <div class="c9-cv__entry-when">{{ e.period }}</div>
          <div class="c9-cv__entry-what">
            <div class="c9-cv__entry-role">{{ e.degree }}</div>
            <div class="c9-cv__entry-org">{{ e.org }}</div>
          </div>
        </article>
      </section>

      <section v-if="d.certifications?.length">
        <h2 class="c9-cv__h2">{{ $t("cv.certifications") }}</h2>
        <div class="c9-cv__tags">
          <span v-for="c in d.certifications" :key="c" class="c9-cv__tag">{{ c }}</span>
        </div>
      </section>

      <section class="c9-cv__cols">
        <div>
          <h2 class="c9-cv__h2">{{ $t("cv.stack") }}</h2>
          <div class="c9-cv__tags">
            <span v-for="s in d.stack" :key="s" class="c9-cv__tag">{{ s }}</span>
          </div>
        </div>
        <div>
          <h2 class="c9-cv__h2">{{ $t("cv.languages") }}</h2>
          <ul class="c9-cv__langs">
            <li v-for="l in d.languages" :key="l.name"><b>{{ l.name }}</b> <span>· {{ l.level }}</span></li>
          </ul>
        </div>
      </section>
    </div>
  </section>
</template>
