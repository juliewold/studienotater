import { getNotesBySubject } from "../notes/notesService";
import { getTopicsBySubject } from "../subjects/subjectStructureService";
import { extractConceptCandidates } from "./conceptExtractionService";
import { createConcept } from "./conceptService";
import { addConceptSubtopic } from "./conceptSubtopicsService";
import { generateAndSaveSubjectStructure } from "./subjectStructureGenerationService";

export type KnowledgeBaseGenerationResult = {
  topicsCreated: number;
  subtopicsCreated: number;
  notesOrganized: number;
  processedNotes: number;
  skippedNotes: number;
  conceptsProcessed: number;
  linkedConcepts: number;
};

export async function generateKnowledgeBaseForSubject(
  subjectId: string,
  subjectName: string,
): Promise<KnowledgeBaseGenerationResult> {
  const existingTopics = await getTopicsBySubject(subjectId);

  let topicsCreated = 0;
  let subtopicsCreated = 0;
  let notesOrganized = 0;

  if (existingTopics.length === 0) {
    const structureResult = await generateAndSaveSubjectStructure(
      subjectId,
      subjectName,
    );

    topicsCreated = structureResult.topicsCreated;
    subtopicsCreated = structureResult.subtopicsCreated;
    notesOrganized = structureResult.notesOrganized;
  }

  const notes = await getNotesBySubject(subjectId);

  let processedNotes = 0;
  let skippedNotes = 0;
  let conceptsProcessed = 0;
  let linkedConcepts = 0;

  for (const note of notes) {
    if (!note.content.trim() || !note.subtopicId) {
      skippedNotes += 1;
      continue;
    }

    const candidates = await extractConceptCandidates(note.content);

    for (const candidate of candidates) {
      const concept = await createConcept(
        candidate.name,
        candidate.type,
        candidate.shortDefinition,
        candidate.explanation,
      );

      conceptsProcessed += 1;

      await addConceptSubtopic(concept.id, note.subtopicId);

      linkedConcepts += 1;
    }

    processedNotes += 1;
  }

  return {
    topicsCreated,
    subtopicsCreated,
    notesOrganized,
    processedNotes,
    skippedNotes,
    conceptsProcessed,
    linkedConcepts,
  };
}
