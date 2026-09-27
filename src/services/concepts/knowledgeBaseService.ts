import { getNotesBySubject, updateNoteConceptLinks } from "../notes/notesService";
import type { Concept } from "../../data/concepts/types";
import { linkCalloutsToConcepts } from "./calloutConceptLinkingService";
import { getConceptCallouts } from "./conceptCalloutService";
import {
  getAllSubtopicsBySubject,
  getTopicsBySubject,
} from "../subjects/subjectStructureService";
import {
  extractConceptCandidates,
  type ConceptCandidate,
  getPlainTextFromNote,
} from "./conceptExtractionService";
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
  linkedCallouts: number;
};

export async function generateKnowledgeBaseForSubject(
  subjectId: string,
  subjectName: string,
  options: { noteId?: string } = {},
): Promise<KnowledgeBaseGenerationResult> {
  const existingTopics = await getTopicsBySubject(subjectId);

  let topicsCreated = 0;
  let subtopicsCreated = 0;
  let notesOrganized = 0;

  if (existingTopics.length === 0 && !options.noteId) {
    const structureResult = await generateAndSaveSubjectStructure(
      subjectId,
      subjectName,
    );

    topicsCreated = structureResult.topicsCreated;
    subtopicsCreated = structureResult.subtopicsCreated;
    notesOrganized = structureResult.notesOrganized;
  }

  const subjectNotes = await getNotesBySubject(subjectId);
  const notes = options.noteId
    ? subjectNotes.filter((note) => note.id === options.noteId)
    : subjectNotes;
  if (options.noteId && notes.length === 0) {
    throw new Error("Fant ikke det valgte notatet i faget.");
  }
  const subtopics = await getAllSubtopicsBySubject(subjectId);

  const availableSubtopics = subtopics.map((subtopic) => ({
    id: subtopic.id,
    name: subtopic.name,
  }));

  let processedNotes = 0;
  let skippedNotes = 0;
  let conceptsProcessed = 0;
  let linkedConcepts = 0;
  let linkedCallouts = 0;

  const prepared: { note: (typeof notes)[number]; candidates: ConceptCandidate[] }[] = [];

  // Complete extraction before writing concepts or links. A failed AI call leaves
  // existing knowledge untouched. Structure creation above is a separate step.
  for (const note of notes) {
    if (!note.content.trim() || !note.subtopicId) {
      skippedNotes += 1;
      continue;
    }

    const text = getPlainTextFromNote(note.content);

    if (!text) {
      skippedNotes += 1;
      continue;
    }

    const candidates = await extractConceptCandidates(text, availableSubtopics);
    // A name entered on a callout is an explicit editorial choice, even when
    // the AI omits it. Never create a replacement for an already linked box.
    const normalize = (name: string) => name.trim().toLocaleLowerCase("nb-NO").normalize("NFC");
    const names = new Set(candidates.map((candidate) => normalize(candidate.name)));
    for (const callout of getConceptCallouts(note.contentJson)) {
      if (callout.conceptId || !callout.explanation.trim() || names.has(normalize(callout.name))) continue;
      candidates.push({
        name: callout.name,
        type: callout.type,
        shortDefinition: callout.explanation,
        explanation: callout.explanation,
        subtopicIds: [note.subtopicId],
      });
      names.add(normalize(callout.name));
    }
    prepared.push({ note, candidates });
  }

  // Add links without deleting existing/manual links. A failed save can leave
  // partial additions, but never removes the knowledge that was already there.
  for (const { note, candidates } of prepared) {
    const noteConcepts: Concept[] = [];

    for (const candidate of candidates) {
      const concept = await createConcept(
        candidate.name,
        candidate.type,
        candidate.shortDefinition,
        candidate.explanation,
        { preserveExisting: true },
      );

      conceptsProcessed += 1;
      noteConcepts.push(concept);

      for (const subtopicId of candidate.subtopicIds) {
        await addConceptSubtopic(concept.id, subtopicId);
        linkedConcepts += 1;
      }
    }

    const linkedNote = linkCalloutsToConcepts(note.content, note.contentJson, noteConcepts);
    if (linkedNote.linkedCallouts > 0) {
      await updateNoteConceptLinks(note, linkedNote.content, linkedNote.contentJson);
      linkedCallouts += linkedNote.linkedCallouts;
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
    linkedCallouts,
  };
}
