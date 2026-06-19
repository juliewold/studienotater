import "./HomePage.css";
import { Hero } from "../../components/Hero/Hero";
import { StatsCard } from "../../components/StatsCard/StatsCard";
import { ContinueLearning } from "../../components/ContinueLearning/ContinueLearning";
import { YearCard } from "../../components/YearCard/YearCard";
import { SubjectCard } from "../../components/SubjectCard/SubjectCard";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import { flashcards } from "../../data/flashcards";
import { pdfs } from "../../data/pdfs";
import { Footer } from "../../components/Footer/Footer";
// import { HomeProgress } from "../../components/HomeProgress/HomeProgress";
import { SemesterSubjects } from "../../components/SemesterSubjects/SemesterSubjects";

const years = [1, 2, 3, 4, 5];

export const HomePage = () => {
  const firstYearSubjects = subjects.filter((subject) => subject.year === 1);
  const secondYearSubjects = subjects.filter((subject) => subject.year === 2);
  const totalNotes = Object.values(notes).flat().length;
  const totalFlashcards = Object.values(flashcards).flat().length;
  const totalPdfs = Object.values(pdfs).flat().length;
  return (
    <>
      <Hero />

      <section className="stats-grid">
        <StatsCard title="Fag" value={String(subjects.length)} />
        <StatsCard title="Notater" value={String(totalNotes)} />
        <StatsCard title="Flashcards" value={String(totalFlashcards)} />
        <StatsCard title="PDF-er" value={String(totalPdfs)} />
      </section>

      <ContinueLearning />

      <SemesterSubjects />

      {/* <HomeProgress /> */}

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

      <Footer />
    </>
  );
};
