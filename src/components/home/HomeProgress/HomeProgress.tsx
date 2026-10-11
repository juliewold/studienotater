import "./HomeProgress.css";
import { Link } from "react-router-dom";
import type { useHomeProgress } from "../../../hooks/useHomeProgress";

export const HomeProgress = ({ progressSubjects, isLoading, resourcesError }: ReturnType<typeof useHomeProgress>) => {
  if (isLoading) {
    return (
      <section className="home-progress">
        <p>Laster fremdrift...</p>
      </section>
    );
  }

  if (resourcesError) {
    return (
      <section className="home-progress">
        <p>{resourcesError}</p>
      </section>
    );
  }

  if (progressSubjects.length === 0) {
    return null;
  }

  return (
    <section className="home-progress">
      <div className="home-progress-header">
        <h2>Pensumtracker</h2>
      </div>

      <div className="home-progress-list">
        {progressSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}`}
            className={`home-progress-item home-progress-${subject.color}`}
          >
            <div className="home-progress-top">
              <strong>{subject.code}</strong>

              <span>{subject.progress}%</span>
            </div>

            <div className="home-progress-details">
              <span>
                PDF {subject.pdfCompleted}/{subject.pdfTotal}
              </span>

              <span>
                Notater {subject.noteCompleted}/{subject.noteTotal}
              </span>

              <span>
                Videoer {subject.videoCompleted}/{subject.videoTotal}
              </span>
            </div>

            <div className="home-progress-bar">
              <div
                className="home-progress-fill"
                style={{
                  width: `${subject.progress}%`,
                }}
              />
            </div>

            {subject.averageRating > 0 && (
              <p className="home-progress-rating">
                Forståelse: {"★".repeat(subject.averageRating)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};
