import { supabase } from "../../lib/supabase";
import { normalizeConceptName } from "./conceptService";

export type SourceConcept = { id: string; name: string };
export type SourceNote = { id: string; subject_id: string; title: string; slug: string; content: string | null; sort_order: number };
const pageSize = 500;

export async function getSourceConceptIndex(): Promise<SourceConcept[]> {
  const rows: SourceConcept[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase.from("concepts").select("id, name")
      .order("name").order("id").range(from, from + pageSize - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < pageSize) return rows;
  }
}

const escapeRegex = (value: string) => [...value].map(char => "\\^$.*+?()[]{}|".includes(char) ? "\\" + char : char).join("");

// Enumerate ASCII literally rather than using a collation-dependent SQL range.
const asciiCharacters = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))
  .map(char => "[]\\^-".includes(char) ? "\\" + char : char).join("");
const unicodePattern = `[^${asciiCharacters}[:space:]]`;

/** A permissive prefilter only. The existing DOM resolver remains authoritative.
 * ASCII subsequences allow intervening markup. Entities and non-ASCII text bypass
 * name filtering to preserve entity decoding, Unicode normalization and legacy names.
 */
export function buildSourceNoteFilter(conceptId: string, name: string | undefined, subtopicIds: string[], noteIds: string[], includeGlobal = true) {
  const letters = [...normalizeConceptName(name ?? "")].filter(char => /[a-z0-9]/.test(char)).slice(0, 32);
  const namePattern = letters.length ? letters.join(".*") : ".*";
  const candidates = `${escapeRegex(conceptId)}|${namePattern}|&|${unicodePattern}`;
  const alternatives = includeGlobal ? [
    `and(content.imatch.${JSON.stringify("callout|block-math|&")},content.imatch.${JSON.stringify(candidates)})`,
  ] : [];
  if (subtopicIds.length) alternatives.push(`subtopic_id.in.(${subtopicIds.map(id => JSON.stringify(id)).join(",")})`);
  if (noteIds.length) alternatives.push(`id.in.(${noteIds.map(id => JSON.stringify(id)).join(",")})`);
  return alternatives.join(",");
}

export async function getConceptSourceNotes(conceptId: string, concepts: SourceConcept[], subtopicIds: string[]): Promise<SourceNote[]> {
  const subtopics = [...new Set(subtopicIds)];
  const noteIds = new Set<string>();
  // Secondary note placements complement notes.subtopic_id; neither is exclusive ownership.
  for (let start = 0; start < subtopics.length; start += 100) {
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase.from("note_subtopics").select("note_id")
        .in("subtopic_id", subtopics.slice(start, start + 100))
        .order("note_id").order("subtopic_id").range(from, from + pageSize - 1);
      if (error) break; // Relationship failures must not hide globally discoverable HTML sources.
      for (const row of data ?? []) noteIds.add(row.note_id);
      if (!data || data.length < pageSize) break;
    }
  }
  const secondaryIds = [...noteIds];
  const notes = new Map<string, SourceNote>();
  // Bound URL size; run the global compatibility prefilter once, not for every batch.
  const batches = Math.max(1, Math.ceil(subtopics.length / 100), Math.ceil(secondaryIds.length / 100));
  for (let batch = 0; batch < batches; batch++) {
    const filter = buildSourceNoteFilter(conceptId, concepts.find(concept => concept.id === conceptId)?.name,
      subtopics.slice(batch * 100, batch * 100 + 100), secondaryIds.slice(batch * 100, batch * 100 + 100), batch === 0);
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase.from("notes")
        .select("id, subject_id, title, slug, sort_order, content").or(filter)
        .order("sort_order").order("id").range(from, from + pageSize - 1);
      if (error) throw error;
      for (const note of (data ?? []) as SourceNote[]) notes.set(note.id, note);
      if (!data || data.length < pageSize) break;
    }
  }
  return [...notes.values()].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id));
}
