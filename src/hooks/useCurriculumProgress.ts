import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import { getCompletedSyllabusTopics, saveSyllabusTopic } from "../services/progress/progressService";

/** "Gjennomgått" per pensum unit, stored with the existing syllabus progress type. */
export const useCurriculumProgress = (subjectId: string) => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    getCompletedSyllabusTopics(userId, subjectId)
      .then(ids => { if (!cancelled) setCompleted(new Set(ids)); })
      .catch(error => {
        console.error("Kunne ikke hente pensumfremdrift:", error);
        if (!cancelled) setErrorMessage("Kunne ikke hente hva du har gjennomgått.");
      });
    return () => { cancelled = true; };
  }, [userId, subjectId]);

  const toggle = useCallback(async (unitId: string) => {
    if (!userId) return;
    const next = !completed.has(unitId);
    const update = (done: boolean) => setCompleted(current => {
      const copy = new Set(current);
      if (done) copy.add(unitId); else copy.delete(unitId);
      return copy;
    });
    update(next);
    setPending(current => new Set(current).add(unitId));
    setErrorMessage("");
    try {
      await saveSyllabusTopic(userId, subjectId, unitId, next);
    } catch (error) {
      console.error("Kunne ikke lagre pensumfremdrift:", error);
      update(!next);
      setErrorMessage("Kunne ikke lagre endringen. Prøv igjen.");
    } finally {
      setPending(current => { const copy = new Set(current); copy.delete(unitId); return copy; });
    }
  }, [completed, subjectId, userId]);

  return { completed: userId ? completed : new Set<string>(), pending, toggle, errorMessage, canSave: Boolean(userId) };
};
