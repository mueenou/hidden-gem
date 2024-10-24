<template>
  <UContainer class="min-h-screen m-auto flex items-center justify-center py-24">
    <div class="w-full max-w-3xl">
      <h1 class="text-2xl font-bold text-primary-400 mb-6">
        Questions générées pour "{{ store.jobTitle || "Titre non spécifié" }}"
      </h1>
      <UDivider class="my-6">
        <p>Description</p>
      </UDivider>
      <div class="duration-300">
        <div v-if="showMore">
          <p class="text-stone-950 dark:text-stone-200">
            {{ store.jobDescription }}
            <span class="text-primary-500 cursor-pointer" @click="showMore = false"
              >... réduire</span
            >
          </p>
        </div>
        <div v-else>
          <p>
            {{ store.jobDescription?.slice(0, 400) }}
            <span
              v-if="store.jobDescription?.length > 400"
              class="text-primary-500 cursor-pointer"
              @click="showMore = true"
              >... Lire la suite</span
            >
          </p>
        </div>
      </div>

      <UDivider class="my-6">
        <p>Questions & Réponses</p>
      </UDivider>
      <UAccordion
        v-if="accordionItems.length"
        :items="accordionItems"
        variant="ghost"
        multiple
        size="xl"
        color="primary"
      >
        <template #item="{ item }">
          <p class="ml-4 text-stone-950 dark:text-stone-200 italic">{{ item.content }}</p>
        </template>
      </UAccordion>

      <div class="space-y-2" v-if="store.loading">
        <p>Chargement des questions/réponses...</p>
        <USkeleton class="h-6 w-full" />
        <USkeleton class="h-6 w-[80%]" />
        <USkeleton class="h-6 w-[60%]" />
        <USkeleton class="h-6 w-full" />
        <USkeleton class="h-6 w-[90%]" />
        <USkeleton class="h-6 w-full" />
        <USkeleton class="h-6 w-full" />
      </div>

      <div class="mt-6 flex flex-wrap gap-4">
        <!-- Ajout de flex et gap-4 pour espacer les boutons -->
        <UButton
          type="button"
          class="w-full py-3 flex justify-center"
          color="gray"
          @click="goBack"
        >
          Retourner à l'accueil
        </UButton>

        <UButton
          type="button"
          class="w-full py-3 flex justify-center"
          :loading="store.loading"
          :disabled="store.loading"
          @click="generateMoreQuestions"
        >
          <template v-if="!store.loading">
            <UIcon name="i-heroicons-arrow-path" class="mr-2" />
            Générer de nouvelles questions
          </template>
          <template v-else> Génération en cours... </template>
        </UButton>
      </div>
      <!-- Ajout d'un indicateur du nombre total de questions -->
      <p class="text-center mt-4 text-gray-500 text-sm">
        Total : {{ store.questions.length }} questions générées
      </p>
    </div>
  </UContainer>
</template>

<script setup>
import { useRouter } from "#app";
import { useInterviewStore } from "~/stores/interview";

const router = useRouter();
const store = useInterviewStore();
const showMore = ref(false);

const accordionItems = computed(() => {
  if (!store.questions) return [];

  return store.questions.map((item) => ({
    label: item.question.replace(/undefined/g, store.jobTitle),
    content: item.response.replace(/undefined/g, store.jobTitle),
  }));
});

onMounted(() => {
  if (!store.questions?.length) {
    router.push("/");
  }
});

const goBack = () => {
  store.clearQuestions();
  router.push("/");
};

// Nouvelle fonction pour générer plus de questions
const generateMoreQuestions = async () => {
  const title = store.jobTitle;
  const description = store.jobDescription;
  await store.generateMoreQuestions(title, description);
};
</script>
