// Ren logikk for koblinger mellom deloppgaver og notater. Samme regler brukes i visningen og i valglisten.
export type ExamTaskLink = {
  examId: string;
  taskLabel: string;
  noteId: string;
};

// Notatet som er koblet til valgt deloppgave i denne eksamenen, eller null.
export function findLinkedNoteId(
  links: readonly ExamTaskLink[],
  examId: string,
  taskLabel: string | null,
): string | null {
  if (!taskLabel) return null;

  return links.find((link) => link.examId === examId && link.taskLabel === taskLabel)?.noteId ?? null;
}

// Notater som allerede er koblet til en annen deloppgave. Disse kan ikke velges på nytt.
// Notatet som er koblet til valgt deloppgave, regnes ikke med.
export function collectLinkedNoteIdsExcept(
  links: readonly ExamTaskLink[],
  examId: string,
  taskLabel: string | null,
): Set<string> {
  const ids = new Set<string>();

  for (const link of links) {
    if (link.examId === examId && link.taskLabel === taskLabel) continue;
    ids.add(link.noteId);
  }

  return ids;
}
