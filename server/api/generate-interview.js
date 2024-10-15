export default defineEventHandler(async (event) => {
  try {
    // Lire les données envoyées depuis la requête
    const body = await readBody(event);
    const { title, description } = body;

    // Récupérer la clé API OpenAI depuis la configuration runtime
    const config = useRuntimeConfig();
    const apiKey = config.public.openaiApiKey;

    // Vérifier que les données nécessaires sont bien présentes
    if (!title || !description) {
      throw new Error("Le titre et la description du job sont requis.");
    }

    // Requête à l'API OpenAI pour générer des questions
    const response = await $fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Ou 'gpt-4' selon votre choix
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant pour générer des questions d'entretien d'embauche.",
            },
            {
              role: "user",
              content: `Génère des questions d'entretien pour un poste intitulé : "${title}". Voici la description du poste : ${description}`,
            },
          ],
          max_tokens: 150,
        }),
      }
    );

    // Transformer la réponse en tableau en séparant la chaîne à chaque numéro de question
    const questionsArray = response.choices[0].message.content
      .split(/\d+\.\s+/) // Séparer sur les numéros "1. ", "2. ", etc.
      .filter((q) => q.trim().length > 0); // Supprimer les éléments vides, s'il y en a

    // Retourner les questions sous forme de tableau
    return { questions: questionsArray };
  } catch (error) {
    // Gérer les erreurs et les renvoyer au client
    return {
      statusCode: 400,
      message: error.message,
    };
  }
});
