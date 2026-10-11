import "./SemesterSubjects.css";
import { Link } from "react-router-dom";

import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

export const SemesterSubjects = ({ progress }: { progress: Record<string, number> }) => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const displaySubjects = semesterSubjects.map((semesterSubject) => {
    const regularSubject = subjects.find(
      (subject) => subject.id === semesterSubject.subjectId,
    );

    return {
      id: semesterSubject.subjectId,
      code:
        semesterSubject.customCode ??
        regularSubject?.code ??
        semesterSubject.subjectId.toUpperCase(),
      name: semesterSubject.customName ?? regularSubject?.name ?? "",
      color: regularSubject?.color ?? "default",
      isCustom:
        semesterSubject.customCode !== null &&
        semesterSubject.customName !== null,
    };
  });

  if (isLoadingSemesterSubjects) {
    return (
      <section className="semester-subjects site-container">
        <p>Laster semesterfag...</p>
      </section>
    );
  }

  return (
    <section className="semester-subjects site-container">
      <div className="semester-subjects-header">
        <h2>Mine fag</h2>

        <Link to="/semesterstart">Administrer</Link>
      </div>

      {displaySubjects.length === 0 ? (
        <p className="semester-subjects-empty">
          Du har ikke valgt fag dette semesteret.
        </p>
      ) : (
        <div className="semester-subjects-grid">
          {displaySubjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/fag/${subject.id}`}
              className={`semester-subject-item semester-subject-${subject.color}`}
            >
              <span className="semester-subject-indicator" />

              <div>
                <p className="semester-subject-code">{subject.code}</p>
                <h3>{subject.name}</h3>
                {progress[subject.id] !== undefined && <div className="subject-card-progress">
                  <span>{progress[subject.id]}% fullført</span>
                  <progress aria-label={`Fremdrift i ${subject.code}`} value={progress[subject.id]} max={100} />
                </div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
