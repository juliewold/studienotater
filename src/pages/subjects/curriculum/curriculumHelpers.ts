import { useEffect, useState } from "react";
import type { ConceptType } from "../../../data/concepts/types";
import { loadNoteSources, type CurriculumWorkspace } from "../../../services/subjects/curriculumWorkspaceService";
import { extractFormulas, notesForUnit, OTHER_UNIT_ID, type CurriculumUnit, type NoteSource } from "../../../services/subjects/curriculumContent";
import { lessonFormulas, loadSubjectLessons } from "../../../data/curriculum/lessons";
import type { FormulaBookStatus } from "../../../data/curriculum/lessons/types";

export const conceptTypeLabels: Record<ConceptType, string> = {
  definition: "Definisjon", theorem: "Teorem", formula: "Formel", method: "Metode",
};

export const unitLabel = (unit: CurriculumUnit, configured: boolean) =>
  unit.id === OTHER_UNIT_ID ? "Ikke plassert i pensum" : configured ? `Forelesning ${unit.number ?? ""}`.trim() : "Tema";

export type FormulaItem = {
  key: string; latex: string; title?: string; description: string;
  source: { label: string; to: string };
  /** From a reviewed lesson, as opposed to a raw note. */
  reviewed: boolean;
  /** Where the formula stands in the allowed formula book. Only set for subjects that have classified their formulas. */
  book?: FormulaBookStatus;
};
export type UnitFormulas = { unit?: CurriculumUnit; reviewed: boolean; formulas: FormulaItem[] };

/** Formulas grouped by pensum unit. Reviewed lessons are the default source; raw
 * note formulas are opt-in, only for units without a lesson, and never fetched otherwise. */
export function useSubjectFormulas(workspace: CurriculumWorkspace | null, includeNotes: boolean) {
  const [result, setResult] = useState<{ includeNotes: boolean; groups: UnitFormulas[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    const base = `/fag/${workspace.subjectId}`;
    (async () => {
      const lessons = new Map((await loadSubjectLessons(workspace.subjectId)).map(lesson => [lesson.unitId, lesson]));
      const pending = includeNotes ? workspace.units.filter(unit => !lessons.has(unit.id)) : [];
      const placed = new Set(workspace.units.flatMap(unit => notesForUnit(unit, workspace.notes, workspace.noteLinks).map(note => note.id)));
      const noteIds = new Set([
        ...pending.flatMap(unit => notesForUnit(unit, workspace.notes, workspace.noteLinks).map(note => note.id)),
        ...(includeNotes ? workspace.notes.filter(note => !placed.has(note.id)).map(note => note.id) : []),
      ]);
      const sources = noteIds.size ? await loadNoteSources(workspace.notes.filter(note => noteIds.has(note.id))) : [];
      const byId = new Map(sources.map(source => [source.id, source]));
      const seen = new Set<string>();
      const take = (formulas: FormulaItem[]) => formulas.filter(formula => !seen.has(formula.key) && seen.add(formula.key));
      const fromNotes = (notes: NoteSource[]) => extractFormulas(notes, workspace.concepts).map(formula => ({
        key: formula.key, latex: formula.latex, title: formula.title, description: formula.description, reviewed: false,
        source: { label: formula.note.title, to: `${base}/notater/${formula.note.slug}` },
      }));
      const groups: UnitFormulas[] = workspace.units.map(unit => {
        const lesson = lessons.get(unit.id);
        if (lesson) return { unit, reviewed: true, formulas: take(lessonFormulas(lesson).map(formula => ({
          key: formula.key, latex: formula.latex, title: formula.name, description: formula.caption ?? "", reviewed: true, book: formula.book,
          source: { label: formula.sectionTitle, to: `${base}/tema/pensum/${unit.id}` },
        }))) };
        const notes = includeNotes ? notesForUnit(unit, workspace.notes, workspace.noteLinks).flatMap(note => byId.get(note.id) ?? []) : [];
        return { unit, reviewed: false, formulas: take(fromNotes(notes)) };
      });
      if (includeNotes) groups.push({ reviewed: false, formulas: take(fromNotes(sources.filter(source => !placed.has(source.id)))) });
      if (!cancelled) { setResult({ includeNotes, groups }); setError(""); }
    })().catch(loadError => {
      console.error("Kunne ikke hente formler:", loadError);
      if (!cancelled) setError("Kunne ikke hente formlene.");
    });
    return () => { cancelled = true; };
  }, [workspace, includeNotes]);
  // While a new selection loads, keep showing nothing stale from the other mode.
  return { groups: result?.includeNotes === includeNotes ? result.groups : null, error };
}
