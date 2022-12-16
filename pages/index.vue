<script setup lang="ts">
definePageMeta({
  title: "sinan", // set resoruce key
});

// useHead({
//   meta: [{ property: "og:title", content: "this is og title for about page" }],
// });

const { locale } = useI18n();
</script>

<template>
  <div>
    <Splashscreen />
    <!-- <select v-model="locale">
      <option value="en">en</option>
      <option value="fr">fr</option>
    </select> -->
  </div>
</template>
