import "./ExamTaskTracker.css";
import { useEffect, useMemo, useState } from "react";
import {
  getExamTaskProgress,
  setExamTaskCompleted,
} from "../../services/examTaskProgressService";

type Props = {
  examId: string;
  tasks: string[];
};

export const ExamTaskTracker = ({ examId, tasks }: Props) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await getExamTaskProgress(examId);

        setCompletedTasks(
          new Set(
            progress
              .filter((task) => task.completed)
              .map((task) => task.taskLabel),
          ),
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadProgress();
  }, [examId]);

  const completedCount = useMemo(
    () => tasks.filter((task) => completedTasks.has(task)).length,
    [tasks, completedTasks],
  );

  const progress =
    tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  const toggleTask = async (task: string) => {
    const isCompleted = completedTasks.has(task);

    const nextCompleted = new Set(completedTasks);

    if (isCompleted) {
      nextCompleted.delete(task);
    } else {
      nextCompleted.add(task);
    }

    setCompletedTasks(nextCompleted);

    await setExamTaskCompleted(examId, task, !isCompleted);
  };

  return (
    <section className="exam-task-tracker">
      <h2>Oppgaver</h2>

      {tasks.map((task) => (
        <label key={task} className="exam-task-item">
          <input
            type="checkbox"
            checked={completedTasks.has(task)}
            onChange={() => toggleTask(task)}
          />
          Oppgave {task}
        </label>
      ))}

      <p className="exam-task-progress">
        {completedCount} / {tasks.length} fullført
      </p>

      <progress value={progress} max={100} />
    </section>
  );
};
