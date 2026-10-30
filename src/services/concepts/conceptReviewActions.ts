import { notifyConceptsChanged } from "./conceptContentEvents";
import { supabase } from "../../lib/supabase";
import type { Concept } from "../../data/concepts/types";
export type ConceptEdits = { name: string; shortDefinition: string; explanation: string };
export async function applyConceptReview(concept: Concept, action: "edit" | "delete", values?: ConceptEdits) {
  const { error } = await supabase.rpc("review_concept_action", {
    p_id: concept.id, p_action: action,
    p_expected: { name: concept.name, shortDefinition: concept.shortDefinition, explanation: concept.explanation ?? null },
    p_values: values ?? null,
  });
  if (error) throw new Error(error.message);
  notifyConceptsChanged();
}
