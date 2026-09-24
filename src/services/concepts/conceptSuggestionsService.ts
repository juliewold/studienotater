import { supabase } from "../../lib/supabase";

export type ConceptSuggestionStatus = "pending" | "accepted" | "rejected";

import type { ConceptType } from "../../data/concepts/types";

export type ConceptSuggestion = {
  id: string;
  noteId: string;
  name: string;
  type: ConceptType | null;
  shortDefinition: string | null;
  status: ConceptSuggestionStatus;
  createdAt: string;
};

type ConceptSuggestionRow = {
  id: string;
  note_id: string;
  name: string;
  type: ConceptType | null;
  short_definition: string | null;
  status: ConceptSuggestionStatus;
  created_at: string;
};

function mapConceptSuggestion(
  suggestion: ConceptSuggestionRow,
): ConceptSuggestion {
  return {
    id: suggestion.id,
    noteId: suggestion.note_id,
    name: suggestion.name,
    type: suggestion.type,
    shortDefinition: suggestion.short_definition,
    status: suggestion.status,
    createdAt: suggestion.created_at,
  };
}

export async function getConceptSuggestionsByNote(
  noteId: string,
): Promise<ConceptSuggestion[]> {
  const { data, error } = await supabase
    .from("concept_suggestions")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ConceptSuggestionRow[]).map(mapConceptSuggestion);
}

export async function addConceptSuggestion(
  noteId: string,
  name: string,
  type: ConceptType,
  shortDefinition: string,
): Promise<void> {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return;
  }

  const { data: existingSuggestion, error: selectError } = await supabase
    .from("concept_suggestions")
    .select("id")
    .eq("note_id", noteId)
    .eq("name", normalizedName)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingSuggestion) {
    return;
  }

  const { error: insertError } = await supabase
    .from("concept_suggestions")
    .insert({
      note_id: noteId,
      name: normalizedName,
      type,
      short_definition: shortDefinition.trim(),
      status: "pending",
    });

  if (insertError) {
    throw insertError;
  }
}

export async function updateConceptSuggestionStatus(
  suggestionId: string,
  status: ConceptSuggestionStatus,
): Promise<void> {
  const { error } = await supabase
    .from("concept_suggestions")
    .update({
      status,
    })
    .eq("id", suggestionId);

  if (error) {
    throw error;
  }
}

export async function deleteConceptSuggestion(
  suggestionId: string,
): Promise<void> {
  const { error } = await supabase
    .from("concept_suggestions")
    .delete()
    .eq("id", suggestionId);

  if (error) {
    throw error;
  }
}
