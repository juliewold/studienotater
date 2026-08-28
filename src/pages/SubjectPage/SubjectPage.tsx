import "./SubjectPage.css";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

import { subjects } from "../../data/subjects";
import { SubjectFeatureCard } from "../../components/SubjectFeatureCard/SubjectFeatureCard";
import { useSubjectProgress } from "../../hooks/useSubjectProgress";

const INITIAL_VISIBLE_TOPICS = 4;

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const [visibleTopicCount, setVisibleTopicCount] = useState(
    INITIAL_VISIBLE_TOPICS,
  );

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const { subjectProgress, isLoading, errorMessage } =
    useSubjectProgress(subjectId);

  const visibleTopics = subjectProgress.topicProgress.slice(
    0,
    visibleTopicCount,
  );

  const hasMoreTopics =
    visibleTopicCount < subjectProgress.topicProgress.length;

  if (!subject) {
    return (
      <main className="subject-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="subject-page">
      <Link to="/" className="back-link">
        ← Tilbake til forsiden
      </Link>

      <p className="subject-page-label">Fag</p>

      <h1>{subject.code}</h1>

      <p className="subject-page-name">{subject.name}</p>

      <section className="subject-progress-card">
        <div className="subject-progress-header">
          <div>
            <p className="subject-progress-label">Din progresjon</p>

            <h2>Hvordan du ligger an i faget</h2>
          </div>

          {!isLoading && !errorMessage && (
            <strong className="subject-progress-percentage">
              {subjectProgress.progress} %
            </strong>
          )}
        </div>

        {isLoading ? (
          <p className="subject-progress-status">Laster progresjon...</p>
        ) : errorMessage ? (
          <p className="subject-progress-error">{errorMessage}</p>
        ) : (
          <>
            <div className="subject-progress-bar">
              <div
                className="subject-progress-fill"
                style={{
                  width: `${subjectProgress.progress}%`,
                }}
              />
            </div>

            <div className="subject-progress-summary">
              <p>
                <strong>{subjectProgress.completed}</strong> av{" "}
                <strong>{subjectProgress.total}</strong> ressurser fullført
              </p>

              {subjectProgress.averageRating > 0 && (
                <p>
                  Forståelse:{" "}
                  <span className="subject-progress-stars">
                    {"★".repeat(subjectProgress.averageRating)}
                  </span>
                </p>
              )}
            </div>

            <div className="subject-progress-categories">
              <div className="subject-progress-category">
                <span>Forelesningsnotater</span>

                <strong>
                  {subjectProgress.pdfCompleted} / {subjectProgress.pdfTotal}
                </strong>
              </div>

              <div className="subject-progress-category">
                <span>Notater</span>

                <strong>
                  {subjectProgress.noteCompleted} / {subjectProgress.noteTotal}
                </strong>
              </div>

              <div className="subject-progress-category">
                <span>Videoer</span>

                <strong>
                  {subjectProgress.videoCompleted} /{" "}
                  {subjectProgress.videoTotal}
                </strong>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="subject-features-grid">
        <SubjectFeatureCard
          title="Notater"
          description="Les fagnotater og sammendrag"
          link={`/fag/${subject.id}/notater`}
        />

        <SubjectFeatureCard
          title="Flashcards"
          description="Repeter med flashcards"
          link={`/fag/${subject.id}/flashcards`}
        />

        <SubjectFeatureCard
          title="Oppgaver"
          description="Øv med flervalg og tallsvar"
          link={`/fag/${subject.id}/oppgaver`}
        />

        <SubjectFeatureCard
          title="Videoer"
          description="Se forelesninger og videoer"
          link={`/fag/${subject.id}/videoer`}
        />

        <SubjectFeatureCard
          title="Tidligere eksamener"
          description="Øv med tidligere eksamener"
          link={`/fag/${subject.id}/eksamen`}
        />

        <SubjectFeatureCard
          title="Forelesningsnotater"
          description="Forelesninger, presentasjoner og pensum"
          link={`/fag/${subject.id}/pdfs`}
        />

        <SubjectFeatureCard
          title="Pensum"
          description="Følg pensum og fremdrift"
          link={`/fag/${subject.id}/studieplan`}
        />
      </div>

      {!isLoading &&
        !errorMessage &&
        subjectProgress.topicProgress.length > 0 && (
          <section className="subject-topic-progress">
            <div className="subject-topic-progress-header">
              <div>
                <p className="subject-progress-label">Temaoversikt</p>

                <h2>Progresjon per tema</h2>
              </div>

              <p>Basert på notater, videoer og forelesningsnotater</p>
            </div>

            <div className="subject-topic-progress-list">
              {visibleTopics.map((topic) => (
                <article
                  key={topic.topicId}
                  className="subject-topic-progress-item"
                >
                  <div className="subject-topic-progress-top">
                    <div>
                      <h3>{topic.topicName}</h3>

                      <p>
                        {topic.completed} av {topic.total} ressurser fullført
                      </p>
                    </div>

                    <strong>{topic.progress} %</strong>
                  </div>

                  <div className="subject-topic-progress-bar">
                    <div
                      className="subject-topic-progress-fill"
                      style={{
                        width: `${topic.progress}%`,
                      }}
                    />
                  </div>

                  {topic.averageRating > 0 && (
                    <p className="subject-topic-progress-rating">
                      Forståelse: <span>{"★".repeat(topic.averageRating)}</span>
                    </p>
                  )}
                </article>
              ))}
            </div>

            {subjectProgress.topicProgress.length > INITIAL_VISIBLE_TOPICS && (
              <div className="subject-topic-progress-more">
                <button
                  type="button"
                  className="subject-topic-progress-more-button"
                  aria-label={
                    hasMoreTopics ? "Vis flere temaer" : "Vis færre temaer"
                  }
                  onClick={() => {
                    if (hasMoreTopics) {
                      setVisibleTopicCount(
                        subjectProgress.topicProgress.length,
                      );

                      return;
                    }

                    setVisibleTopicCount(INITIAL_VISIBLE_TOPICS);
                  }}
                >
                  {hasMoreTopics ? (
                    <ChevronDown size={24} />
                  ) : (
                    <ChevronUp size={24} />
                  )}
                </button>
              </div>
            )}
          </section>
        )}
    </main>
  );
};
