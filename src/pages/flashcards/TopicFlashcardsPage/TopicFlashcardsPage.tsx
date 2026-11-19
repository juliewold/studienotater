import "../FlashcardsPage/FlashcardsPage.css";
import "../FlashcardsPage/FlashcardFigure.css";
import "./TopicFlashcardsPage.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { PracticeCard } from "../../../components/flashcards/FlashcardPractice/FlashcardPractice";
import { FlashcardProgressBar } from "../../../components/flashcards/FlashcardProgressBar/FlashcardProgressBar";
import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import { useFlashcardRating } from "../../../hooks/useFlashcardRating";
import {
  getFlashcardProgress,
  type FlashcardProgress,
} from "../../../services/study/flashcardProgressService";
import { FlashcardStatusFilter as StatusFilterChips } from "../../../components/flashcards/FlashcardStatusFilter/FlashcardStatusFilter";
import {
  countFlashcardLevels,
  filterFlashcardsByStatus,
  type FlashcardStatusFilter,
} from "../../../services/study/flashcardProgressStats";
import {
  getFlashcardsBySubject,
  type DatabaseFlashcard,
} from "../../../services/study/flashcardsService";
import { getTopicsBySubject } from "../../../services/subjects/subjectStructureService";

export const TopicFlashcardsPage = () => {
  const { subjectId, topicId } = useParams();

  const [topicName, setTopicName] = useState("");
  const [flashcards, setFlashcards] = useState<DatabaseFlashcard[]>([]);
  const [progress, setProgress] = useState<Map<string, FlashcardProgress>>(() => new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<FlashcardStatusFilter>("all");

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

  const { rate, isSaving, errorMessage: ratingError } = useFlashcardRating(progress, handleProgressChange);

  // The cards that match the status filter. Subtopics without matching cards are left out.
  const visibleFlashcards = useMemo(
    () => filterFlashcardsByStatus(flashcards, progress, statusFilter),
    [flashcards, progress, statusFilter],
  );

  // Subtopics inside this tema, in alphabetical order.
  const subtopics = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; flashcards: DatabaseFlashcard[] }>();

    visibleFlashcards.forEach((flashcard) => {
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
  }, [visibleFlashcards]);

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

          {ratingError && <p className="flashcards-error">{ratingError}</p>}

          <StatusFilterChips
            flashcards={flashcards}
            progress={progress}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          {visibleFlashcards.length === 0 && <p>Ingen kort i dette filteret.</p>}

          <div className="flashcard-tema-cards">
            {subtopics.map((subtopic) => (
              <section key={subtopic.id} className="flashcard-tema-group">
                <h3>{subtopic.name}</h3>

                {subtopic.flashcards.map((flashcard) => (
                  <div key={flashcard.id} className="flashcard-tema-item">
                    <PracticeCard
                      flashcard={flashcard}
                      progress={progress.get(flashcard.id)}
                      isSaving={isSaving}
                      onRate={(level) => rate(flashcard.id, level)}
                    />
                  </div>
                ))}
              </section>
            ))}
          </div>
        </>
      )}
    </main>
  );
};
