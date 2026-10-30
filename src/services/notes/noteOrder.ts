import type { NoteMetadata } from "./notesService";
import type { NoteFolder } from "./noteFoldersService";
import { sortNoteFolders } from "./noteFolderOrder";

export const sortNotes = <T extends NoteMetadata>(notes: T[]) => [...notes].sort((a, b) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER) || a.id.localeCompare(b.id),
);

/** Exactly the sidebar sequence: ordered folders, then unfiled notes. */
export const orderNotesForNavigation = <T extends NoteMetadata>(notes: T[], folders: NoteFolder[]) => {
  const ordered = sortNotes(notes);
  const folderIds = new Set(folders.map(folder => folder.id));
  return [
    ...sortNoteFolders(folders).flatMap(folder => ordered.filter(note => note.folderId === folder.id)),
    ...ordered.filter(note => !note.folderId || !folderIds.has(note.folderId)),
  ];
};

export const moveNoteInOrder = <T extends NoteMetadata>(notes: T[], source: string, target: string) => {
  const ordered = sortNotes(notes);
  const from = ordered.findIndex(note => note.id === source);
  const to = ordered.findIndex(note => note.id === target);
  if (from < 0 || to < 0 || from === to) return ordered;
  const [note] = ordered.splice(from, 1);
  ordered.splice(to, 0, note);
  return ordered.map((item, sortOrder) => ({ ...item, sortOrder }));
};
