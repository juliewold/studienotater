import "./AllPdfsPage.css";

import { SubjectCard } from "../../components/subjects/SubjectCard/SubjectCard";
import { subjects } from "../../data/subjects";

export const AllPdfsPage = () => {
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
      <p className="page-label">PDF-er</p>

      <h1>PDF-er</h1>

      <p className="all-pdfs-description">
        Velg et fag for å se forelesningsnotater, presentasjoner og annet
        materiale.
      </p>

      <div className="all-pdfs-years">
        {years.map((year) => (
          <section key={year} className="all-pdfs-year">
            <h2 className="all-pdfs-year-title">{year}. studieår</h2>

            <div className="all-pdfs-grid">
              {subjectsByYear[year].map((subject) => (
                <SubjectCard
                  key={subject.id}
                  id={subject.id}
                  code={subject.code}
                  name={subject.name}
                  color={subject.color}
                  icon={subject.icon}
                  to={`/fag/${subject.id}/pdfs`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};
