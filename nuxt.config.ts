// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  modules: ["@nuxt/ui"],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      openaiApiKey: process.env.OPENAI_API_KEY, // Ajoutez votre clé OpenAI ici
    },
  },
});
