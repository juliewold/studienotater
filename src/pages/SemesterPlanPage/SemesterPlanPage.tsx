import "./SemesterPlanPage.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

export const SemesterPlanPage = () => {
  const { semesterSubjects, isLoadingSemesterSubjects } =
    useSemesterSubjects();

  const selectedSubjects = semesterSubjects.map((semesterSubject) => {
    const existingSubject = subjects.find(
      (subject) => subject.id === semesterSubject.subjectId,
    );

    return {
      id: semesterSubject.subjectId,
      code: semesterSubject.customCode ?? existingSubject?.code ?? "",
      name: semesterSubject.customName ?? existingSubject?.name ?? "",
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
      <p className="page-label">Planlegging</p>

      <h1>Fagplan</h1>

      <p className="page-description">
        Her ser du fagene du har valgt for dette semesteret.
      </p>

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
              <article key={subject.id} className="subject-card">
                <p className="subject-code">{subject.code}</p>
                <h2>{subject.name}</h2>
                <p className="custom-subject-label">Eget fag</p>
              </article>
            ) : (
              <Link
                key={subject.id}
                to={`/fag/${subject.id}`}
                className="subject-card"
              >
                <p className="subject-code">{subject.code}</p>
                <h2>{subject.name}</h2>
                <span className="open-subject">Åpne fag →</span>
              </Link>
            ),
          )}
        </div>
      )}
    </main>
  );
};