import { getNoteFoldersBySubject } from "./noteFoldersService";
import { getNoteMetadataBySubject, type NoteMetadata, getNotesBySubject, type DatabaseNote } from "./notesService";
import { orderNotesForNavigation } from "./noteOrder";

export const getOrderedNotes = async (subjectId: string): Promise<DatabaseNote[]> => {
  const [folders, notes] = await Promise.all([
    getNoteFoldersBySubject(subjectId), getNotesBySubject(subjectId),
  ]);
  return orderNotesForNavigation(notes, folders);
};

/** Metadata-only counterpart for previous/next links. */
export const getOrderedNoteMetadata = async (subjectId: string): Promise<NoteMetadata[]> => {
  const [folders, notes] = await Promise.all([
    getNoteFoldersBySubject(subjectId), getNoteMetadataBySubject(subjectId),
  ]);
  return orderNotesForNavigation(notes, folders);
};
