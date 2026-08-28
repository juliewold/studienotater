import "./HomePage.css";
import { useContext } from "react";

import { AuthContext } from "../../../context/AuthContext/AuthContext";

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

  if (isLoading) {
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

  return (
    <>
      <WeeklyUpdates />

      <SemesterSubjects />

      <div className="home-dashboard-grid">
        <UpcomingTasks />

        <HomeProgress />
      </div>

      <ExamOverview />

      <Footer />
    </>
  );
};
