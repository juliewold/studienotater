import "./SemesterSubjects.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

export const SemesterSubjects = () => {
  const {
    semesterSubjects,
    isLoadingSemesterSubjects,
  } = useSemesterSubjects();

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
      name:
        semesterSubject.customName ??
        regularSubject?.name ??
        "",
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
          {displaySubjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/fag/${subject.id}`}
              className="semester-subject-card"
            >
              <p className="subject-code">{subject.code}</p>
              <h3>{subject.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};