import { getPlainTextFromNote } from "../concepts/conceptExtractionService";

export type AvailableFlashcardSubtopic = {
  id: string;
  name: string;
};

export type GeneratedFlashcard = {
  question: string;
  answer: string;
  subtopicId: string;
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

  const text = getPlainTextFromNote(content);

  if (!text) {
    throw new Error("Notatet inneholder ingen tekst.");
  }

  if (subtopics.length === 0) {
    throw new Error(
      "Notatet må være koblet til minst ett undertema før du kan generere flashcards.",
    );
  }

  const response = await fetch(`${apiUrl}/api/concepts/generate-flashcards/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

  if (!Array.isArray(data.flashcards)) {
    throw new Error("AI-tjenesten returnerte et ugyldig svar.");
  }

  return data.flashcards;
}
