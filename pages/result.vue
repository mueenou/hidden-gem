<template>
  <div class="min-h-screen max-w-3xl m-auto flex items-center justify-center">
    <div class="w-full shadow-md rounded-lg p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        Questions générées pour "{{ jobTitle }}"
      </h1>

      <p class="text-gray-600 mb-4">Description du job :</p>
      <p class="text-gray-700 mb-6">{{ jobDescription }}</p>

      <!-- Affichage des questions -->
      <div v-if="questionsAnswers">
        <ul class="space-y-4">
          <li
            v-for="(question, index) in questionsAnswers"
            :key="index"
            class="bg-gray-50 p-4 rounded-md shadow-sm"
          >
            <p class="font-medium text-gray-900">Question {{ index + 1 }} :</p>
            <p class="text-gray-700">{{ question }}</p>
          </li>
        </ul>
      </div>

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
        <button
          @click="goBack"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Retourner à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFetch } from "#app";

const route = useRoute();
const router = useRouter();

const jobTitle = ref(route.query.title || "Titre non spécifié");
const jobDescription = ref(route.query.description || "Description non spécifiée");
const loading = ref(true);

// Utilisation de useFetch pour faire un appel à l'API pour générer les questions
const { data: questionsAnswers, error } = await useFetch("/api/generate-interview", {
  method: "POST",
  body: {
    title: jobTitle.value,
    description: jobDescription.value,
  },
  onResponse({ response }) {
    loading.value = false;
  },
  onError({ error }) {
    console.error("Erreur lors de la génération des questions", error);
    loading.value = false;
  },
});

console.log(questionsAnswers.value);

// Retour à la page d'accueil
const goBack = () => {
  router.push("/");
};
</script>
