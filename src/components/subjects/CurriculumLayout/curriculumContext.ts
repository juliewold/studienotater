import { useOutletContext } from "react-router-dom";
import type { useCurriculumProgress } from "../../../hooks/useCurriculumProgress";
import type { CurriculumWorkspace } from "../../../services/subjects/curriculumWorkspaceService";
import type { CurriculumUnit } from "../../../services/subjects/curriculumContent";

export type CurriculumContext = {
  subjectId: string;
  workspace: CurriculumWorkspace | null;
  isLoading: boolean;
  errorMessage: string;
  progress: ReturnType<typeof useCurriculumProgress>;
};
export const useCurriculum = () => useOutletContext<CurriculumContext>();

export function groupUnitsByPart(units: CurriculumUnit[]) {
  const parts: { name?: string; units: CurriculumUnit[] }[] = [];
  for (const unit of units) {
    const last = parts.at(-1);
    if (last && last.name === unit.part) last.units.push(unit); else parts.push({ name: unit.part, units: [unit] });
  }
  return parts;
}
