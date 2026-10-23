<script setup>
const { t } = useI18n();
usePageSeo({
  title: () => t("seo.cv.title"),
  description: () => t("seo.cv.description"),
  type: "profile",
});
</script>

<template>
  <div class="c9-art-host">
    <LogoArt />
    <CV />
  </div>
</template>
