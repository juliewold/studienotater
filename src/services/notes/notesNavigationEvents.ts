import type { NoteMetadata } from "./notesService";

export type NotesChange = { navigation?: boolean; note?: NoteMetadata };

// Local invalidation keeps the outline in sync with the existing CRUD services.
export const NOTES_CHANGED = "studienotater:notes-changed";
// Saved metadata can update navigation locally; HTML-only changes affect search alone.
export const notifyNotesChanged = (change?: NotesChange) => {
  const event = new Event(NOTES_CHANGED) as Event & { detail?: NotesChange };
  event.detail = change;
  window.dispatchEvent(event);
};

const navigationGuards = new Set<() => Promise<boolean>>();
export const registerNotesNavigationGuard = (guard: () => Promise<boolean>) => {
  navigationGuards.add(guard);
  return () => { navigationGuards.delete(guard); };
};
export const prepareNotesNavigation = async () => {
  for (const guard of [...navigationGuards]) {
    if (!(await guard())) return false;
  }
  return true;
};
