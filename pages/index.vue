<template>
  <UContainer class="min-h-screen m-auto flex items-center justify-center">
    <div class="w-full">
      <h1 class="text-2xl font-bold text-primary-500 mb-6">
        Générateur d'entretien d'embauche
      </h1>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="submitJobDetails">
        <UFormGroup label="Titre tu poste" name="jobTitle">
          <UInput v-model="jobTitle" placeholder="Ex: Web developer" />
        </UFormGroup>

        <UFormGroup label="Description du poste" name="description">
          <UTextarea v-model="jobDescription" placeholder="Description du job..."/>
        </UFormGroup>

        <UButton type="submit" class="w-full py-3 flex justify-center">
          Générer les questions
        </UButton>
      </UForm>
    </div>
  </Ucontainer>
</template>

<script setup>
import { useRouter } from "vue-router";

const jobTitle = ref("");
const jobDescription = ref("");
const router = useRouter();

const submitJobDetails = () => {
  router.push({
    path: "/result",
    query: {
      title: jobTitle.value,
      description: jobDescription.value,
    },
  });
};
</script>
