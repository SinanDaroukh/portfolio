<script setup>
// A CV description line with its key phrases (CV_EMPHASIS) in italics.
// Rendered as text segments, no v-html.
const props = defineProps({ text: { type: String, default: "" } });
const { locale } = useI18n();
const segments = computed(() => cvEmphasize(props.text, CV_EMPHASIS[locale.value] ?? []));
</script>

<template>
  <template v-for="(s, i) in segments" :key="i"><em v-if="s.em">{{ s.text }}</em><template v-else>{{ s.text }}</template></template>
</template>
