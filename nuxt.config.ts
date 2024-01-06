// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      meta: [
        { name: "theme-color", content: "#ffffff" },
        { name: "name", content: "Islam Application" },
        { name: "author", content: "Ionive Tech" },
      ],
      htmlAttrs: {
        lang: "id",
      },
    },
  },

  css: ["~/assets/css/main.css"],

  imports: {
    dirs: ["stores"],
  },

  modules: ["@pinia/nuxt", "@nuxt/ui", "@vueuse/nuxt"],
  routeRules: {
    '/': { prerender: true, redirect: '/al-quran' },
    '/hadith': { ssr: true },
    '/prayer': { ssr: true },
    '/schedule': { ssr: false },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
