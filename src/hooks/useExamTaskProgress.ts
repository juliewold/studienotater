import { useCallback, useEffect, useRef, useState } from "react";
import {
  getExamTaskProgress,
  setExamTaskCompleted,
} from "../services/exams/examTaskProgressService";
import {
  progressForExam,
  toggleCompletedTask,
  type LoadedExamProgress,
} from "./examTaskProgressState";

const EMPTY_TASKS: Set<string> = new Set();

// Eier fullført-status for én eksamen. Tilstanden er knyttet til eksamen-ID, så status fra en
// tidligere eksamen aldri vises eller lagres for en annen. Hele siden bruker samme tilstand,
// så en deloppgave har samme status uansett hvilken fane som er åpen.
export function useExamTaskProgress(examId: string) {
  const [loaded, setLoaded] = useState<LoadedExamProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Nyeste lastede tilstand for toggling, så raske klikk ikke bruker en utdatert verdi.
  const loadedRef = useRef<LoadedExamProgress | null>(null);

  const applyCompleted = useCallback((nextExamId: string, next: Set<string>) => {
    loadedRef.current = { examId: nextExamId, completed: next };
    setLoaded({ examId: nextExamId, completed: next });
  }, []);

  useEffect(() => {
    // Eksamenen er ikke lastet ennå. Da finnes det ingen ID å hente fremdrift for.
    if (!examId) return;

    let cancelled = false;

    const loadProgress = async () => {
      setErrorMessage("");

      try {
        const progress = await getExamTaskProgress(examId);

        if (cancelled) return;

        applyCompleted(
          examId,
          new Set(
            progress
              .filter((task) => task.completed)
              .map((task) => task.taskLabel),
          ),
        );
      } catch (error) {
        if (cancelled) return;
        console.error("Kunne ikke hente eksamensfremdrift:", error);
        setErrorMessage("Kunne ikke hente fremdriften.");
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [examId, applyCompleted]);

  const toggleTask = useCallback(
    async (task: string) => {
      const previous = progressForExam(loadedRef.current, examId);

      // Ikke lastet for denne eksamenen ennå: avkrysning ignoreres, så feil status aldri lagres.
      if (!previous) return;

      const shouldComplete = !previous.has(task);
      const next = toggleCompletedTask(previous, task);

      applyCompleted(examId, next);
      setErrorMessage("");

      try {
        await setExamTaskCompleted(examId, task, shouldComplete);
      } catch (error) {
        console.error("Kunne ikke lagre eksamensfremdrift:", error);
        // Tilbake til det som faktisk er lagret.
        applyCompleted(examId, previous);
        setErrorMessage("Kunne ikke lagre fremdriften. Prøv igjen.");
      }
    },
    [examId, applyCompleted],
  );

  const currentProgress = progressForExam(loaded, examId);

  return {
    completedTasks: currentProgress ?? EMPTY_TASKS,
    isLoading: Boolean(examId) && currentProgress === null,
    errorMessage,
    toggleTask,
  };
}
