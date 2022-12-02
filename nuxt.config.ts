// https://nuxt.com/docs/api/configuration/nuxt-config
// import { defineNuxtConfig } from ;

export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
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
