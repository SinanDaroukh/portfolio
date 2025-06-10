// https://nuxt.com/docs/api/configuration/nuxt-config
// import { defineNuxtConfig } from ;

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    [
      "@nuxtjs/i18n",
      {
        baseUrl: "https://sinan.daroukh.fr",
        locales: [
          {
            code: "en",
            iso: "en-US",
            file: "en-US.json",
          },
          {
            code: "fr",
            iso: "fr-FR",
            file: "fr-FR.json",
          },
        ],
        langDir: "locales/",
        strategy: "no_prefix",
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: "i18n_redirected",
          redirectOn: "root", // recommended
        },
      },
    ],
  ],
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-solid-svg-icons",
    ],
  },
});