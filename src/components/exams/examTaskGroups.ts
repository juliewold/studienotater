// Grupperer deloppgaver under hovedoppgaven: «1a», «1b» og «1c» blir gruppen «Oppgave 1».
// Rekkefølgen følger relevantTasks. Etiketter uten tall blir egne grupper.

export type ExamTaskGroup = {
  key: string;
  label: string;
  tasks: string[];
};

export function groupExamTasks(tasks: string[]): ExamTaskGroup[] {
  const groups: ExamTaskGroup[] = [];
  const byKey = new Map<string, ExamTaskGroup>();

  for (const task of tasks) {
    const mainNumber = /^(\d+)/.exec(task.trim())?.[1];
    const key = mainNumber ?? task;

    let group = byKey.get(key);

    if (!group) {
      group = {
        key,
        label: mainNumber ? `Oppgave ${mainNumber}` : task,
        tasks: [],
      };

      byKey.set(key, group);
      groups.push(group);
    }

    group.tasks.push(task);
  }

  return groups;
}
