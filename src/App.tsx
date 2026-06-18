import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsCard } from "./components/StatsCard";
import { ContinueLearning } from "./components/ContinueLearning";
import { YearCard } from "./components/YearCard";
import { SubjectCard } from "./components/SubjectCardProps";

const years = [1, 2, 3, 4, 5];

const subjects = [
  {
    code: "TDT4100",
    name: "Objektorientert programmering",
    year: 1,
  },
  {
    code: "TTT4203",
    name: "Analog og digital elektronikk",
    year: 1,
  },
  {
    code: "TMA4100",
    name: "Matematikk 1",
    year: 1,
  },
  {
    code: "ITGK",
    name: "Introduksjon til programmering",
    year: 1,
  },
];

function App() {
  return (
    <>
      <Navbar />
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
        <div className="subjects-grid">
          {subjects.map((subject) => (
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
}

export default App;
