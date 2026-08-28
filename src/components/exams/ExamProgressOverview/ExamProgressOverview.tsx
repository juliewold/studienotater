import "./ExamProgressOverview.css";
import { useEffect, useMemo, useState } from "react";
import type { DatabaseExam } from "../../../services/exams/examsService";
import { getProgressForExams } from "../../../services/exams/examTaskProgressService";

type Props = {
  exams: DatabaseExam[];
};

export const ExamProgressOverview = ({ exams }: Props) => {
  const [completedByExam, setCompletedByExam] = useState<
    Record<string, Set<string>>
  >({});

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await getProgressForExams(
          exams.map((exam) => exam.id),
        );

        const result: Record<string, Set<string>> = {};

        for (const exam of exams) {
          result[exam.id] = new Set(
            (progress[exam.id] ?? [])
              .filter((task) => task.completed)
              .map((task) => task.taskLabel),
          );
        }

        setCompletedByExam(result);
      } catch (error) {
        console.error(
          "Kunne ikke hente eksamensprogresjon:",
          error,
        );
      }
    };

    loadProgress();
  }, [exams]);

  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let completedExams = 0;

    for (const exam of exams) {
      const taskCount = exam.relevantTasks.length;
      const completedTaskLabels =
        completedByExam[exam.id] ?? new Set<string>();

      // Teller bare oppgaver som fortsatt finnes i relevantTasks
      const completedCount = exam.relevantTasks.filter((task) =>
        completedTaskLabels.has(task),
      ).length;

      totalTasks += taskCount;
      completedTasks += completedCount;

      if (taskCount > 0 && completedCount === taskCount) {
        completedExams++;
      }
    }

    return {
      totalTasks,
      completedTasks,
      completedExams,
      totalExams: exams.length,
      percentage:
        totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100),
    };
  }, [completedByExam, exams]);

  return (
    <section className="exam-progress-overview">
      <div className="exam-progress-header">
        <div>
          <p className="exam-progress-label">
            Eksamensprogresjon
          </p>

          <h2>Øving på tidligere eksamener</h2>
        </div>

        <div className="exam-progress-percent">
          {stats.percentage}%
        </div>
      </div>

      <div className="exam-progress-bar">
        <div
          className="exam-progress-fill"
          style={{
            width: `${stats.percentage}%`,
          }}
        />
      </div>

      <div className="exam-progress-grid">
        <div className="exam-progress-card">
          <span className="exam-progress-title">
            Oppgaver
          </span>

          <strong>
            {stats.completedTasks} / {stats.totalTasks}
          </strong>

          <small>Fullførte oppgaver</small>
        </div>

        <div className="exam-progress-card">
          <span className="exam-progress-title">
            Eksamener
          </span>

          <strong>
            {stats.completedExams} / {stats.totalExams}
          </strong>

          <small>Fullførte eksamener</small>
        </div>
      </div>
    </section>
  );
};