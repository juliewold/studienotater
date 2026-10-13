import { getNoteFoldersBySubject } from "./noteFoldersService";
import { getNotesBySubject, type DatabaseNote } from "./notesService";
import { orderNotesForNavigation } from "./noteOrder";

export const getOrderedNotes = async (subjectId: string): Promise<DatabaseNote[]> => {
  const [folders, notes] = await Promise.all([
    getNoteFoldersBySubject(subjectId), getNotesBySubject(subjectId),
  ]);
  return orderNotesForNavigation(notes, folders);
};
