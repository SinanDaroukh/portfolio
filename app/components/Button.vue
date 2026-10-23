<script setup>
// C9 text button. Variants: default (outline), primary (filled), ghost, live (accent).
const props = defineProps({
  variant: { type: String, default: "default" },
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: null },
  trailing: { type: String, default: null }, // FontAwesome icon string, e.g. "fa-solid fa-arrow-right"
});

const cls = computed(() => `c9-btn c9-btn--${props.variant}`);
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="cls"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <span><slot /></span>
    <font-awesome-icon v-if="trailing" :icon="trailing" aria-hidden="true" />
  </NuxtLink>
  <a
    v-else-if="href"
    :class="cls"
    :href="href"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <span><slot /></span>
    <font-awesome-icon v-if="trailing" :icon="trailing" aria-hidden="true" />
  </a>
  <button v-else :class="cls" :disabled="disabled" :aria-label="ariaLabel">
    <span><slot /></span>
    <font-awesome-icon v-if="trailing" :icon="trailing" aria-hidden="true" />
  </button>
</template>
