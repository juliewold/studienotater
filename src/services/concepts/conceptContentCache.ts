import { createConceptContentSession } from "./conceptContentService";
import { NOTES_CHANGED } from "../notes/notesNavigationEvents";
import { CONCEPTS_CHANGED } from "./conceptContentEvents";

let active: { scope: string; session: ReturnType<typeof createConceptContentSession> } | undefined;
export const invalidateConceptContent = () => { active = undefined; };
if (typeof window !== "undefined") {
  window.addEventListener(NOTES_CHANGED, invalidateConceptContent);
  window.addEventListener(CONCEPTS_CHANGED, invalidateConceptContent);
}
export function getConceptContentSession(scope: string) {
  if (!active || active.scope !== scope) active = { scope, session: createConceptContentSession() };
  return active.session;
}
