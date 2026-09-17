import { concepts } from "../../data/concepts/concepts";
import type { Concept } from "../../data/concepts/types";

export function getConceptById(conceptId: string): Concept | undefined {
  return concepts.find((concept) => concept.id === conceptId);
}

export function getConceptBySlug(slug: string): Concept | undefined {
  return concepts.find((concept) => concept.slug === slug);
}

export function getRelatedConcepts(concept: Concept): Concept[] {
  return concept.relatedConceptIds
    .map((conceptId) => getConceptById(conceptId))
    .filter((relatedConcept): relatedConcept is Concept =>
      Boolean(relatedConcept),
    );
}
