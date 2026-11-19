import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./FlashcardsPage.css";
import "./FlashcardFigure.css";
import { MathText } from "../../../components/common/MathText/MathText";
import { FlashcardTopicSections } from "../../../components/flashcards/FlashcardTopicSections/FlashcardTopicSections";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { usePrivateStorageUrl } from "../../../hooks/usePrivateStorageUrl";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";

const shuffleFlashcards = (flashcards: DatabaseFlashcard[]) => {
  const shuffled = [...flashcards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

/** Figure on a flashcard side. Loaded through the private storage hook, so only signed-in users see it. */
const FlashcardFigure = ({ path }: { path: string }) => {
  const image = usePrivateStorageUrl("note-images", path);

  if (image.url) {
    return <img className="flashcard-figure" src={image.url} alt="" />;
  }

  if (image.error) {
    return <span className="flashcard-hint">Kunne ikke vise figuren.</span>;
  }

  return <span className="flashcard-hint">Laster figur …</span>;
};

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

  // Exam sub-tasks, so practice can follow an exam task instead of the curriculum structure.
  const examTaskGroups = useMemo(() => {
    const groups = new Map<string, DatabaseFlashcard[]>();

    flashcards.forEach((flashcard) => {
      if (!flashcard.examTask) return;

      groups.set(flashcard.examTask, [...(groups.get(flashcard.examTask) ?? []), flashcard]);
    });

    return Array.from(groups.entries())
      .map(([label, cards]) => ({ label, flashcards: cards }))
      .sort((first, second) => first.label.localeCompare(second.label, "nb"));
  }, [flashcards]);

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
            <MathText>
              {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
            </MathText>
          </h2>

          {(isFlipped ? currentFlashcard.answerImagePath : currentFlashcard.questionImagePath) && (
            <FlashcardFigure
              key={isFlipped ? currentFlashcard.answerImagePath : currentFlashcard.questionImagePath}
              path={(isFlipped ? currentFlashcard.answerImagePath : currentFlashcard.questionImagePath) as string}
            />
          )}

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

      {isLoadingFlashcards && <LoadingPlaceholder label="Laster flashcards..." />}

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

        </>
      )}

      {!isLoadingFlashcards && !errorMessage && examTaskGroups.length > 0 && (
        <section className="flashcard-exam-tasks">
          <p className="flashcard-topic-label">Eksamensoppgaver</p>

          <h2>Øv på en eksamensoppgave</h2>

          <p className="page-description">Kortene i rekkefølge tilfeldig, slik at du må huske svaret.</p>

          <div className="flashcard-subtopics">
            {examTaskGroups.map((group) => (
              <article key={group.label} className="flashcard-subtopic-card">
                <div>
                  <p className="flashcard-subtopic-label">Oppgave</p>

                  <h3>{group.label}</h3>

                  <span>{group.flashcards.length} kort</span>
                </div>

                <button
                  type="button"
                  className="flashcard-secondary-button"
                  onClick={() => startPractice(group.label, shuffleFlashcards(group.flashcards))}
                >
                  Øv på oppgaven
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {subjectId && (
        <FlashcardTopicSections
          subjectId={subjectId}
          groups={groupedFlashcards}
          onStartPractice={startPractice}
        />
      )}
    </main>
  );
};
