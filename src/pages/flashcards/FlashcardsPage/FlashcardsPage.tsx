import "./FlashcardsPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";

type GroupedSubtopic = {
  subtopicId: string;
  subtopicName: string;
  flashcards: DatabaseFlashcard[];
};

type GroupedTopic = {
  topicId: string;
  topicName: string;
  subtopics: GroupedSubtopic[];
};

type PracticeSession = {
  title: string;
  flashcards: DatabaseFlashcard[];
};

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);

  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [practiceSession, setPracticeSession] =
    useState<PracticeSession | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      if (!subjectId) {
        setFlashcards([]);
        setIsLoadingFlashcards(false);
        return;
      }

      setIsLoadingFlashcards(true);
      setErrorMessage("");

      try {
        const loadedFlashcards = await getFlashcardsBySubject(subjectId);

        setFlashcards(loadedFlashcards);
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);

        setErrorMessage("Kunne ikke hente flashcards.");
      } finally {
        setIsLoadingFlashcards(false);
      }
    };

    loadFlashcards();
  }, [subjectId]);

  const groupedFlashcards = useMemo<GroupedTopic[]>(() => {
    const topics = new Map<
      string,
      {
        topicId: string;
        topicName: string;
        subtopics: Map<
          string,
          {
            subtopicId: string;
            subtopicName: string;
            flashcards: DatabaseFlashcard[];
          }
        >;
      }
    >();

    flashcards.forEach((flashcard) => {
      const topicId = flashcard.topicId || "without-topic";

      const topicName = flashcard.topicName || "Uten tema";

      const subtopicId = flashcard.subtopicId || "without-subtopic";

      const subtopicName = flashcard.subtopicName || "Uten undertema";

      const currentTopic = topics.get(topicId) ?? {
        topicId,
        topicName,
        subtopics: new Map(),
      };

      const currentSubtopic = currentTopic.subtopics.get(subtopicId) ?? {
        subtopicId,
        subtopicName,
        flashcards: [],
      };

      currentSubtopic.flashcards.push(flashcard);

      currentTopic.subtopics.set(subtopicId, currentSubtopic);

      topics.set(topicId, currentTopic);
    });

    return Array.from(topics.values())
      .map((topic) => ({
        topicId: topic.topicId,
        topicName: topic.topicName,
        subtopics: Array.from(topic.subtopics.values())
          .map((subtopic) => ({
            ...subtopic,
            flashcards: [...subtopic.flashcards].sort(
              (firstFlashcard, secondFlashcard) =>
                firstFlashcard.question.localeCompare(
                  secondFlashcard.question,
                  "nb",
                ),
            ),
          }))
          .sort((firstSubtopic, secondSubtopic) =>
            firstSubtopic.subtopicName.localeCompare(
              secondSubtopic.subtopicName,
              "nb",
            ),
          ),
      }))
      .sort((firstTopic, secondTopic) =>
        firstTopic.topicName.localeCompare(secondTopic.topicName, "nb"),
      );
  }, [flashcards]);

  const startPractice = (
    title: string,
    selectedFlashcards: DatabaseFlashcard[],
  ) => {
    if (selectedFlashcards.length === 0) {
      return;
    }

    setPracticeSession({
      title,
      flashcards: selectedFlashcards,
    });

    setCurrentCardIndex(0);
    setIsFlipped(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const endPractice = () => {
    setPracticeSession(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const showPreviousCard = () => {
    setCurrentCardIndex((currentIndex) => Math.max(currentIndex - 1, 0));

    setIsFlipped(false);
  };

  const showNextCard = () => {
    if (!practiceSession) {
      return;
    }

    setCurrentCardIndex((currentIndex) =>
      Math.min(currentIndex + 1, practiceSession.flashcards.length - 1),
    );

    setIsFlipped(false);
  };

  const currentFlashcard = practiceSession?.flashcards[currentCardIndex];

  if (practiceSession && currentFlashcard) {
    const isFirstCard = currentCardIndex === 0;

    const isLastCard =
      currentCardIndex === practiceSession.flashcards.length - 1;

    return (
      <main className="page-container">
        <button
          type="button"
          className="flashcard-end-practice"
          onClick={endPractice}
        >
          ← Avslutt øving
        </button>

        <div className="flashcard-practice-header">
          <div>
            <p className="page-label">Flashcards</p>

            <h1>{practiceSession.title}</h1>
          </div>

          <span className="flashcard-practice-progress">
            {currentCardIndex + 1} av {practiceSession.flashcards.length}
          </span>
        </div>

        <div className="flashcard-progress-track">
          <div
            className="flashcard-progress-bar"
            style={{
              width: `${
                ((currentCardIndex + 1) / practiceSession.flashcards.length) *
                100
              }%`,
            }}
          />
        </div>

        <button
          type="button"
          className={`flashcard-practice-card ${
            isFlipped ? "flashcard-practice-card-flipped" : ""
          }`}
          onClick={() => setIsFlipped((currentValue) => !currentValue)}
          aria-pressed={isFlipped}
        >
          <p className="flashcard-label">{isFlipped ? "Svar" : "Spørsmål"}</p>

          <h2>
            {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
          </h2>

          <span className="flashcard-hint">
            {isFlipped
              ? "Trykk for å vise spørsmålet"
              : "Trykk for å vise svaret"}
          </span>
        </button>

        <div className="flashcard-practice-navigation">
          <button
            type="button"
            className="flashcard-secondary-button"
            onClick={showPreviousCard}
            disabled={isFirstCard}
          >
            ← Forrige
          </button>

          {isLastCard ? (
            <button
              type="button"
              className="flashcard-primary-button"
              onClick={endPractice}
            >
              Fullfør øving
            </button>
          ) : (
            <button
              type="button"
              className="flashcard-primary-button"
              onClick={showNextCard}
            >
              Neste →
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <p className="page-description">Velg hvilke flashcards du vil øve på.</p>

      {isLoadingFlashcards && <p>Laster flashcards...</p>}

      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      {!isLoadingFlashcards && !errorMessage && flashcards.length === 0 && (
        <p>Ingen flashcards er lagt til ennå.</p>
      )}

      {!isLoadingFlashcards && !errorMessage && flashcards.length > 0 && (
        <>
          <section className="flashcard-all-practice-card">
            <div>
              <p className="flashcard-topic-label">Hele faget</p>

              <h2>Øv på alle flashcards i {subjectId?.toUpperCase()}</h2>

              <p>
                {flashcards.length} {flashcards.length === 1 ? "kort" : "kort"}
              </p>
            </div>

            <button
              type="button"
              className="flashcard-primary-button"
              onClick={() =>
                startPractice(
                  subjectId?.toUpperCase() ?? "Hele faget",
                  flashcards,
                )
              }
            >
              Start øving
            </button>
          </section>

          <div className="flashcard-topics">
            {groupedFlashcards.map((topic) => {
              const topicFlashcards = topic.subtopics.flatMap(
                (subtopic) => subtopic.flashcards,
              );

              return (
                <section
                  key={topic.topicId}
                  className="flashcard-topic-section"
                >
                  <div className="flashcard-topic-header">
                    <div>
                      <p className="flashcard-topic-label">Tema</p>

                      <h2>{topic.topicName}</h2>

                      <p>{topicFlashcards.length} kort</p>
                    </div>

                    <button
                      type="button"
                      className="flashcard-primary-button"
                      onClick={() =>
                        startPractice(topic.topicName, topicFlashcards)
                      }
                    >
                      Start øving
                    </button>
                  </div>

                  <div className="flashcard-subtopics">
                    {topic.subtopics.map((subtopic) => (
                      <article
                        key={subtopic.subtopicId}
                        className="flashcard-subtopic-card"
                      >
                        <div>
                          <p className="flashcard-subtopic-label">Undertema</p>

                          <h3>{subtopic.subtopicName}</h3>

                          <span>{subtopic.flashcards.length} kort</span>
                        </div>

                        <button
                          type="button"
                          className="flashcard-secondary-button"
                          onClick={() =>
                            startPractice(
                              subtopic.subtopicName,
                              subtopic.flashcards,
                            )
                          }
                        >
                          Øv på undertema
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
};
