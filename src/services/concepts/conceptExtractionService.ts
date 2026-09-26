import type { Concept, ConceptType } from "../../data/concepts/types";
import { getConceptsFromDatabase } from "./conceptService";
import { addConceptSuggestion } from "./conceptSuggestionsService";

export type ConceptCandidate = {
  name: string;
  type: ConceptType;
  shortDefinition: string;
  explanation: string;
  subtopicIds: string[];
};

type AvailableSubtopic = {
  id: string;
  name: string;
};

type ConceptExtractionResponse = {
  candidates: ConceptCandidate[];
};

export async function extractConceptCandidates(
  text: string,
  subtopics: AvailableSubtopic[] = [],
): Promise<ConceptCandidate[]> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/api/concepts/extract/`, {
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
    throw new Error("Failed to extract concept candidates.");
  }

  const data = (await response.json()) as ConceptExtractionResponse;

  return data.candidates ?? [];
}

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("nb-NO");
}

export function removeExistingConcepts(
  candidates: ConceptCandidate[],
  existingConcepts: Concept[],
): ConceptCandidate[] {
  const existingNames = new Set(
    existingConcepts.map((concept) => normalizeText(concept.name)),
  );

  return candidates.filter(
    (candidate) => !existingNames.has(normalizeText(candidate.name)),
  );
}

export function getPlainTextFromNote(content: string): string {
  const documentElement = new DOMParser().parseFromString(content, "text/html");

  return documentElement.body.textContent?.trim() ?? "";
}

export async function extractNewConceptCandidates(
  content: string,
): Promise<ConceptCandidate[]> {
  const text = getPlainTextFromNote(content);

  if (!text) {
    return [];
  }

  const [candidates, existingConcepts] = await Promise.all([
    extractConceptCandidates(text),
    getConceptsFromDatabase(),
  ]);

  return removeExistingConcepts(candidates, existingConcepts);
}

export async function createConceptSuggestionsForNote(
  noteId: string,
  content: string,
): Promise<number> {
  const candidates = await extractNewConceptCandidates(content);

  for (const candidate of candidates) {
    await addConceptSuggestion(
      noteId,
      candidate.name,
      candidate.type,
      candidate.shortDefinition,
      candidate.explanation,
    );
  }

  return candidates.length;
}
