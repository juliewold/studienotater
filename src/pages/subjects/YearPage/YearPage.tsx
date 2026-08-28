import "./YearPage.css";

import { Link, useParams } from "react-router-dom";

import { SubjectCard } from "../../../components/subjects/SubjectCard/SubjectCard";
import { subjects } from "../../../data/subjects";

export const YearPage = () => {
  const { year } = useParams();

  const yearNumber = Number(year);

  const yearSubjects = subjects.filter(
    (subject) => subject.year === yearNumber,
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
          <SubjectCard
            key={subject.id}
            id={subject.id}
            code={subject.code}
            name={subject.name}
            color={subject.color}
            icon={subject.icon}
          />
        ))}
      </div>
    </main>
  );
};
