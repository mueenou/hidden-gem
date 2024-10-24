import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  // Définition des constantes nécessaires
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 seconde
  const TIMEOUT = 30000; // 30 secondes

  // Fonction utilitaire pour le délai
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Récupération de la configuration
  const config = useRuntimeConfig();

  // Vérification de la clé API
  if (!config.public.openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur de configuration: Clé API OpenAI manquante",
    });
  }

  // Initialisation du client OpenAI
  const openai = new OpenAI({
    apiKey: config.public.openaiApiKey,
    maxRetries: MAX_RETRIES,
    timeout: TIMEOUT,
  });

  const makeRequest = async (retryCount = 0) => {
    try {
      const body = await readBody(event);
      const { jobTitle, jobDescription } = body;

      if (!jobTitle || !jobDescription) {
        throw createError({
          statusCode: 400,
          statusMessage: "Le titre et la description du poste sont requis",
        });
      }

      const prompt = `Générez 5 questions et réponses d'entretien d'embauche en français en fonction de cette offre d'emploi avec comme titre "${jobTitle}" et description "${jobDescription}".
      
      Retournez UNIQUEMENT un tableau JSON avec ce format exact, sans autre texte :
      [
        {
          "question": "Question en français",
          "response": "Réponse concise en français"
        }
      ]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Vous êtes un recruteur professionnel français. Générez des questions d'entretien pertinentes. Répondez uniquement en JSON valide.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0].message?.content;
      if (!content) {
        throw createError({
          statusCode: 500,
          statusMessage: "Pas de contenu dans la réponse OpenAI",
        });
      }

      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent
          .replace("```json", "")
          .replace("```", "")
          .trim();
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```/g, "").trim();
      }

      try {
        if (!cleanContent.endsWith("]")) {
          throw new Error("JSON incomplet reçu de l'API");
        }

        const parsedContent = JSON.parse(cleanContent);
        if (!Array.isArray(parsedContent)) {
          throw new Error("La réponse n'est pas un tableau");
        }

        return parsedContent;
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        console.error("Contenu reçu:", cleanContent);
        throw createError({
          statusCode: 500,
          statusMessage:
            "Erreur lors du parsing de la réponse. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error("Erreur détaillée:", {
        message: error.message,
        status: error?.status,
        statusCode: error?.statusCode,
        stack: error?.stack,
        attempt: retryCount + 1,
      });

      if (retryCount < MAX_RETRIES) {
        console.log(`Nouvelle tentative dans ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return makeRequest(retryCount + 1);
      }

      throw error;
    }
  };

  return makeRequest();
});
