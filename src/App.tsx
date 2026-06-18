import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { StatsCard } from "./components/StatsCard";

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
    </>
  );
}

export default App;
