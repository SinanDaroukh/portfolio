// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

// Public site URL: canonical links, Open Graph, structured data, sitemap.
const SITE_URL = "https://sinan.daroukh.fr";

export default defineNuxtConfig({
  compatibilityDate: '2026-07-03',

  runtimeConfig: {
    public: { siteUrl: SITE_URL },
  },

  app: {
    head: {
      link: [{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
      meta: [
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
        { name: "theme-color", content: "#050505", media: "(prefers-color-scheme: dark)" },
      ],
    },
  },

  // Security headers on every response (pages and static files). Framing is
  // limited to the site itself and Nuxt Studio's preview (X-Frame-Options
  // can't allow a single outside domain, so frame-ancestors does it).
  routeRules: {
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "frame-ancestors 'self' https://nuxt.studio https://*.nuxt.studio",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
    },
  },

  // Build sitemap.xml as a static file (also covers `nuxt generate`).
  nitro: {
    prerender: { routes: ["/sitemap.xml"] },
    // Same Node major as package.json "engines" (used by the Vercel preset).
    vercel: { functions: { runtime: "nodejs24.x" } },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    // Vercel Web Analytics + Speed Insights: cookieless, client-side only,
    // active once enabled in the Vercel project (Analytics / Speed Insights).
    "@vercel/analytics",
    "@vercel/speed-insights",
    "@nuxt/content",
    [
      "@nuxtjs/i18n",
      {
        baseUrl: SITE_URL,
        locales: [
          {
            code: "fr",
            language: "fr-FR",
            file: "fr-FR.json",
          },
          {
            code: "en",
            language: "en-US",
            file: "en-US.json",
          },
        ],
        defaultLocale: "fr",
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

  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    // C9 Corp design system. Order matters: Tailwind (global.css) first, then
    // the design tokens + component styles so the brand's base element styles
    // win over Tailwind's preflight.
    "~/styles/global.css",
    "~/styles/tokens.css",
    "~/styles/components.css",
  ],

  // Still required with Nuxt 4: without transpiling, FontAwesome icons are
  // dropped from the SSR HTML (client-only hydration).
  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
      "@fortawesome/free-solid-svg-icons",
    ],
  },

  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    },
    // Node's built-in SQLite (Node >= 22.5) instead of the native
    // better-sqlite3 addon: nothing to compile at install, so the Vercel build
    // can't ship a function without its database driver.
    experimental: { sqliteConnector: 'native' },
  },
  
  devtools: {
    timeline: {
      enabled: true,
    },
  },
});