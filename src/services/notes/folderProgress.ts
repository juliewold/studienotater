import type { ProgressItem } from "../progress/progressService";
import type { NoteFolder } from "./noteFoldersService";
import type { NoteMetadata } from "./notesService";
import { getFolderDescendantIds } from "./folderTree";

// Reading progress for a folder and everything inside it, subfolders included.
export type FolderProgress = {
  noteCount: number;
  readCount: number;
  ratedCount: number;
  // Average over rated notes only. 0 when no note in the folder is rated.
  averageRating: number;
};

// Same key as the one NotePage and the folder note cards use, so a note's progress
// is shared by every folder that contains it.
export const getNoteResourceId = (subjectId: string, slug: string): string =>
  `note-${subjectId}-database-${slug}`;

export const getFolderProgressById = (
  folders: NoteFolder[],
  notes: NoteMetadata[],
  progressItems: ProgressItem[],
  subjectId: string,
): Record<string, FolderProgress> => {
  const progressByResourceId = new Map<string, ProgressItem>();

  for (const item of progressItems) {
    if (item.itemType === "resource") {
      progressByResourceId.set(item.itemId, item);
    }
  }

  const progressById: Record<string, FolderProgress> = {};

  for (const folder of folders) {
    const folderIds = new Set([folder.id, ...getFolderDescendantIds(folders, folder.id)]);

    let noteCount = 0;
    let readCount = 0;
    let ratedCount = 0;
    let ratingSum = 0;

    for (const note of notes) {
      if (!note.folderId || !folderIds.has(note.folderId)) continue;

      noteCount += 1;

      const progress = progressByResourceId.get(getNoteResourceId(subjectId, note.slug));

      if (!progress) continue;

      if (progress.completed) readCount += 1;

      if (progress.rating > 0) {
        ratedCount += 1;
        ratingSum += progress.rating;
      }
    }

    progressById[folder.id] = {
      noteCount,
      readCount,
      ratedCount,
      averageRating: ratedCount > 0 ? ratingSum / ratedCount : 0,
    };
  }

  return progressById;
};
