<template>
  <UContainer class="min-h-screen m-auto flex items-center justify-center text-base">
    <div class="w-full">
      <h1 class="text-2xl font-bold text-primary-400 mb-6">
        Questions générées pour "{{ jobTitle }}"
      </h1>
      <UDivider label="Description" />
      <p class="my-6">{{ jobDescription.slice(0, 400) + '...' }}</p>

      <!-- Affichage des questions -->
      <UDivider label="Questions & Réponses" />


      <UAccordion v-if="questionsAnswers" :items="questionsAnswers" class="mt-6" variant="ghost" multiple size="xl" color="teal" />

      <!-- Gestion des erreurs ou absence de questions -->
      <div v-else-if="error">
        <p class="text-red-500">
          Erreur lors de la génération des questions : {{ error.message }}
        </p>
      </div>
      <div v-else-if="!loading">
        <p class="text-center text-gray-500">Aucune question n'a été générée.</p>
      </div>

      <!-- Bouton de retour -->
      <div class="mt-6">
        <UButton type="submit" class="w-full py-3 flex justify-center" @click="goBack">
          Générer les questions
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const jobDetails = ref([{ title: route.query.title || "Titre non spécifié", content: route.query.description || "Description non spécifiée" }]);

const jobTitle = ref(route.query.title || "Titre non spécifié");

const jobDescription = ref(route.query.description || "Description non spécifiée");
const loading = ref(true);

// Utilisation de useFetch pour faire un appel à l'API pour générer les questions
const { data: questionsAnswers, error } = await useFetch("/api/generate-interview", {
  transform: (rawData) => {
    return rawData.map((el) => ({
      label: el.question.replace(/undefined/g, jobTitle.value),
      content: el.response.replace(/undefined/g, jobTitle.value),
    }));
  },
  method: "POST",
  body: JSON.stringify({
    title: jobTitle.value,
    description: jobDescription.value,
  }),
  onResponse({ response }) {
    loading.value = false;
  },
  onError({ error }) {
    console.error("Erreur lors de la génération des questions", error);
    loading.value = false;
  },
});

console.log(questionsAnswers.value)

// Retour à la page d'accueil
const goBack = () => {
  router.push("/");
};
</script>
