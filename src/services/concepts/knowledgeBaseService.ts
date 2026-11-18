import { getTopicsBySubject } from "../subjects/subjectStructureService";
import {
  emptyStructureResult,
  generateAndSaveSubjectStructure,
  type GenerateSubjectStructureResult,
} from "./subjectStructureGenerationService";

/**
 * «Generer kunnskapsbase» creates the topics (temaer) and subtopics from the notes.
 * Topics that already exist, such as the Tema pages for TDT4120, are kept as they are.
 */
export async function generateTopicsForSubject(
  subjectId: string,
  subjectName: string,
): Promise<GenerateSubjectStructureResult> {
  const hasTopics = (await getTopicsBySubject(subjectId)).length > 0;

  if (hasTopics) {
    return emptyStructureResult();
  }

  return generateAndSaveSubjectStructure(subjectId, subjectName);
}
