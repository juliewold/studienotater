import "./SubjectPage.css";

import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

import { subjects } from "../../../data/subjects";
import { SubjectFeatureCard } from "../../../components/subjects/SubjectFeatureCard/SubjectFeatureCard";
import { useSubjectProgress } from "../../../hooks/useSubjectProgress";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { generateKnowledgeBaseForSubject } from "../../../services/concepts/knowledgeBaseService";

const INITIAL_VISIBLE_TOPICS = 4;

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const { isAdmin } = useContext(AuthContext);

  const [isGeneratingKnowledgeBase, setIsGeneratingKnowledgeBase] =
    useState(false);

  const [knowledgeBaseMessage, setKnowledgeBaseMessage] = useState<
    string | null
  >(null);

  const [visibleTopicCount, setVisibleTopicCount] = useState(
    INITIAL_VISIBLE_TOPICS,
  );

  const [structureRevision, setStructureRevision] = useState(0);

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  const { subjectProgress, isLoading, errorMessage } =
    useSubjectProgress(subjectId, structureRevision);

  const visibleTopics = subjectProgress.topicProgress.slice(
    0,
    visibleTopicCount,
  );

  const hasMoreTopics =
    visibleTopicCount < subjectProgress.topicProgress.length;

  const handleGenerateKnowledgeBase = async () => {
    if (!subjectId || isGeneratingKnowledgeBase) {
      return;
    }

    const shouldGenerate = window.confirm(
      `Vil du generere kunnskapsbasen for ${subject?.code ?? "dette faget"}? ` +
        "AI kompletterer fagstrukturen og organiserer bare notater uten undertemaplassering eller manuelle undertemakoblinger. " +
        "Deretter analyseres notatene, og begreper, forklaringer og koblinger genereres. " +
        "Eksisterende fagstruktur, begrepsinnhold og manuelle koblinger bevares.",
    );

    if (!shouldGenerate) {
      return;
    }

    setIsGeneratingKnowledgeBase(true);
    setKnowledgeBaseMessage(null);

    try {
      const result = await generateKnowledgeBaseForSubject(
        subjectId,
        subject?.name ?? subjectId,
      );

      setKnowledgeBaseMessage(
        (result.structureStatus === "no-content" ? "Struktursteget ble hoppet over: ingen notater med tekstinnhold. " : "Struktursteget fullført. ") +
          `${result.topicsCreated} temaer og ` +
          `${result.subtopicsCreated} undertemaer opprettet. ` +
          `${result.topicsReused} temaer og ${result.subtopicsReused} undertemaer gjenbrukt. ` +
          `${result.notesOrganized} notater organisert; ${result.notesSkipped} beholdt uendret eller uten tekstinnhold. ` +
          `${result.processedNotes} notater analysert og ` +
          `${result.conceptsProcessed} begreper behandlet. ` +
          `${result.linkedCallouts} definisjons- og teorembokser koblet til begreper. ` +
          `${result.skippedNotes} notater hoppet over. ` +
          (result.failedNotes.length > 0
            ? `Genereringen er ufullstendig: ${result.failedNotes.length} notater ga ugyldige AI-svar etter to forsøk og ble ikke behandlet: ` +
              result.failedNotes.map((note) => note.title).join(", ") +
              ". Prøv disse notatene igjen senere. Eksisterende innhold og koblinger er bevart."
            : ""),
      );
    } catch (error) {
      console.error("Kunne ikke generere kunnskapsbase:", error);

      setKnowledgeBaseMessage(
        (error instanceof Error ? `${error.message} ` : "Genereringen ble avbrutt. ") +
          "Eksisterende begreper og koblinger er bevart. " +
          "Noe nytt innhold kan være lagret før feilen. Du kan prøve igjen.",
      );
    } finally {
      setIsGeneratingKnowledgeBase(false);
      setStructureRevision(value => value + 1);
    }
  };

  if (!subject) {
    return (
      <main className="subject-page site-container">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="subject-page site-container">
      <Link to="/" className="back-link">
        ← Tilbake til forsiden
      </Link>

      <p className="subject-page-label">Fag</p>

      <h1>{subject.code}</h1>

      <p className="subject-page-name">{subject.name}</p>

      {isAdmin && (
        <section className="subject-knowledge-base">
          <div>
            <p className="subject-progress-label">AI-kunnskapsbase</p>
            <h2>Bygg begreper automatisk</h2>
            <p>
              Analyser fagets notater og opprett begreper og forklaringer
              automatisk.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleGenerateKnowledgeBase()}
            disabled={isGeneratingKnowledgeBase}
          >
            {isGeneratingKnowledgeBase
              ? "Genererer kunnskapsbase..."
              : "Generer kunnskapsbase"}
          </button>

          {knowledgeBaseMessage && <p>{knowledgeBaseMessage}</p>}
        </section>
      )}

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
        <SubjectFeatureCard title="Temaer" description="Utforsk temaer, undertemaer og begreper" link={`/fag/${subject.id}/tema`} />
        <SubjectFeatureCard
          title="Notater"
          description="Les fagnotater og sammendrag"
          link={`/fag/${subject.id}/notater`}
        />

        <SubjectFeatureCard
          title="Forelesningsnotater"
          description="Forelesninger, presentasjoner og pensum"
          link={`/fag/${subject.id}/pdfs`}
        />

        <SubjectFeatureCard
          title="Flashcards"
          description="Repeter med flashcards"
          link={`/fag/${subject.id}/flashcards`}
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
          title="Oppgaver"
          description="Øv med flervalg og tallsvar"
          link={`/fag/${subject.id}/oppgaver`}
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
