import type { Concept } from "../../data/concepts/types";
import { getConceptsFromDatabase } from "./conceptService";
import { addConceptSuggestion } from "./conceptSuggestionsService";

export type ConceptCandidate = {
  name: string;
};

export async function extractConceptCandidates(
  text: string,
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
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to extract concept candidates.");
  }

  const data = await response.json();

  return data.candidates ?? [];
}

function normalizeText(content: string): string {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

export function removeExistingConcepts(
  candidates: ConceptCandidate[],
  concepts: Concept[],
): ConceptCandidate[] {
  const existingNames = new Set(
    concepts.map((concept) => normalizeName(concept.name)),
  );

  return candidates.filter(
    (candidate) => !existingNames.has(normalizeName(candidate.name)),
  );
}

export function getPlainTextFromNote(content: string): string {
  return normalizeText(content);
}

export async function extractNewConceptCandidates(
  content: string,
): Promise<ConceptCandidate[]> {
  const text = getPlainTextFromNote(content);

  if (!text) {
    return [];
  }

  const [candidates, concepts] = await Promise.all([
    extractConceptCandidates(text),
    getConceptsFromDatabase(),
  ]);

  return removeExistingConcepts(candidates, concepts);
}

export async function createConceptSuggestionsForNote(
  noteId: string,
  content: string,
): Promise<void> {
  const candidates = await extractNewConceptCandidates(content);

  await Promise.all(
    candidates.map((candidate) => addConceptSuggestion(noteId, candidate.name)),
  );
}
