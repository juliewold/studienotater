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
  InvalidConceptResponseError,
  type ConceptCandidate,
  getPlainTextFromNote,
} from "./conceptExtractionService";
import { createConcept, getConceptsFromDatabase, normalizeConceptName } from "./conceptService";
import { addConceptSubtopic } from "./conceptSubtopicsService";
import { generateAndSaveSubjectStructure } from "./subjectStructureGenerationService";

export type KnowledgeBaseGenerationResult = {
  topicsCreated: number;
  subtopicsCreated: number;
  notesOrganized: number;
  processedNotes: number;
  skippedNotes: number;
  failedNotes: { id: string; title: string }[];
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

  // Concepts are global in the current schema; include definitions to distinguish meanings.
  const existingConcepts = await getConceptsFromDatabase();
  const savedByName = new Map(existingConcepts.map((concept) => [normalizeConceptName(concept.name), concept]));
  const contextByName = new Map(existingConcepts.map(({ name, type, shortDefinition }) =>
    [normalizeConceptName(name), { name, type, shortDefinition }]));

  const availableSubtopics = subtopics.map((subtopic) => ({
    id: subtopic.id,
    name: subtopic.name,
  }));

  let processedNotes = 0;
  let skippedNotes = 0;
  const failedNotes: KnowledgeBaseGenerationResult["failedNotes"] = [];
  let conceptsProcessed = 0;
  let linkedConcepts = 0;
  let linkedCallouts = 0;

  const prepared: { note: (typeof notes)[number]; candidates: ConceptCandidate[] }[] = [];

  // Finish extraction before writing. Exhausted validation failures are reported
  // per note; unexpected/service errors still abort before concept/link writes.
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

    let candidates: ConceptCandidate[];
    try {
      candidates = await extractConceptCandidates(text, availableSubtopics, [...contextByName.values()]);
    } catch (error) {
      if (!(error instanceof InvalidConceptResponseError)) throw error;
      skippedNotes += 1;
      failedNotes.push({ id: note.id, title: note.title });
      continue;
    }
    // A name entered on a callout is an explicit editorial choice, even when
    // the AI omits it. Never create a replacement for an already linked box.
    const normalize = normalizeConceptName;
    const names = new Set(candidates.flatMap((candidate) => [candidate.name, candidate.sourceName ?? candidate.name].map(normalize)));
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
    for (const { name, type, shortDefinition } of candidates) {
      const key = normalize(name);
      if (!contextByName.has(key)) contextByName.set(key, { name, type, shortDefinition });
    }

    prepared.push({ note, candidates });
  }

  // Add links without deleting existing/manual links. A failed save can leave
  // partial additions, but never removes the knowledge that was already there.
  for (const { note, candidates } of prepared) {
    const noteConcepts: Concept[] = [];

    for (const candidate of candidates) {
      const key = normalizeConceptName(candidate.name);
      const concept = savedByName.get(key) ?? await createConcept(
        candidate.name,
        candidate.type,
        candidate.shortDefinition,
        candidate.explanation,
        { preserveExisting: true },
      );

      savedByName.set(key, concept);
      conceptsProcessed += 1;
      noteConcepts.push(concept);
      // Alias is local to this note; never rename or overwrite the stored concept.
      if (candidate.sourceName) noteConcepts.push({ ...concept, name: candidate.sourceName });

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
    failedNotes,
    conceptsProcessed,
    linkedConcepts,
    linkedCallouts,
  };
}
