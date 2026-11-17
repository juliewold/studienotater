// Faner og adresser for eksamensvisningen. Holdes utenfor siden, så de kan testes uten React.
export const EXAM_VIEWS = ["exam", "solution", "ipad", "notes"] as const;

export type ExamView = (typeof EXAM_VIEWS)[number];

export const EXAM_VIEW_LABELS: Record<ExamView, string> = {
  exam: "Oppgavesett (PDF)",
  solution: "NTNU løsningsforslag (PDF)",
  ipad: "Mine iPad-løsninger (PDF)",
  notes: "Mine skrevne løsninger",
};

// Ukjent eller manglende fane gir oppgavesettet, som alltid er standardfanen.
export function parseExamView(value: string | undefined): ExamView {
  return (EXAM_VIEWS as readonly string[]).includes(value ?? "") ? (value as ExamView) : "exam";
}

// Valgt deloppgave er bare gyldig hvis den finnes i eksamenens relevantTasks.
export function resolveSelectedTask(task: string | undefined, tasks: readonly string[]): string | null {
  return task && tasks.includes(task) ? task : null;
}

// Deloppgaven følger med i adressen, så den beholdes når man bytter fane.
export function buildExamPath(
  base: { subjectId: string; source: string; examId: string },
  view: ExamView,
  task: string | null,
): string {
  const root = `/fag/${base.subjectId}/eksamen/${base.source}/${base.examId}`;
  return `${root}/${view}${task ? `/${encodeURIComponent(task)}` : ""}`;
}
