import { getNotesBySubject } from "../notes/notesService";
import {
  createSubtopic,
  createTopic,
} from "../subjects/subjectStructureService";
import { updateNoteSubtopic } from "../notes/notesService";

type GeneratedSubtopic = {
  name: string;
  noteIds: string[];
};

type GeneratedTopic = {
  name: string;
  subtopics: GeneratedSubtopic[];
};

type GeneratedSubjectStructure = {
  topics: GeneratedTopic[];
};

type GenerateSubjectStructureResult = {
  topicsCreated: number;
  subtopicsCreated: number;
  notesOrganized: number;
};

async function requestSubjectStructure(
  subjectName: string,
  notes: {
    id: string;
    title: string;
    content: string;
  }[],
): Promise<GeneratedSubjectStructure> {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const response = await fetch(`${apiUrl}/api/concepts/generate-structure/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subjectName,
      notes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate subject structure.");
  }

  return response.json();
}

export async function generateAndSaveSubjectStructure(
  subjectId: string,
  subjectName: string,
): Promise<GenerateSubjectStructureResult> {
  const notes = await getNotesBySubject(subjectId);

  const notesWithContent = notes.filter(
    (note) => note.content.trim().length > 0,
  );

  if (notesWithContent.length === 0) {
    return {
      topicsCreated: 0,
      subtopicsCreated: 0,
      notesOrganized: 0,
    };
  }

  const structure = await requestSubjectStructure(
    subjectName,
    notesWithContent.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
    })),
  );

  let topicsCreated = 0;
  let subtopicsCreated = 0;
  let notesOrganized = 0;

  for (const [topicIndex, generatedTopic] of structure.topics.entries()) {
    const topic = await createTopic(subjectId, generatedTopic.name, topicIndex);

    topicsCreated += 1;

    for (const [
      subtopicIndex,
      generatedSubtopic,
    ] of generatedTopic.subtopics.entries()) {
      const subtopic = await createSubtopic(
        topic.id,
        generatedSubtopic.name,
        subtopicIndex,
      );

      subtopicsCreated += 1;

      for (const noteId of generatedSubtopic.noteIds) {
        const noteExists = notesWithContent.some((note) => note.id === noteId);

        if (!noteExists) {
          continue;
        }

        await updateNoteSubtopic(noteId, subtopic.id);

        notesOrganized += 1;
      }
    }
  }

  return {
    topicsCreated,
    subtopicsCreated,
    notesOrganized,
  };
}
