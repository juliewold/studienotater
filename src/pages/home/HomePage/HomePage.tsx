import "./HomePage.css";
import { useContext } from "react";
import { useHomeProgress } from "../../../hooks/useHomeProgress";
import { Link } from "react-router-dom";
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
        <main className="logged-out-home site-container">
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
        <main className="home-empty-page site-container">
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

  return <HomeDashboard />;
};

const HomeDashboard = () => {
  const { user } = useContext(AuthContext);
  const progress = useHomeProgress();
  const now = new Date();
  const weekDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  weekDate.setUTCDate(weekDate.getUTCDate() + 4 - (weekDate.getUTCDay() || 7));
  const week = Math.ceil(((weekDate.getTime() - Date.UTC(weekDate.getUTCFullYear(), 0, 1)) / 86400000 + 1) / 7);
  const name = user?.user_metadata?.full_name?.split(" ")[0];
  return <>
    <main className="home-dashboard site-container">
      <header className="dashboard-greeting">
        <div><p className="page-label">DITT STUDIEROM · UKE {week}</p>
          <h1>Hei{name ? `, ${name}` : ""} 👋</h1>
          <p>En ny oversikt. Ett steg videre.</p></div>
        <time dateTime={now.toISOString().slice(0, 10)}>{now.toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}</time>
      </header>
      <div className="dashboard-focus-grid">
        <section className="dashboard-focus">
          <div className="dashboard-focus-intro"><p className="page-label">UKENS FOKUS</p>
            <h2>Finn flyten i fagene dine</h2>
            <p>Nytt innhold og enkle veier videre i studieuken.</p>
            <div className="dashboard-shortcuts"><Link to="/notater">Åpne notater →</Link><Link to="/flashcards">Repeter med flashcards</Link></div>
          </div>
          <WeeklyUpdates />
        </section>
        <UpcomingTasks />
      </div>
      <SemesterSubjects progress={progress.isLoading || progress.resourcesError ? {} : Object.fromEntries(progress.progressSubjects.map(subject => [subject.id, subject.progress]))} />
      <HomeProgress {...progress} />
      <ExamOverview />
    </main>
    <Footer />
  </>;
};
