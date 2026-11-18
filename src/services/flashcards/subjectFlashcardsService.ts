import { getPlainTextFromNote } from "../concepts/conceptExtractionService";
import { getSubtopicLinksForNotes } from "../notes/noteSubtopicsService";
import { getAllSubtopicsBySubject, getTopicsBySubject } from "../subjects/subjectStructureService";
import { createFlashcard, getFlashcardsBySubject } from "../study/flashcardsService";
import { generateFlashcards, type AvailableFlashcardSubtopic } from "./flashcardGenerationService";
import {
  getFlashcardSourceNotes,
  hashNoteContent,
  markNotesFlashcardsCovered,
  type FlashcardSourceNote,
} from "./noteFlashcardSourceService";

export type NoteNeedingFlashcards = {
  note: FlashcardSourceNote;
  contentHash: string;
};

export type TopicFlashcardStatus = {
  topicId: string;
  topicName: string;
  flashcardCount: number;
  pending: NoteNeedingFlashcards[];
};

export type FlashcardBatchResult = {
  notesProcessed: number;
  cardsSaved: number;
  unplacedCards: number;
  failedNotes: string[];
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/** Notes with text whose current content differs from the content their flashcards came from. */
async function findNotesNeedingFlashcards(notes: FlashcardSourceNote[]): Promise<NoteNeedingFlashcards[]> {
  const result: NoteNeedingFlashcards[] = [];

  for (const note of notes) {
    if (!getPlainTextFromNote(note.content)) {
      continue;
    }

    const contentHash = await hashNoteContent(note.content);

    if (contentHash !== note.flashcardsContentHash) {
      result.push({ note, contentHash });
    }
  }

  return result;
}

export async function loadNotesNeedingFlashcards(subjectId: string): Promise<NoteNeedingFlashcards[]> {
  return findNotesNeedingFlashcards(await getFlashcardSourceNotes(subjectId));
}

/** One row per topic: how many flashcards it has, and which of its notes still need new ones. */
export async function loadTopicFlashcardStatus(subjectId: string): Promise<TopicFlashcardStatus[]> {
  const [topics, subtopics, notes, cards] = await Promise.all([
    getTopicsBySubject(subjectId),
    getAllSubtopicsBySubject(subjectId),
    getFlashcardSourceNotes(subjectId),
    getFlashcardsBySubject(subjectId),
  ]);
  const links = await getSubtopicLinksForNotes(notes.map((note) => note.id));
  const topicBySubtopic = new Map(subtopics.map((subtopic) => [subtopic.id, subtopic.topicId]));
  const pending = await findNotesNeedingFlashcards(notes);

  return topics.map((topic) => {
    const topicIdsOfNote = (note: FlashcardSourceNote) => {
      const subtopicIds = [note.subtopicId, ...links.filter((link) => link.noteId === note.id).map((link) => link.subtopicId)];
      return subtopicIds.map((subtopicId) => subtopicId && topicBySubtopic.get(subtopicId));
    };

    return {
      topicId: topic.id,
      topicName: topic.name,
      flashcardCount: cards.filter((card) => card.topicId === topic.id).length,
      pending: pending.filter((item) => topicIdsOfNote(item.note).includes(topic.id)),
    };
  });
}

/**
 * Creates and saves flashcards for the given notes. There is no review step: the
 * cards are saved directly, and a note counts as done once its cards are saved.
 */
export async function generateAndSaveFlashcardsForNotes(
  subjectId: string,
  pending: NoteNeedingFlashcards[],
): Promise<FlashcardBatchResult> {
  const result: FlashcardBatchResult = { notesProcessed: 0, cardsSaved: 0, unplacedCards: 0, failedNotes: [] };

  if (pending.length === 0) {
    return result;
  }

  const [topics, allSubtopics] = await Promise.all([
    getTopicsBySubject(subjectId),
    getAllSubtopicsBySubject(subjectId),
  ]);
  const options: AvailableFlashcardSubtopic[] = allSubtopics.map((subtopic) => ({
    id: subtopic.id,
    name: subtopic.name,
    topicName: topics.find((topic) => topic.id === subtopic.topicId)?.name ?? "",
  }));

  // One request at a time: the NTNU API allows one parallel request per key.
  for (const { note, contentHash } of pending) {
    try {
      const cards = await generateFlashcards(note.content, options);

      for (const card of cards) {
        // Flashcards are only saved under a tema, so cards the AI could not place are skipped.
        if (!card.subtopicId) {
          result.unplacedCards += 1;
          continue;
        }

        const question = card.question.trim();
        const baseSlug = createSlug(question);

        if (!baseSlug) {
          continue;
        }

        const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

        await createFlashcard(subjectId, card.subtopicId, slug, question, card.answer.trim(), note.id);
        result.cardsSaved += 1;
      }

      await markNotesFlashcardsCovered([{ noteId: note.id, contentHash }]);
      result.notesProcessed += 1;
    } catch (error) {
      console.error(`Kunne ikke lage flashcards for ${note.title}:`, error);
      result.failedNotes.push(note.title);
    }
  }

  return result;
}
