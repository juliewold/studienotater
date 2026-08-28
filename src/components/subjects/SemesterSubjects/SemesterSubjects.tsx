import "./SemesterSubjects.css";
import { Link } from "react-router-dom";

import { SubjectCard } from "../SubjectCard/SubjectCard";
import { subjects } from "../../../data/subjects";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

export const SemesterSubjects = () => {
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
      year: regularSubject?.year,
      color: regularSubject?.color,
      icon: regularSubject?.icon,
      isCustom:
        semesterSubject.customCode !== null &&
        semesterSubject.customName !== null,
    };
  });

  if (isLoadingSemesterSubjects) {
    return (
      <section className="semester-subjects">
        <p>Laster semesterfag...</p>
      </section>
    );
  }

  return (
    <section className="semester-subjects">
      <div className="semester-subjects-header">
        <h2>Mine fag dette semesteret</h2>

        <Link to="/semesterstart">Administrer fag</Link>
      </div>

      {displaySubjects.length === 0 ? (
        <p>
          Du har ikke valgt fag enda. Gå til Semesterstart for å sette opp
          semesteret ditt.
        </p>
      ) : (
        <div className="semester-subjects-grid">
          {displaySubjects.map((subject) =>
            subject.isCustom ? (
              <article
                key={subject.id}
                className="semester-custom-subject-card"
              >
                <p className="subject-code">{subject.code}</p>
                <h3>{subject.name}</h3>
                <p className="semester-custom-subject-label">Eget fag</p>
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
    </section>
  );
};
