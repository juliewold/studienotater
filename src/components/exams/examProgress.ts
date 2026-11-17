// Fremdrift for én eksamen. Teller bare deloppgaver som fortsatt finnes i relevantTasks.
export function summarizeExamProgress(tasks: readonly string[], completed: ReadonlySet<string>) {
  const total = tasks.length;
  const done = tasks.filter((task) => completed.has(task)).length;

  return {
    completed: done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}
