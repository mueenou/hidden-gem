<template>
  <UContainer class="min-h-screen m-auto flex items-center justify-center">
    <div class="w-full">
      <h1 class="text-2xl font-bold text-primary-400 mb-6">
        Questions générées pour "{{ jobTitle }}"
      </h1>
      <UDivider class="my-6">
        <p>Description</p>
      </UDivider>
      <div class="text-gray-200 duration-300">
        <div v-if="showMore">
          <p>
            {{ jobDescription }}
            <span class="text-primary-500 cursor-pointer" @click="showMore = false">... réduire</span>
          </p>
        </div>
        <div v-else>
          <p>
            {{ jobDescription.slice(0, 400) }}
            <span class="text-primary-500 cursor-pointer" @click="showMore = true">... Lire la suite</span>
          </p>
        </div>
      </div>

      <!-- Affichage des questions -->
      <UDivider class="my-6">
        <p>Questions & Réponses</p>
      </UDivider>


      <UAccordion v-if="questionsAnswers" :items="questionsAnswers" variant="ghost" multiple size="xl" color="primary" >
        <template  #item="{ item }">
          <p class="ml-4 text-gray-200 italic">{{ item.content }}</p>
        </template>
      </UAccordion>
      
      <!-- Affichage d'un loader pendant le chargement des questions -->
      <div class="space-y-2" v-if="status == 'pending'">
        <p>Chargement des questions/réponses...</p>
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-[80%]" />
      <USkeleton class="h-6 w-[60%]" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-[90%]" />
      <USkeleton class="h-6 w-full" />
      <USkeleton class="h-6 w-full" />
    </div>
      <!-- Bouton de retour -->
    <div class="mt-6">
      <UButton type="submit" class="w-full py-3 flex justify-center" @click="goBack">
        Retourner à l'accueil
      </UButton>
    </div>
    </div>
  </UContainer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const jobTitle = ref(route.query.title || "Titre non spécifié");
const jobDescription = ref(route.query.description || "Description non spécifiée");
const loading = ref(true);
const showMore = ref(false);

// Utilisation de useFetch pour faire un appel à l'API pour générer les questions
const { data: questionsAnswers, status } = await useFetch("/api/generate-interview", {
  lazy: true,
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
  })
});

console.log(questionsAnswers.value)

// Retour à la page d'accueil
const goBack = () => {
  router.push("/");
};
</script>
