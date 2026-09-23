import { supabase } from "../../lib/supabase";

export type ConceptSubtopicLink = {
  conceptId: string;
  subtopicId: string;
};

export async function getConceptSubtopicLinks(
  conceptId: string,
): Promise<ConceptSubtopicLink[]> {
  const { data, error } = await supabase
    .from("concept_subtopics")
    .select("concept_id, subtopic_id")
    .eq("concept_id", conceptId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((link) => ({
    conceptId: link.concept_id,
    subtopicId: link.subtopic_id,
  }));
}

export async function getConceptIdsBySubtopic(
  subtopicId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("concept_subtopics")
    .select("concept_id")
    .eq("subtopic_id", subtopicId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((link) => link.concept_id);
}

export async function addConceptSubtopic(
  conceptId: string,
  subtopicId: string,
) {
  const { data: existingLink, error: selectError } = await supabase
    .from("concept_subtopics")
    .select("concept_id")
    .eq("concept_id", conceptId)
    .eq("subtopic_id", subtopicId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingLink) {
    return;
  }

  const { error: insertError } = await supabase
    .from("concept_subtopics")
    .insert({
      concept_id: conceptId,
      subtopic_id: subtopicId,
    });

  if (insertError) {
    throw insertError;
  }
}

export async function removeConceptSubtopic(
  conceptId: string,
  subtopicId: string,
) {
  const { error } = await supabase
    .from("concept_subtopics")
    .delete()
    .eq("concept_id", conceptId)
    .eq("subtopic_id", subtopicId);

  if (error) {
    throw error;
  }
}
