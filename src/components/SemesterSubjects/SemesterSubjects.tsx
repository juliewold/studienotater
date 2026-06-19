import "./SemesterSubjects.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";

export const SemesterSubjects = () => {
  const savedSubjects = localStorage.getItem("semester-subjects");
  const savedCustomSubjects = localStorage.getItem("custom-subjects");

  const selectedSubjects: string[] = savedSubjects
    ? JSON.parse(savedSubjects)
    : [];

  const customSubjects = savedCustomSubjects
    ? JSON.parse(savedCustomSubjects)
    : [];

  const allSubjects = [
    ...subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
    })),
    ...customSubjects,
  ];

  const semesterSubjects = selectedSubjects
    .map((subjectId) => allSubjects.find((subject) => subject.id === subjectId))
    .filter(Boolean);

  return (
    <section className="semester-subjects">
      <div className="semester-subjects-header">
        <h2>Mine fag dette semesteret</h2>

        <Link to="/semesterstart">Administrer fag</Link>
      </div>

      {semesterSubjects.length === 0 ? (
        <p>
          Du har ikke valgt fag enda. Gå til Semesterstart for å sette opp
          semesteret ditt.
        </p>
      ) : (
        <div className="semester-subjects-grid">
          {semesterSubjects.map((subject) => (
            <Link
              key={subject!.id}
              to={`/fag/${subject!.id}`}
              className="semester-subject-card"
            >
              <p className="subject-code">{subject!.code}</p>
              <h3>{subject!.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
