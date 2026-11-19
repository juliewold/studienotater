import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./FlashcardsPage.css";
import "./FlashcardFigure.css";
import { FlashcardTopicSections } from "../../../components/flashcards/FlashcardTopicSections/FlashcardTopicSections";
import { FlashcardPractice } from "../../../components/flashcards/FlashcardPractice/FlashcardPractice";
import { FlashcardProgressBar } from "../../../components/flashcards/FlashcardProgressBar/FlashcardProgressBar";
import { countFlashcardLevels } from "../../../services/study/flashcardProgressStats";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getFlashcardProgress,
  type FlashcardProgress,
} from "../../../services/study/flashcardProgressService";
import { orderFlashcardsForPractice } from "../../../services/study/flashcardPracticeOrder";
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

  const [progress, setProgress] = useState<Map<string, FlashcardProgress>>(
    () => new Map(),
  );

  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [practiceSession, setPracticeSession] =
    useState<PracticeSession | null>(null);

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

  useEffect(() => {
    let isCurrent = true;

    getFlashcardProgress()
      .then((loadedProgress) => {
        if (isCurrent) setProgress(loadedProgress);
      })
      .catch((error: unknown) => {
        // Practice still works without progress; ratings just cannot be shown yet.
        console.error("Kunne ikke hente fremdriften:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handleProgressChange = (
    flashcardId: string,
    next: FlashcardProgress | null,
  ) => {
    setProgress((currentProgress) => {
      const updatedProgress = new Map(currentProgress);

      if (next) {
        updatedProgress.set(flashcardId, next);
      } else {
        updatedProgress.delete(flashcardId);
      }

      return updatedProgress;
    });
  };

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
      flashcards: orderFlashcardsForPractice(selectedFlashcards, progress),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const endPractice = () => {
    setPracticeSession(null);
  };

  if (practiceSession) {
    return (
      <FlashcardPractice
        title={practiceSession.title}
        flashcards={practiceSession.flashcards}
        progress={progress}
        onProgressChange={handleProgressChange}
        onExit={endPractice}
      />
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
        <section className="flashcard-subject-progress" aria-label="Fremdrift">
          <FlashcardProgressBar counts={countFlashcardLevels(flashcards, progress)} />

          <p>
            {countFlashcardLevels(flashcards, progress).green} av {flashcards.length} kan godt
          </p>
        </section>
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

          <p className="page-description">Kortene blandes, og de du har vurdert som røde, kommer oftere først.</p>

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
                  onClick={() => startPractice(group.label, group.flashcards)}
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
          progress={progress}
          onStartPractice={startPractice}
        />
      )}
    </main>
  );
};
