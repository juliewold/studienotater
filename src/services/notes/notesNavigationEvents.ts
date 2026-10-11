// Local invalidation keeps the outline in sync with the existing CRUD services.
export const NOTES_CHANGED = "studienotater:notes-changed";
export const notifyNotesChanged = () => window.dispatchEvent(new Event(NOTES_CHANGED));

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
