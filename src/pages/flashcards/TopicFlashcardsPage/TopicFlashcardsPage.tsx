import "../FlashcardsPage/FlashcardsPage.css";
import "../FlashcardsPage/FlashcardFigure.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { FlashcardPractice } from "../../../components/flashcards/FlashcardPractice/FlashcardPractice";
import { FlashcardProgressBar } from "../../../components/flashcards/FlashcardProgressBar/FlashcardProgressBar";
import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import { MathText } from "../../../components/common/MathText/MathText";
import "./TopicFlashcardsPage.css";
import {
  getFlashcardProgress,
  type FlashcardProgress,
} from "../../../services/study/flashcardProgressService";
import { orderFlashcardsForPractice } from "../../../services/study/flashcardPracticeOrder";
import { countFlashcardLevels } from "../../../services/study/flashcardProgressStats";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";
import { getTopicsBySubject } from "../../../services/subjects/subjectStructureService";

type PracticeSession = {
  title: string;
  flashcards: DatabaseFlashcard[];
};

export const TopicFlashcardsPage = () => {
  const { subjectId, topicId } = useParams();

  const [topicName, setTopicName] = useState("");
  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [progress, setProgress] = useState<Map<string, FlashcardProgress>>(() => new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const load = async () => {
      if (!subjectId || !topicId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const [topics, subjectCards] = await Promise.all([
          getTopicsBySubject(subjectId),
          getFlashcardsBySubject(subjectId),
        ]);

        if (!isCurrent) return;

        setTopicName(topics.find((topic) => topic.id === topicId)?.name ?? "");
        setFlashcards(subjectCards.filter((flashcard) => flashcard.topicId === topicId));
      } catch (error) {
        console.error("Kunne ikke hente flashcards:", error);

        if (isCurrent) setErrorMessage("Kunne ikke hente flashcards.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    load();

    return () => {
      isCurrent = false;
    };
  }, [subjectId, topicId]);

  useEffect(() => {
    let isCurrent = true;

    getFlashcardProgress()
      .then((loadedProgress) => {
        if (isCurrent) setProgress(loadedProgress);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente fremdriften:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Subtopics inside this tema, in alphabetical order, with their cards in the same order.
  const subtopics = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; flashcards: DatabaseFlashcard[] }>();

    flashcards.forEach((flashcard) => {
      const id = flashcard.subtopicId || "without-subtopic";
      const group = groups.get(id) ?? {
        id,
        name: flashcard.subtopicName || "Uten undertema",
        flashcards: [],
      };

      group.flashcards.push(flashcard);
      groups.set(id, group);
    });

    return Array.from(groups.values()).sort((first, second) => first.name.localeCompare(second.name, "nb"));
  }, [flashcards]);

  const handleProgressChange = (flashcardId: string, next: FlashcardProgress | null) => {
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

  const startPractice = (title: string, selectedFlashcards: DatabaseFlashcard[]) => {
    if (selectedFlashcards.length === 0) return;

    setPracticeSession({
      title,
      flashcards: orderFlashcardsForPractice(selectedFlashcards, progress),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (practiceSession) {
    return (
      <FlashcardPractice
        title={practiceSession.title}
        flashcards={practiceSession.flashcards}
        progress={progress}
        onProgressChange={handleProgressChange}
        onExit={() => setPracticeSession(null)}
      />
    );
  }

  const counts = countFlashcardLevels(flashcards, progress);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/flashcards`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Tema</p>

      <h1>{topicName || "Tema"}</h1>

      {isLoading && <LoadingPlaceholder label="Laster flashcards..." />}

      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      {!isLoading && !errorMessage && flashcards.length === 0 && <p>Flashcards kommer.</p>}

      {!isLoading && !errorMessage && flashcards.length > 0 && (
        <>
          <section className="flashcard-subject-progress" aria-label="Fremdrift">
            <FlashcardProgressBar counts={counts} />

            <p>
              {counts.green} av {counts.total} kan godt
            </p>
          </section>

          <section className="flashcard-all-practice-card">
            <div>
              <p className="flashcard-topic-label">Hele tema</p>

              <h2>Øv på alle kort i {topicName}</h2>

              <p>{flashcards.length} kort</p>
            </div>

            <button
              type="button"
              className="flashcard-primary-button"
              onClick={() => startPractice(topicName, flashcards)}
            >
              Start øving
            </button>
          </section>

          <div className="flashcard-tema-cards">
            {subtopics.map((subtopic) => (
              <section key={subtopic.id} className="flashcard-tema-group">
                <h3>{subtopic.name}</h3>

                {subtopic.flashcards.map((flashcard) => (
                  <article key={flashcard.id} className="flashcard-tema-card">
                    <div className="flashcard-tema-question">
                      <MathText>{flashcard.question}</MathText>
                    </div>

                    <div className="flashcard-tema-answer">
                      <MathText>{flashcard.answer}</MathText>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
};
