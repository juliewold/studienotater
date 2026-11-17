// Ren tilstandslogikk for fremdrift. Ingen Supabase-import, så den kan testes direkte.
export type LoadedExamProgress = {
  examId: string;
  completed: Set<string>;
};

// Fremdriften for den eksamenen som vises. Null hvis den ikke er lastet for denne eksamenen.
export function progressForExam(
  loaded: LoadedExamProgress | null,
  examId: string,
): Set<string> | null {
  return loaded && loaded.examId === examId ? loaded.completed : null;
}

// Ny tilstand etter avkrysning. Den gamle mengden endres ikke, så tilbakestilling er trygg.
export function toggleCompletedTask(completed: Set<string>, task: string): Set<string> {
  const next = new Set(completed);

  if (next.has(task)) {
    next.delete(task);
  } else {
    next.add(task);
  }

  return next;
}
