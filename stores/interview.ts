import { defineStore } from "pinia";

interface Question {
  question: string;
  response: string;
}

export const useInterviewStore = defineStore("interview", {
  state: () => ({
    questions: [] as Question[],
    jobTitle: "",
    jobDescription: "",
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async generateQuestions(title: string, description: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch("/api/generate-interview", {
          method: "POST",
          body: {
            jobTitle: title,
            jobDescription: description,
          },
        });

        if (error.value) {
          throw new Error(
            error.value.statusMessage || "Une erreur est survenue"
          );
        }

        this.questions = data.value as Question[];
        this.jobTitle = title;
        this.jobDescription = description;

        return true;
      } catch (e) {
        this.error = e.message;
        return false;
      } finally {
        this.loading = false;
      }
    },
    // Nouvelle méthode pour ajouter des questions
    async generateMoreQuestions(title: string, description: string) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await useFetch("/api/generate-interview", {
          method: "POST",
          body: {
            jobTitle: title,
            jobDescription: description,
          },
          transform: (rawData) => {
            return rawData.map((el: any) => ({
              question: el.question.replace(/undefined/g, title),
              response: el.response.replace(/undefined/g, title),
            }));
          },
        });

        if (error.value) {
          throw new Error(
            error.value.statusMessage || "Une erreur est survenue"
          );
        }

        // Ajout des nouvelles questions aux questions existantes
        this.questions = [...this.questions, ...(data.value as Question[])];
        return true;
      } catch (e) {
        this.error = e.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    clearQuestions() {
      this.questions = [];
      this.jobTitle = "";
      this.jobDescription = "";
      this.error = null;
    },
  },
});
