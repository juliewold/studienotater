import type { NoteFolder } from "./noteFoldersService";
import { sortNoteFolders } from "./noteFolderOrder";

// Pure helpers for the folder tree. They work on the already loaded subject folders,
// so navigation and move pickers need no extra database calls.

export type FolderTreeItem = { folder: NoteFolder; depth: number };

export const getChildFolders = (folders: NoteFolder[], parentId: string | null): NoteFolder[] =>
  sortNoteFolders(folders.filter((folder) => folder.parentId === parentId));

// Ancestors from the top level down to the direct parent. The folder itself is not included.
export const getFolderAncestors = (folders: NoteFolder[], folderId: string): NoteFolder[] => {
  const byId = new Map(folders.map((folder) => [folder.id, folder]));
  const path: NoteFolder[] = [];
  const seen = new Set<string>([folderId]);
  let parentId = byId.get(folderId)?.parentId ?? null;

  while (parentId && !seen.has(parentId)) {
    const parent = byId.get(parentId);
    if (!parent) break;
    path.unshift(parent);
    seen.add(parentId);
    parentId = parent.parentId;
  }

  return path;
};

export const getFolderDescendantIds = (folders: NoteFolder[], folderId: string): Set<string> => {
  const descendants = new Set<string>();
  const queue = [folderId];

  while (queue.length > 0) {
    const current = queue.shift() as string;
    for (const folder of folders) {
      if (folder.parentId === current && !descendants.has(folder.id)) {
        descendants.add(folder.id);
        queue.push(folder.id);
      }
    }
  }

  return descendants;
};

// Depth-first list in display order. Excluded folders also hide their subtree.
export const flattenFolderTree = (
  folders: NoteFolder[],
  excludedIds: ReadonlySet<string> = new Set(),
): FolderTreeItem[] => {
  const items: FolderTreeItem[] = [];

  const visit = (parentId: string | null, depth: number, visited: Set<string>) => {
    for (const folder of getChildFolders(folders, parentId)) {
      if (excludedIds.has(folder.id) || visited.has(folder.id)) continue;
      items.push({ folder, depth });
      visit(folder.id, depth + 1, new Set([...visited, folder.id]));
    }
  };

  visit(null, 0, new Set());
  return items;
};

// A folder can go to the top level, or into any folder that is not itself or below itself.
export const canMoveFolder = (
  folders: NoteFolder[],
  folderId: string,
  targetParentId: string | null,
): boolean => {
  if (targetParentId === null) return true;
  if (targetParentId === folderId) return false;
  if (!folders.some((folder) => folder.id === targetParentId)) return false;
  return !getFolderDescendantIds(folders, folderId).has(targetParentId);
};

export const getFolderMoveTargets = (folders: NoteFolder[], folderId: string): FolderTreeItem[] =>
  flattenFolderTree(
    folders,
    new Set([folderId, ...getFolderDescendantIds(folders, folderId)]),
  );
