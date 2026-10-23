<script setup lang="ts">
// Error page (404 and others) — the C9 logo drifts around like the old DVD
// screensaver: it bounces off the edges and changes colour on every hit, and
// a perfect corner hit gets counted. Static and centred for reduced motion.
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const { t } = useI18n();

const is404 = computed(() => props.error?.statusCode === 404);
const code = computed(() => props.error?.statusCode || 500);

useHead({
  title: () => `${code.value} — Sinan Daroukh · C9 Corp`,
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

const COLORS = ["var(--c9-accent)", "#00B386", "#F59E0B", "#EC4899", "#3B82F6", "var(--c9-fg)"];
const stage = ref<HTMLElement | null>(null);
const logo = ref<HTMLElement | null>(null);
const colorIndex = ref(0);
const corners = ref(0);
const color = computed(() => COLORS[colorIndex.value % COLORS.length]);

function home() {
  clearError({ redirect: "/" });
}

let raf = 0;
onMounted(() => {
  const el = logo.value;
  const box = stage.value;
  if (!el || !box) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-still");
    return;
  }
  let x = Math.random() * Math.max(0, box.clientWidth - el.offsetWidth);
  let y = Math.random() * Math.max(0, box.clientHeight - el.offsetHeight);
  let dx = Math.random() < 0.5 ? -1 : 1;
  let dy = Math.random() < 0.5 ? -1 : 1;
  let last = performance.now();

  const step = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const maxX = Math.max(0, box.clientWidth - el.offsetWidth);
    const maxY = Math.max(0, box.clientHeight - el.offsetHeight);
    const speed = Math.max(90, Math.min(maxX, maxY) * 0.25); // px per second
    x += dx * speed * dt;
    y += dy * speed * dt;
    let hitX = false;
    let hitY = false;
    if (x <= 0 || x >= maxX) { x = Math.min(Math.max(x, 0), maxX); dx = -dx; hitX = true; }
    if (y <= 0 || y >= maxY) { y = Math.min(Math.max(y, 0), maxY); dy = -dy; hitY = true; }
    if (hitX || hitY) colorIndex.value++;
    if (hitX && hitY) corners.value++;
    el.style.transform = `translate(${x}px, ${y}px)`;
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
});
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<template>
  <NuxtLayout>
    <section class="c9-error">
      <div ref="stage" class="c9-error__stage" aria-hidden="true">
        <span ref="logo" class="c9-error__logo" :style="{ color }" />
      </div>
      <div class="c9-error__card">
        <p class="c9-error__code">{{ code }}</p>
        <h1 class="c9-error__title">{{ is404 ? t("error.notFound") : t("error.generic") }}</h1>
        <a class="c9-error__back" href="/" @click.prevent="home">{{ t("error.back") }}</a>
        <p v-if="corners" class="c9-error__corners" aria-live="polite">{{ t("error.corners", { n: corners }) }}</p>
      </div>
    </section>
  </NuxtLayout>
</template>
