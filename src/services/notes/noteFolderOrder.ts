import type { NoteFolder } from "./noteFoldersService";

export const sortNoteFolders = (folders: NoteFolder[]) => [...folders].sort((a, b) =>
  (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER) ||
  a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id),
);

export const moveNoteFolder = (folders: NoteFolder[], source: string, target: string) => {
  const ordered = sortNoteFolders(folders);
  const from = ordered.findIndex(folder => folder.id === source);
  const to = ordered.findIndex(folder => folder.id === target);
  if (from < 0 || to < 0 || from === to) return ordered;
  const [folder] = ordered.splice(from, 1);
  ordered.splice(to, 0, folder);
  return ordered.map((item, sortOrder) => ({ ...item, sortOrder }));
};

export const folderToneClass = (folder: NoteFolder) => `notes-folder-tone-${folder.colorIndex ?? 0}`;
