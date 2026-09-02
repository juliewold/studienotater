import "./HomePage.css";
import { useContext } from "react";
import { BookOpen } from "lucide-react";

import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { useSemesterSubjects } from "../../../hooks/useSemesterSubjects";

import { Footer } from "../../../components/layout/Footer/Footer";
import { HomeProgress } from "../../../components/home/HomeProgress/HomeProgress";
import { SemesterSubjects } from "../../../components/subjects/SemesterSubjects/SemesterSubjects";
import { ExamOverview } from "../../../components/exams/ExamOverview/ExamOverview";
import { WeeklyUpdates } from "../../../components/home/WeeklyUpdates/WeeklyUpdates";
import { UpcomingTasks } from "../../../components/home/UpcomingTasks/UpcomingTasks";

import notePreviewOne from "../../../assets/notat.png";
import notePreviewTwo from "../../../assets/notat-2.png";

export const HomePage = () => {
  const { user, isLoading } = useContext(AuthContext);

  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  if (isLoading || isLoadingSemesterSubjects) {
    return null;
  }

  if (!user) {
    return (
      <>
        <main className="logged-out-home">
          <section className="logged-out-hero">
            <div className="logged-out-hero-content">
              <h1>
                Studer smartere.
                <br />
                Alt samlet på ett sted.
              </h1>

              <p className="logged-out-hero-description">
                Notater, flashcards, videoer, eksamensoppgaver og progresjon –
                organisert etter fag.
              </p>

              <div className="logged-out-hero-actions">
                <a href="#/registrer" className="logged-out-primary-button">
                  Kom i gang
                </a>

                <a href="#/logg-inn" className="logged-out-secondary-button">
                  Logg inn
                </a>
              </div>
            </div>

            <div className="logged-out-note-preview">
              <img
                src={notePreviewTwo}
                alt=""
                className="logged-out-note-image logged-out-note-image-back"
              />

              <img
                src={notePreviewOne}
                alt="Eksempel på studienotater"
                className="logged-out-note-image logged-out-note-image-front"
              />
            </div>
          </section>

          <section className="logged-out-features">
            <div className="logged-out-feature">
              <span className="logged-out-feature-number">01</span>

              <h2>Alt organisert etter fag</h2>

              <p>
                Finn notater, videoer, PDF-er og andre ressurser samlet på ett
                sted for hvert fag.
              </p>
            </div>

            <div className="logged-out-feature">
              <span className="logged-out-feature-number">02</span>

              <h2>Øv til eksamen</h2>

              <p>
                Bruk flashcards, øvingsoppgaver og tidligere eksamener når du
                forbereder deg.
              </p>
            </div>

            <div className="logged-out-feature">
              <span className="logged-out-feature-number">03</span>

              <h2>Hold oversikten</h2>

              <p>
                Følg progresjonen din og få oversikt over fag, studieplan og det
                du skal jobbe med videre.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  if (semesterSubjects.length === 0) {
    return (
      <>
        <main className="home-empty-page">
          <section className="home-empty-state">
            <div className="home-empty-icon">
              <BookOpen size={26} />
            </div>

            <p className="page-label">Kom i gang</p>

            <h1>Sett opp semesteret ditt</h1>

            <p className="home-empty-description">
              Velg fagene du tar dette semesteret for å få ukentlige
              oppdateringer, fremdrift og kommende oppgaver på forsiden.
            </p>

            <a href="#/semesterstart" className="home-empty-button">
              Velg fag
            </a>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <WeeklyUpdates />

      <SemesterSubjects />

      <div className="home-dashboard-grid">
        <div className="home-dashboard-column">
          <UpcomingTasks />
        </div>

        <div className="home-dashboard-column">
          <HomeProgress />
          <ExamOverview />
        </div>
      </div>

      <Footer />
    </>
  );
};
