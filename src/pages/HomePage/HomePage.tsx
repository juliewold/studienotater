import "./HomePage.css";
import { useEffect, useState } from "react";
import { Hero } from "../../components/Hero/Hero";
import { StatsCard } from "../../components/StatsCard/StatsCard";
import { ContinueLearning } from "../../components/ContinueLearning/ContinueLearning";
import { YearCard } from "../../components/YearCard/YearCard";
import { subjects } from "../../data/subjects";
import { pdfs } from "../../data/pdfs";
import { getNotesBySubject } from "../../services/notesService";
import { Footer } from "../../components/Footer/Footer";
import { HomeProgress } from "../../components/HomeProgress/HomeProgress";
import { SemesterSubjects } from "../../components/SemesterSubjects/SemesterSubjects";
import { ExamOverview } from "../../components/ExamOverview/ExamOverview";
import { getFlashcardsBySubject } from "../../services/flashcardsService";

const years = [1, 2, 3, 4, 5];

export const HomePage = () => {
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const totalPdfs = Object.values(pdfs).flat().length;

  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true);

      try {
        const [notesBySubject, flashcardsBySubject] = await Promise.all([
          Promise.all(subjects.map((subject) => getNotesBySubject(subject.id))),
          Promise.all(
            subjects.map((subject) => getFlashcardsBySubject(subject.id)),
          ),
        ]);

        setTotalNotes(notesBySubject.flat().length);
        setTotalFlashcards(flashcardsBySubject.flat().length);
      } catch (error) {
        console.error("Kunne ikke hente statistikk:", error);

        setTotalNotes(0);
        setTotalFlashcards(0);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <Hero />

      <section className="stats-grid">
        <StatsCard title="Fag" value={String(subjects.length)} />

        <StatsCard
          title="Notater"
          value={isLoadingStats ? "–" : String(totalNotes)}
        />

        <StatsCard
          title="Flashcards"
          value={isLoadingStats ? "–" : String(totalFlashcards)}
        />

        <StatsCard title="PDF-er" value={String(totalPdfs)} />
      </section>

      <section className="year-section">
        <h2>Klassetrinn</h2>

        <div className="year-grid">
          {years.map((year) => (
            <YearCard key={year} year={year} />
          ))}
        </div>
      </section>

      <ContinueLearning />

      <SemesterSubjects />

      <ExamOverview />

      <HomeProgress />

      <Footer />
    </>
  );
};
