import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  // Get the request body
  const body = await readBody(event);
  const { jobTitle, jobDescription } = body;

  // Access runtime config
  const config = useRuntimeConfig();

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: config.public.openaiApiKey,
  });

  // Construct the prompt in French
  const prompt = `Générez 10 questions et réponses potentielles bien détaillées pour un entretien d'embauche pour un poste de "${jobTitle}" basé sur la description de poste suivante : "${jobDescription}".
  Formatez la sortie comme un tableau JSON d'objets, où chaque objet a un champ "question" et un champ "response". Par exemple: \`\`\`json\n[\n  {\n    "question": "Quelles sont vos compétences clés?",\n    "response": "Mes compétences clés incluent la résolution de problèmes, la communication et le travail d'équipe."\n  }\n]\n\`\`\``;

  try {
    // Make a request to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Vous êtes un assistant utile qui génère des questions et réponses d'entretien basées sur le titre et la description du poste. Répondez en français et assurez-vous d'inclure le titre du poste dans vos réponses lorsque c'est approprié.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Get the content from the response
    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error("Pas de contenu dans la réponse OpenAI");
    }

    // Extract JSON from the content
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error("Aucun JSON trouvé dans la réponse");
    }

    // Parse the extracted JSON
    const parsedContent = JSON.parse(jsonMatch[1]);

    // Validate the structure of the parsed content
    if (
      !Array.isArray(parsedContent) ||
      !parsedContent.every((item) => item.question && item.response)
    ) {
      throw new Error("Structure de réponse invalide de OpenAI");
    }

    // Return the parsed and validated response
    return parsedContent;
  } catch (error) {
    console.error("Erreur:", error);
    return createError({
      statusCode: 500,
      statusMessage:
        "Une erreur s'est produite lors du traitement de votre demande.",
    });
  }
});
