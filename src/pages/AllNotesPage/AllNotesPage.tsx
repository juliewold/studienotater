import "./AllNotesPage.css";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";

export const AllNotesPage = () => {
  return (
    <main className="page-container">
      <p className="page-label">Notater</p>

      <h1>Velg fag</h1>

      <p className="all-notes-description">
        Velg et fag for å se mapper og notater.
      </p>

      <div className="all-notes-subject-grid">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}/notater`}
            className="all-notes-subject-card"
          >
            <p className="subject-code">{subject.code}</p>
            <h2>{subject.name}</h2>

            <p>{subject.year}. studieår</p>
          </Link>
        ))}
      </div>
    </main>
  );
};
