<script setup>
// C9 portfolio — project grid, designed in-system. Sharp rectangles + the
// signature offset shadow on the featured (most recent) project.
const projects = C9_PROJECTS;
</script>

<template>
  <div class="c9-portfolio">
    <header class="c9-portfolio__head">
      <span class="c9-eyebrow">Selected work · {{ projects.length }} projects</span>
      <h1 class="c9-portfolio__title">Portfolio</h1>
      <p class="c9-portfolio__lead">
        A short list of work I have shipped, alongside the public version of where I am right now.
      </p>
      <hr class="c9-rule" />
    </header>

    <div class="c9-portfolio__grid">
      <article
        v-for="(p, i) in projects"
        :key="i"
        class="c9-proj"
        :class="{ 'is-featured': p.featured }"
      >
        <div class="c9-proj__meta">
          <span>{{ p.sub }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ p.year }}</span>
        </div>
        <h3 class="c9-proj__title">{{ p.title }}</h3>
        <p class="c9-proj__body">{{ p.body }}</p>
        <div class="c9-proj__cta">
          View case study <font-awesome-icon icon="fa-solid fa-arrow-right" aria-hidden="true" />
        </div>
      </article>
    </div>
  </div>
</template>
