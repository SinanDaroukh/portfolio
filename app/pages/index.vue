<script setup lang="ts">
const { t } = useI18n();
const SITE_URL = useSiteUrl();

usePageSeo({
  title: () => t("seo.home.title"),
  description: () => t("seo.home.description"),
  type: "profile",
});

// Structured data (schema.org Person) so search engines can tell who this is,
// what he does, where, and link his profiles. No email on purpose: it would
// undo ProtectedEmail's anti-scraping.
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: () =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sinan Daroukh",
          url: SITE_URL,
          image: `${SITE_URL}/img/smol-me-avatar.webp`,
          jobTitle: t("seo.jobTitle"),
          description: t("seo.home.description"),
          address: { "@type": "PostalAddress", addressLocality: "Clermont-Ferrand", addressCountry: "FR" },
          worksFor: { "@type": "Organization", name: "C9 Corp", url: SITE_URL },
          alumniOf: [
            { "@type": "CollegeOrUniversity", name: "ISIMA" },
            { "@type": "CollegeOrUniversity", name: "ESC Clermont Business School" },
            { "@type": "CollegeOrUniversity", name: "Université d'Auvergne" },
          ],
          knowsLanguage: ["fr", "en", "es"],
          knowsAbout: ["Flutter", "Firebase", "Web development", "Mobile development", "CI/CD", "DevOps", "Software architecture"],
          sameAs: ["https://github.com/SinanDaroukh", "https://www.linkedin.com/in/sdaroukh/"],
        }),
    },
  ],
});
</script>

<template>
  <Home />
</template>
