import type { DatabaseNote } from "../services/notes/notesService";
import type { DatabaseSubtopic } from "../services/subjects/subjectStructureService";

export function sortNotesByStructure(
  notes: DatabaseNote[],
  subtopics: DatabaseSubtopic[],
) {
  const subtopicSortOrderById = new Map(
    subtopics.map((subtopic) => [subtopic.id, subtopic.sortOrder]),
  );

  return [...notes].sort((firstNote, secondNote) => {
    const firstSortOrder = firstNote.subtopicId
      ? subtopicSortOrderById.get(firstNote.subtopicId)
      : undefined;

    const secondSortOrder = secondNote.subtopicId
      ? subtopicSortOrderById.get(secondNote.subtopicId)
      : undefined;

    if (firstSortOrder !== undefined && secondSortOrder !== undefined) {
      if (firstSortOrder !== secondSortOrder) {
        return firstSortOrder - secondSortOrder;
      }

      return firstNote.title.localeCompare(secondNote.title, "nb");
    }

    if (firstSortOrder !== undefined) {
      return -1;
    }

    if (secondSortOrder !== undefined) {
      return 1;
    }

    return firstNote.title.localeCompare(secondNote.title, "nb");
  });
}
