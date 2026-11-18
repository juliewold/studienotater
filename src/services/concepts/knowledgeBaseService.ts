import {
  generateAndSaveSubjectStructure,
  type GenerateSubjectStructureResult,
} from "./subjectStructureGenerationService";

/**
 * «Generer kunnskapsbase» creates topics (temaer) and subtopics from the notes, and places
 * notes that have no subtopic yet. Existing topics are reused, so the Tema pages for TDT4120 stay as the overview.
 */
export async function generateTopicsForSubject(
  subjectId: string,
  subjectName: string,
): Promise<GenerateSubjectStructureResult> {
  return generateAndSaveSubjectStructure(subjectId, subjectName);
}
