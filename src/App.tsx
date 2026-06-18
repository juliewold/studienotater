import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsCard } from "./components/StatsCard";
import { ContinueLearning } from "./components/ContinueLearning";
import { YearCard } from "./components/YearCard";

const years = [1, 2, 3, 4, 5];

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
    </>
  );
}

export default App;
