<script setup>
// The two corner cats, and the easter egg behind them: three quick pets
// (clicks/taps) on a cat open the photo gallery — a heart per pet, a purr on
// the second. Typing "miaou" anywhere opens it too. Nothing hints that the
// cats are clickable.
// Hiding: the cats only show in the dark theme (CSS), with just their ears
// above the page's bottom edge. A cat rises when the pointer comes near it;
// on touch screens (no hover) both rise once the page is scrolled to the end.
const { t } = useI18n();
const gallery = useCatGallery();

const NEAR = 110; // px from a cat at which it rises
const FAR = 180; // px beyond which it goes back down (hysteresis)
const DOWN_DELAY = 500; // ms before going back down
const els = {};
const up = reactive({ coquelicot: false, puff: false });
const downTimers = {};
let pointer = null;
let frame = 0;

function distanceToRect(x, y, r) {
  const dx = Math.max(r.left - x, 0, x - r.right);
  const dy = Math.max(r.top - y, 0, y - r.bottom);
  return Math.hypot(dx, dy);
}

function checkProximity() {
  frame = 0;
  if (!pointer) return;
  for (const { id } of CATS) {
    const r = els[id]?.getBoundingClientRect();
    if (!r || !r.width) continue; // hidden (light theme)
    const d = distanceToRect(pointer.x, pointer.y, r);
    if (d < NEAR) {
      clearTimeout(downTimers[id]);
      downTimers[id] = null;
      up[id] = true;
    } else if (d > FAR && up[id] && !downTimers[id]) {
      downTimers[id] = setTimeout(() => {
        up[id] = false;
        downTimers[id] = null;
      }, DOWN_DELAY);
    }
  }
}

function onPointerMove(e) {
  if (e.pointerType === "touch") return;
  pointer = { x: e.clientX, y: e.clientY };
  if (!frame) frame = requestAnimationFrame(checkProximity);
}

function onPointerOut(e) {
  if (e.relatedTarget) return; // still inside the page
  pointer = { x: -1e4, y: -1e4 };
  checkProximity();
}

// The first time the bottom of the page is reached, one cat (picked at
// random) pokes its head out for a moment, then hides again — unless the
// pointer is right there.
const PEEK_DELAY = 600;
const PEEK_MS = 1400;
let peeked = false;

function isNear(id) {
  const r = els[id]?.getBoundingClientRect();
  return !!(pointer && r && r.width && distanceToRect(pointer.x, pointer.y, r) < FAR);
}

function peekOnce() {
  if (peeked) return;
  const visible = CATS.filter(({ id }) => els[id]?.getBoundingClientRect().width);
  if (!visible.length) return; // light theme: the cats are hidden
  peeked = true;
  const { id } = visible[Math.floor(Math.random() * visible.length)];
  setTimeout(() => {
    up[id] = true;
    setTimeout(() => {
      if (!isNear(id)) up[id] = false;
    }, PEEK_MS);
  }, PEEK_DELAY);
}

let touchOnly = null;
function onScroll() {
  const root = document.documentElement;
  const atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 24;
  if (touchOnly?.matches) {
    for (const { id } of CATS) up[id] = atBottom;
  } else if (atBottom) {
    peekOnce();
  }
}

const CATS = [
  { id: "coquelicot", src: "/img/cat-calico.webp", side: "left" },
  { id: "puff", src: "/img/cat-lynx.webp", side: "right" },
];
const PETS_TO_OPEN = 3;
const PET_WINDOW = 1500; // ms allowed between pets before the count resets
const SECRET = "miaou";

const pets = { coquelicot: 0, puff: 0 };
const timers = {};
const purring = reactive({ coquelicot: false, puff: false });
const hearts = ref([]); // { key, cat, x, delay, size }
let heartKey = 0;
let typed = "";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function spawnHearts(cat, count) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const key = ++heartKey;
    hearts.value.push({ key, cat, x: 15 + Math.random() * 60, delay: i * 70, size: 14 + Math.random() * 10 });
    setTimeout(() => {
      hearts.value = hearts.value.filter((h) => h.key !== key);
    }, 1300 + i * 70);
  }
}

function pet(cat) {
  clearTimeout(timers[cat]);
  pets[cat] += 1;
  if (pets[cat] >= PETS_TO_OPEN) {
    pets[cat] = 0;
    spawnHearts(cat, 9);
    setTimeout(() => gallery.open(cat), reducedMotion() ? 0 : 450);
    return;
  }
  spawnHearts(cat, pets[cat]);
  if (pets[cat] === 2 && !reducedMotion()) {
    purring[cat] = true;
    setTimeout(() => (purring[cat] = false), 600);
  }
  timers[cat] = setTimeout(() => (pets[cat] = 0), PET_WINDOW);
}

function onKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
  const el = e.target;
  if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
  typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
  if (typed === SECRET) {
    typed = "";
    gallery.open("all");
  }
}

onMounted(() => {
  touchOnly = window.matchMedia("(hover: none)");
  window.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", onPointerOut);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerout", onPointerOut);
  window.removeEventListener("scroll", onScroll);
  cancelAnimationFrame(frame);
  Object.values(timers).forEach(clearTimeout);
  Object.values(downTimers).forEach(clearTimeout);
});
</script>

<template>
  <div class="c9-cats">
    <button
      v-for="c in CATS"
      :key="c.id"
      :ref="(el) => (els[c.id] = el)"
      type="button"
      class="c9-cat"
      :class="[`c9-cat--${c.side}`, { 'is-purring': purring[c.id], 'is-up': up[c.id] }]"
      :aria-label="t('cats.pet', { name: t(`cats.${c.id}.short`) })"
      @click="pet(c.id)"
    >
      <img class="c9-cat__img" :src="c.src" alt="" width="1000" height="1000" />
      <svg
        v-for="h in hearts.filter((h) => h.cat === c.id)"
        :key="h.key"
        class="c9-cat__heart"
        viewBox="0 0 7 6"
        aria-hidden="true"
        :style="{ left: `${h.x}%`, width: `${h.size}px`, animationDelay: `${h.delay}ms` }"
      >
        <path d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z" />
      </svg>
    </button>
    <LazyCatGallery v-if="gallery.state.value.open" />
  </div>
</template>
