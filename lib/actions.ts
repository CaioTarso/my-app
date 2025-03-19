"use server";

export async function interpretDream(
  dreamDescription: string
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!apiKey);

    if (!apiKey) {
      throw new Error(
        "Gemini API key is missing. Please check your environment variables."
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Você é um especialista em interpretação de sonhos, com conhecimento em psicologia junguiana, freudiana e simbolismo cultural, além de saber sobre elemntos da cultura popular.
              
              Ao interpretar sonhos, você deve:
              1. Analisar os símbolos e elementos principais do sonho
              2. Oferecer possíveis interpretações psicológicas
              3. Considerar o contexto cultural dos símbolos
              4. Apresentar diferentes perspectivas de interpretação
              5. Manter um tom respeitoso e reflexivo
              6. Inclua uma referência ou trocadilho com filme, livro, série ou outro elemento da cultura pop
              7. Se o sonho for uma referência a um filme, livro ou série, forneça uma interpretação baseada nessa referência.
              8. Seja sarcástico e humorístico
              9. Utilize emojis
              
              IMPORTANTE: Formate sua resposta da seguinte maneira:
              - Use parágrafos bem estruturados
              - máximo 3 parágrafos
              - Evite usar marcadores (*, -, #) ou formatação Markdown
              - Use espaçamento adequado entre parágrafos
              - Mantenha um tom fluido e narrativo
              - Evite títulos ou subtítulos
              
              Suas respostas devem ser estruturadas, detalhadas e escritas em português do Brasil.
              Evite afirmações absolutas, pois interpretações de sonhos são subjetivas.
              Não peça informações adicionais ao usuário, trabalhe com o que foi fornecido.
              
              Por favor, interprete o seguinte sonho de forma detalhada, considerando aspectos psicológicos, simbólicos e emocionais:
              
              "${dreamDescription}"`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error in dream interpretation:", error);
    return `Erro ao interpretar o sonho: ${
      error instanceof Error ? error.message : "Erro desconhecido"
    }`;
  }
}
