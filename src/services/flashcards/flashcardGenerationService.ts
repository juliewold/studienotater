import { getAIAuthHeaders } from "../../lib/aiAuth";

export type AvailableFlashcardSubtopic = {
  id: string;
  name: string;
  topicName?: string;
};

export type GeneratedFlashcard = {
  question: string;
  answer: string;
  subtopicId: string | null;
};

type FlashcardGenerationResponse = {
  flashcards: GeneratedFlashcard[];
};

export async function generateFlashcards(
  content: string,
  subtopics: AvailableFlashcardSubtopic[],
): Promise<GeneratedFlashcard[]> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  // Send editor HTML so the backend can retain LaTeX attributes and block boundaries.
  const text = content.trim();

  if (!text) {
    throw new Error("Notatet inneholder ingen tekst.");
  }

  const response = await fetch(`${apiUrl}/api/concepts/generate-flashcards/`, {
    method: "POST",
    headers: await getAIAuthHeaders(),
    body: JSON.stringify({
      text,
      subtopics,
    }),
  });

  if (!response.ok) {
    const failure = await response.json().catch(() => null);

    const message =
      typeof failure?.error === "string"
        ? failure.error
        : "Kunne ikke generere flashcards. Prøv igjen senere.";

    throw new Error(message);
  }

  const data = (await response.json()) as FlashcardGenerationResponse;

  if (!data || !Array.isArray(data.flashcards) || data.flashcards.some((card) =>
    !card || typeof card.question !== "string" || !card.question.trim() ||
    typeof card.answer !== "string" || !card.answer.trim() ||
    (card.subtopicId !== null && !subtopics.some((s) => s.id === card.subtopicId))
  )) {
    throw new Error("AI-tjenesten returnerte et ugyldig svar.");
  }

  return data.flashcards;
}
