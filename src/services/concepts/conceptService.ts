import { supabase } from "../../lib/supabase";
import type { Concept } from "../../data/concepts/types";

type ConceptRow = {
  id: string;
  name: string;
  slug: string;
  type: Concept["type"];
  short_definition: string;
  explanation: string | null;
};

function mapConceptRow(row: ConceptRow): Concept {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    shortDefinition: row.short_definition,
    explanation: row.explanation ?? undefined,
    subjectIds: [],
    relatedConceptIds: [],
  };
}

export async function getConceptsFromDatabase(): Promise<Concept[]> {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, slug, type, short_definition, explanation")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapConceptRow(row as ConceptRow));
}

export async function getConceptByIdFromDatabase(
  conceptId: string,
): Promise<Concept | undefined> {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, slug, type, short_definition, explanation")
    .eq("id", conceptId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapConceptRow(data as ConceptRow) : undefined;
}

export async function getConceptBySlugFromDatabase(
  slug: string,
): Promise<Concept | undefined> {
  const { data, error } = await supabase
    .from("concepts")
    .select("id, name, slug, type, short_definition, explanation")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapConceptRow(data as ConceptRow) : undefined;
}

function createConceptSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getOrCreateConceptFromCallout(
  name: string,
  type: "definition" | "theorem",
  explanation: string,
): Promise<Concept> {
  const trimmedName = name.trim();
  const trimmedExplanation = explanation.trim();
  const slug = createConceptSlug(trimmedName);

  const { data: existingConcept, error: selectError } = await supabase
    .from("concepts")
    .select("id, name, slug, type, short_definition, explanation")
    .eq("slug", slug)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingConcept) {
    return mapConceptRow(existingConcept as ConceptRow);
  }

  const newConcept = {
    id: crypto.randomUUID(),
    name: trimmedName,
    slug,
    type,
    short_definition: trimmedExplanation,
    explanation: trimmedExplanation,
  };

  const { data, error: insertError } = await supabase
    .from("concepts")
    .insert(newConcept)
    .select("id, name, slug, type, short_definition, explanation")
    .single();

  if (insertError) {
    throw insertError;
  }

  return mapConceptRow(data as ConceptRow);
}
