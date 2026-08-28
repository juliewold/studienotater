import "./AllNotesPage.css";

import { SubjectCard } from "../../components/SubjectCard/SubjectCard";
import { subjects } from "../../data/subjects";

export const AllNotesPage = () => {
  const subjectsByYear = subjects.reduce<Record<number, typeof subjects>>(
    (groups, subject) => {
      if (!groups[subject.year]) {
        groups[subject.year] = [];
      }

      groups[subject.year].push(subject);

      return groups;
    },
    {},
  );

  const years = Object.keys(subjectsByYear)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <main className="page-container">
      <p className="page-label">Notater</p>

      <h1>Velg fag</h1>

      <p className="all-notes-description">
        Velg et fag for å se mapper og notater.
      </p>

      <div className="all-notes-years">
        {years.map((year) => (
          <section key={year} className="all-notes-year">
            <h2 className="all-notes-year-title">{year}. studieår</h2>

            <div className="all-notes-subject-grid">
              {subjectsByYear[year].map((subject) => (
                <SubjectCard
                  key={subject.id}
                  id={subject.id}
                  code={subject.code}
                  name={subject.name}
                  color={subject.color}
                  icon={subject.icon}
                  to={`/fag/${subject.id}/notater`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
