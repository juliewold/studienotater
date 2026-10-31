import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { getConceptContentSession } from "../services/concepts/conceptContentCache";
import { NOTES_CHANGED } from "../services/notes/notesNavigationEvents";
import { CONCEPTS_CHANGED } from "../services/concepts/conceptContentEvents";

export const useConceptContentSession = () => {
  const { user, role } = useContext(AuthContext);
  const [, refresh] = useState(0);
  useEffect(() => {
    const changed = () => refresh(value => value + 1);
    window.addEventListener(NOTES_CHANGED, changed);
    window.addEventListener(CONCEPTS_CHANGED, changed);
    return () => {
      window.removeEventListener(NOTES_CHANGED, changed);
      window.removeEventListener(CONCEPTS_CHANGED, changed);
    };
  }, []);
  return getConceptContentSession(JSON.stringify([user?.id ?? null, role]));
};
