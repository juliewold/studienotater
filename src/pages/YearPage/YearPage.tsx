import "./YearPage.css";
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";

export const YearPage = () => {
  const { year } = useParams();

  const yearNumber = Number(year);

  const yearSubjects = subjects.filter(
    (subject) => subject.year === yearNumber
  );

  return (
    <main className="page-container">
      <Link to="/" className="back-link">
        ← Tilbake til forsiden
      </Link>

      <p className="page-label">Klassetrinn</p>

      <h1>{yearNumber}. år</h1>

      <div className="year-subjects-grid">
        {yearSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}`}
            className="year-subject-card"
          >
            <p className="subject-code">{subject.code}</p>
            <h3>{subject.name}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
};