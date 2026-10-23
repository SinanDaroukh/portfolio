<script setup>
// Background particle grid: evenly lit dots on a fixed lattice; dots near the
// pointer are nudged away and brighten. Colour follows --c9-fg so it tracks
// the light/dark theme. Redrawn only when something changes (pointer, resize,
// theme), so it costs nothing while idle. The pointer effect is skipped when
// the visitor prefers reduced motion.
const canvas = ref(null);

const GAP = 24; // grid spacing (px)
const DOT = 1.5; // dot size at rest (px)
const BASE_ALPHA = 0.14;
const RADIUS = 140; // pointer influence radius (px)
const PUSH = 10; // max displacement under the pointer (px)

let cleanup = () => {};

onMounted(() => {
  const el = canvas.value;
  const ctx = el.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  const pointer = { x: -1e4, y: -1e4 };
  let w = 0;
  let h = 0;
  let color = "#000";
  let frame = 0;

  function readColor() {
    const v = getComputedStyle(document.documentElement).getPropertyValue("--c9-fg").trim();
    color = v || "#000";
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    frame = 0;
    const still = reduce.matches;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    for (let y = GAP / 2; y < h; y += GAP) {
      for (let x = GAP / 2; x < w; x += GAP) {
        let alpha = BASE_ALPHA;
        let size = DOT;
        let px = x;
        let py = y;
        if (!still) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const k = 1 - d / RADIUS; // 1 at the pointer, 0 at the edge
            px += (dx / d) * PUSH * k;
            py += (dy / d) * PUSH * k;
            alpha += 0.35 * k;
            size += 1.2 * k;
          }
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function requestDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }

  const onResize = () => {
    resize();
    requestDraw();
  };
  const onMove = (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    if (!reduce.matches) requestDraw();
  };
  const onLeave = (e) => {
    if (e.relatedTarget) return;
    pointer.x = pointer.y = -1e4;
    requestDraw();
  };
  const onTheme = () => {
    readColor();
    requestDraw();
  };

  // The theme lives on <html> (class) or comes from the OS preference.
  const observer = new MutationObserver(onTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerout", onLeave);
  reduce.addEventListener("change", requestDraw);
  scheme.addEventListener("change", onTheme);

  readColor();
  resize();
  draw();

  cleanup = () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerout", onLeave);
    reduce.removeEventListener("change", requestDraw);
    scheme.removeEventListener("change", onTheme);
  };
});

onBeforeUnmount(() => cleanup());
</script>

<template>
  <canvas ref="canvas" class="c9-dots" aria-hidden="true" />
</template>
