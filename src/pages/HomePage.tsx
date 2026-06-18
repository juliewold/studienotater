import { Hero } from "../components/Hero";
import { StatsCard } from "../components/StatsCard";
import { ContinueLearning } from "../components/ContinueLearning";
import { YearCard } from "../components/YearCard";
import { SubjectCard } from "../components/SubjectCard";
import { subjects } from "../data/subjects";

const years = [1, 2, 3, 4, 5];

export const HomePage = () => {
  const firstYearSubjects = subjects.filter((subject) => subject.year === 1);
  const secondYearSubjects = subjects.filter((subject) => subject.year === 2);
  return (
    <>
      <Hero />

      <section className="stats-grid">
        <StatsCard title="Fag" value="20" />
        <StatsCard title="Notater" value="8" />
        <StatsCard title="Flashcards" value="5" />
        <StatsCard title="Due i dag" value="22" />
      </section>

      <ContinueLearning />

      <section className="year-section">
        <h2>Klassetrinn</h2>

        <div className="year-grid">
          {years.map((year) => (
            <YearCard key={year} year={year} />
          ))}
        </div>
      </section>

      <section className="subjects-section">
        <h2>Fag</h2>

        <h3>1. år</h3>
        <div className="subjects-grid">
          {firstYearSubjects.map((subject) => (
            <SubjectCard
              key={subject.code}
              code={subject.code}
              name={subject.name}
              year={subject.year}
            />
          ))}
        </div>

        <h3>2. år</h3>
        <div className="subjects-grid">
          {secondYearSubjects.map((subject) => (
            <SubjectCard
              key={subject.code}
              code={subject.code}
              name={subject.name}
              year={subject.year}
            />
          ))}
        </div>
      </section>
    </>
  );
};
