<script setup>
// C9 bordered icon button — the social-link motif.
// Mirrors `transition ease-in-out rounded-{full|lg} border-2 p-2 hover:scale-110`.
const props = defineProps({
  icon: { type: String, required: true }, // FontAwesome icon string
  href: { type: String, default: null },
  label: { type: String, default: null },
  round: { type: Boolean, default: false },
});

const cls = computed(() => "c9-iconbtn" + (props.round ? " c9-iconbtn--round" : ""));
</script>

<template>
  <a
    v-if="href"
    :class="cls"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
  >
    <font-awesome-icon :icon="icon" aria-hidden="true" />
  </a>
  <button v-else :class="cls" :aria-label="label">
    <font-awesome-icon :icon="icon" aria-hidden="true" />
  </button>
</template>
