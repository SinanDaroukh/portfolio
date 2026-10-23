<script setup>
// Easter-egg gallery of the house cats, opened from the corner cats or by
// typing "miaou". A native modal <dialog> gives focus trapping, Esc and the
// backdrop for free. Grid of thumbnails → full-size viewer (arrows / swipe).
const { t } = useI18n();
const { state, close } = useCatGallery();

const dialog = ref(null);
const filter = ref(state.value.cat);
const current = ref(-1); // index in `photos` shown in the viewer; -1 = grid

const TABS = [
  { id: "all" },
  { id: "coquelicot", portrait: "/img/cat-calico.webp" },
  { id: "puff", portrait: "/img/cat-lynx.webp", mirror: true },
];

const photos = computed(() =>
  filter.value === "all" ? CAT_PHOTOS : CAT_PHOTOS.filter((p) => p.cats.includes(filter.value))
);
const subtitle = computed(() => (filter.value === "all" ? t("cats.both") : t(`cats.${filter.value}.full`)));
const shown = computed(() => photos.value[current.value]);

function tabLabel(id) {
  return id === "all" ? t("cats.all") : t(`cats.${id}.short`);
}
function alt(photo) {
  return photo.cats.length > 1 ? t("cats.both") : t(`cats.${photo.cats[0]}.short`);
}
function pick(id) {
  filter.value = id;
  current.value = -1;
}
function step(delta) {
  const n = photos.value.length;
  current.value = (current.value + delta + n) % n;
}

function shut() {
  dialog.value?.close();
}
// Esc inside the viewer goes back to the grid instead of closing everything.
function onCancel(e) {
  if (current.value >= 0) {
    e.preventDefault();
    current.value = -1;
  }
}
function onBackdrop(e) {
  if (e.target === dialog.value) shut();
}
function onKey(e) {
  if (current.value < 0) return;
  if (e.key === "ArrowRight") step(1);
  else if (e.key === "ArrowLeft") step(-1);
}

let swipeX = null;
function onPointerDown(e) {
  swipeX = e.clientX;
}
function onPointerUp(e) {
  if (swipeX === null) return;
  const dx = e.clientX - swipeX;
  swipeX = null;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
}

onMounted(() => {
  document.documentElement.style.overflow = "hidden";
  dialog.value.showModal();
});
onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="c9-gallery"
      :aria-label="t('cats.title')"
      @close="close"
      @cancel="onCancel"
      @click="onBackdrop"
      @keydown="onKey"
    >
      <header class="c9-gallery__head">
        <div class="c9-gallery__titles">
          <h2 class="c9-gallery__title">{{ t("cats.title") }}</h2>
          <p class="c9-gallery__subtitle">{{ subtitle }}</p>
        </div>
        <button type="button" class="c9-gallery__close" :aria-label="t('cats.close')" @click="shut">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
        <div class="c9-gallery__tabs" role="group" :aria-label="t('cats.filter')">
          <button
            v-for="tab in TABS"
            :key="tab.id"
            type="button"
            class="c9-gallery__tab"
            :aria-pressed="filter === tab.id"
            @click="pick(tab.id)"
          >
            <img
              v-if="tab.portrait"
              :src="tab.portrait"
              alt=""
              class="c9-gallery__portrait"
              :class="{ 'is-mirrored': tab.mirror }"
            />
            {{ tabLabel(tab.id) }}
          </button>
        </div>
      </header>

      <div v-if="current < 0" class="c9-gallery__body">
        <p class="c9-gallery__count">{{ t("cats.count", { n: photos.length }) }}</p>
        <ul class="c9-gallery__grid">
          <li v-for="(p, i) in photos" :key="p.id">
            <button type="button" class="c9-gallery__thumb" @click="current = i">
              <img :src="p.thumb" :alt="alt(p)" loading="lazy" decoding="async" />
            </button>
          </li>
        </ul>
      </div>

      <div
        v-else
        class="c9-gallery__viewer"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
      >
        <button type="button" class="c9-gallery__back" @click="current = -1">
          ← {{ t("cats.back") }}
        </button>
        <figure class="c9-gallery__figure">
          <img :src="shown.full" :alt="alt(shown)" draggable="false" />
          <figcaption>{{ current + 1 }} / {{ photos.length }}</figcaption>
        </figure>
        <button type="button" class="c9-gallery__nav c9-gallery__nav--prev" :aria-label="t('cats.prev')" @click="step(-1)">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </button>
        <button type="button" class="c9-gallery__nav c9-gallery__nav--next" :aria-label="t('cats.next')" @click="step(1)">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </button>
      </div>
    </dialog>
  </Teleport>
</template>
