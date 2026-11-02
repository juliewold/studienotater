import { useEffect, useState } from "react";
import type { ConceptType } from "../../../data/concepts/types";
import { loadNoteSources, type CurriculumWorkspace } from "../../../services/subjects/curriculumWorkspaceService";
import { extractFormulas, notesForUnit, OTHER_UNIT_ID, type CurriculumUnit, type FormulaEntry } from "../../../services/subjects/curriculumContent";

export const conceptTypeLabels: Record<ConceptType, string> = {
  definition: "Definisjon", theorem: "Teorem", formula: "Formel", method: "Metode",
};

export const unitLabel = (unit: CurriculumUnit, configured: boolean) =>
  unit.id === OTHER_UNIT_ID ? "Ikke plassert i pensum" : configured ? `Forelesning ${unit.number ?? ""}`.trim() : "Tema";

export type UnitFormulas = { unit?: CurriculumUnit; formulas: FormulaEntry[] };

/** All block formulas in the subject's notes, grouped by pensum unit. Each
 * formula appears once, in the first unit whose notes contain it. */
export function useSubjectFormulas(workspace: CurriculumWorkspace | null) {
  const [groups, setGroups] = useState<UnitFormulas[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!workspace) return;
    let cancelled = false;
    loadNoteSources(workspace.notes).then(sources => {
      if (cancelled) return;
      const byId = new Map(sources.map(source => [source.id, source]));
      const seen = new Set<string>();
      const placed = new Set<string>();
      const take = (formulas: FormulaEntry[]) => formulas.filter(formula => !seen.has(formula.key) && seen.add(formula.key));
      const result: UnitFormulas[] = workspace.units.map(unit => {
        const notes = notesForUnit(unit, workspace.notes, workspace.noteLinks);
        notes.forEach(note => placed.add(note.id));
        return { unit, formulas: take(extractFormulas(notes.flatMap(note => byId.get(note.id) ?? []), workspace.concepts)) };
      });
      const rest = sources.filter(source => !placed.has(source.id));
      result.push({ formulas: take(extractFormulas(rest, workspace.concepts)) });
      setGroups(result);
    }).catch(loadError => {
      console.error("Kunne ikke hente formler:", loadError);
      if (!cancelled) setError("Kunne ikke hente formlene fra notatene.");
    });
    return () => { cancelled = true; };
  }, [workspace]);
  return { groups, error };
}
