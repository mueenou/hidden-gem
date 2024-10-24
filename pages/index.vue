<template>
  <!-- Ajout d'une max-width et centrage -->
  <UContainer class="min-h-screen m-auto flex items-center justify-center py-24">
    <div class="w-full max-w-2xl mx-auto">
      <!-- Ajout de max-w-2xl -->
      <h1 class="text-2xl font-bold text-primary-500 mb-6">
        Générateur d'entretien d'embauche
      </h1>
      <UForm :state="state" class="space-y-4" @submit="submitJobDetails">
        <UFormGroup label="Titre du poste" name="jobTitle">
          <UInput v-model="formData.jobTitle" placeholder="Ex: Web developer" />
        </UFormGroup>

        <UFormGroup label="Description du poste" name="description">
          <UTextarea
            v-model="formData.jobDescription"
            placeholder="Description du job..."
            :rows="6"
          />
        </UFormGroup>

        <UButton
          type="submit"
          @click="submitJobDetails"
          class="w-full py-3 flex justify-center"
          :loading="store.loading"
        >
          {{ store.loading ? "Génération en cours..." : "Générer les questions" }}
        </UButton>

        <p v-if="store.error" class="text-red-500 mt-2 text-sm">
          {{ store.error }}
        </p>
      </UForm>
    </div>
  </UContainer>
</template>

<script setup>
import { useInterviewStore } from "~/stores/interview";

const store = useInterviewStore();
const router = useRouter();

const formData = ref({
  jobTitle: "",
  jobDescription: "",
});

const schema = {
  jobTitle: "required",
  jobDescription: "required",
};

const state = ref({
  jobTitle: "",
  jobDescription: "",
});

const submitJobDetails = async () => {
  console.log("here");
  const success = await store.generateQuestions(
    formData.value.jobTitle,
    formData.value.jobDescription
  );

  if (success) {
    navigateTo("/result");
  }
};
</script>
