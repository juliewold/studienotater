import "./SemesterPlanPage.css";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

import { SubjectCard } from "../../../components/subjects/SubjectCard/SubjectCard";
import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

export const SemesterPlanPage = () => {
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const selectedSubjects = semesterSubjects.map((semesterSubject) => {
    const existingSubject = subjects.find(
      (subject) => subject.id === semesterSubject.subjectId,
    );

    return {
      id: semesterSubject.subjectId,
      code: semesterSubject.customCode ?? existingSubject?.code ?? "",
      name: semesterSubject.customName ?? existingSubject?.name ?? "",
      year: existingSubject?.year,
      color: existingSubject?.color,
      icon: existingSubject?.icon,
      isCustom:
        semesterSubject.customCode !== null &&
        semesterSubject.customName !== null,
    };
  });

  if (isLoadingSemesterSubjects) {
    return (
      <main className="page-container">
        <p>Laster fagplan...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="semester-plan-header">
        <div>
          <p className="page-label">Planlegging</p>

          <h1>Fagplan</h1>

          <p className="page-description">
            Her ser du fagene du har valgt for dette semesteret.
          </p>
        </div>

        {selectedSubjects.length > 0 && (
          <Link to="/semesterstart" className="edit-semester-subjects-button">
            <Pencil size={17} />
            Endre fag
          </Link>
        )}
      </div>

      {selectedSubjects.length === 0 ? (
        <section className="empty-plan">
          <h2>Ingen fag valgt enda</h2>

          <p>
            Gå til Semesterstart for å velge fagene du tar dette semesteret.
          </p>

          <Link to="/semesterstart" className="semester-start-link">
            Velg fag
          </Link>
        </section>
      ) : (
        <div className="subject-grid">
          {selectedSubjects.map((subject) =>
            subject.isCustom ? (
              <article key={subject.id} className="custom-subject-card">
                <p className="subject-code">{subject.code}</p>

                <h2>{subject.name}</h2>

                <p className="custom-subject-label">Eget fag</p>
              </article>
            ) : (
              <SubjectCard
                key={subject.id}
                id={subject.id}
                code={subject.code}
                name={subject.name}
                year={subject.year}
                color={subject.color}
                icon={subject.icon}
              />
            ),
          )}
        </div>
      )}
    </main>
  );
};
