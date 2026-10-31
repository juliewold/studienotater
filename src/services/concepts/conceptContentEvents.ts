export const CONCEPTS_CHANGED = "studienotater:concepts-changed";
export const notifyConceptsChanged = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONCEPTS_CHANGED));
};
