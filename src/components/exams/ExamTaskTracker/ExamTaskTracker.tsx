import "./ExamTaskTracker.css";
import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { groupExamTasks } from "../examTaskGroups";

type Props = {
  tasks: string[];
  completedTasks: Set<string>;
  selectedTask: string | null;
  onSelectTask: (task: string) => void;
  onToggleTask: (task: string) => void;
};

// Oppgavelisten er kontrollert av eksamenssiden: fullført-status og valgt deloppgave deles med alle faner.
export const ExamTaskTracker = ({
  tasks,
  completedTasks,
  selectedTask,
  onSelectTask,
  onToggleTask,
}: Props) => {
  const groups = useMemo(() => groupExamTasks(tasks), [tasks]);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const completedCount = tasks.filter((task) => completedTasks.has(task)).length;

  const toggleGroup = (key: string) => {
    setCollapsedGroups((current) => {
      const next = new Set(current);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <section className="exam-task-tracker" aria-label="Deloppgaver">
      <h2>Oppgaver</h2>

      {groups.map((group, groupIndex) => {
        const isOpen = !collapsedGroups.has(group.key);
        const groupCompleted = group.tasks.filter((task) => completedTasks.has(task)).length;
        const isGroupDone = groupCompleted === group.tasks.length;
        const listId = `exam-task-group-${groupIndex}`;

        return (
          <div key={group.key} className="exam-task-group">
            <button
              type="button"
              className="exam-task-group-header"
              aria-expanded={isOpen}
              aria-controls={listId}
              onClick={() => toggleGroup(group.key)}
            >
              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`exam-task-group-chevron${isOpen ? " is-open" : ""}`}
              />
              <span className="exam-task-group-label">{group.label}</span>
              <span className={`exam-task-group-count${isGroupDone ? " is-done" : ""}`}>
                {isGroupDone && <Check size={13} aria-hidden="true" />}
                {groupCompleted}/{group.tasks.length}
              </span>
            </button>

            {isOpen && (
              <ul id={listId} className="exam-task-list">
                {group.tasks.map((task) => {
                  const isSelected = selectedTask === task;

                  return (
                    <li key={task} className="exam-task-row">
                      <input
                        type="checkbox"
                        className="exam-task-checkbox"
                        checked={completedTasks.has(task)}
                        onChange={() => onToggleTask(task)}
                        aria-label={`Fullført: oppgave ${task}`}
                      />

                      <button
                        type="button"
                        className="exam-task-select"
                        aria-current={isSelected ? "true" : undefined}
                        onClick={() => onSelectTask(task)}
                      >
                        Oppgave {task}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}

      <p className="exam-task-progress">
        {completedCount} / {tasks.length} fullført
      </p>

      <progress value={tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100} max={100} />
    </section>
  );
};
