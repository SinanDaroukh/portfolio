<script setup>
// Anti-scraping email link. The address is passed as [user, domain] so it
// never appears whole in the source, the JS bundle or the server HTML. Until
// the visitor interacts with the page, the link shows "user [at] domain" with
// no mailto; then the real address and mailto link are assembled in the
// browser. The default slot receives the text to display (`{ text }`), so
// callers can add an icon or show an icon only.
const props = defineProps({
  address: { type: Array, required: true }, // [user, domain]
});

const revealed = useEmailReveal();
const email = computed(() => props.address.join("@"));
const text = computed(() => (revealed.value ? email.value : props.address.join(" [at] ")));
const href = computed(() => (revealed.value ? `mailto:${email.value}` : undefined));
</script>

<template>
  <a :href="href">
    <slot :text="text">{{ text }}</slot>
  </a>
</template>
