import type { Concept } from "../../data/concepts/types";

export type ConceptCandidate = {
  name: string;
};

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
