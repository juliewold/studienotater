import { LoadingPlaceholder } from "../../common/LoadingPlaceholder/LoadingPlaceholder";
import "./FlashcardTopicSections.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTopicsBySubject, type DatabaseTopic } from "../../../services/subjects/subjectStructureService";
import type { FlashcardProgress } from "../../../services/study/flashcardProgressService";
import { countFlashcardLevels } from "../../../services/study/flashcardProgressStats";
import type { DatabaseFlashcard } from "../../../services/study/flashcardsService";
import { FlashcardProgressBar } from "../FlashcardProgressBar/FlashcardProgressBar";

export type FlashcardTopicGroup = {
  topicId: string;
  topicName: string;
  subtopics: {
    subtopicId: string;
    subtopicName: string;
    flashcards: DatabaseFlashcard[];
  }[];
};

type FlashcardTopicSectionsProps = {
  subjectId: string;
  groups: FlashcardTopicGroup[];
  progress: Map<string, FlashcardProgress>;
  onStartPractice: (title: string, flashcards: DatabaseFlashcard[]) => void;
};

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

/**
 * One compact row per tema, in the order of the subject's topics. A row with cards opens
 * the tema page, where the subtopics and practice are. Flashcards are written in the admin editor.
 */
export const FlashcardTopicSections = ({ subjectId, groups, progress, onStartPractice }: FlashcardTopicSectionsProps) => {
  const [topics, setTopics] = useState<DatabaseTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    getTopicsBySubject(subjectId)
      .then((result) => {
        if (!ignore) setTopics(result);
      })
      .catch((error) => {
        console.error("Kunne ikke hente temaene:", error);

        if (!ignore) setErrorMessage("Kunne ikke hente temaene.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [subjectId]);

  if (isLoading) {
    return <LoadingPlaceholder label="Laster temaer..." />;
  }

  if (topics.length === 0) {
    return errorMessage ? <p className="flashcards-error">{errorMessage}</p> : null;
  }

  return (
    <div className="flashcard-topic-list">
      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      {topics.map((topic) => {
        const group = groups.find((item) => item.topicId === topic.id);
        const cards = group?.subtopics.flatMap((subtopic) => subtopic.flashcards) ?? [];

        return (
          <div key={topic.id} className={`flashcard-topic-row ${cards.length === 0 ? "flashcard-topic-row-empty" : ""}`}>
            {cards.length > 0 ? (
              <Link to={`/fag/${subjectId}/flashcards/${topic.id}`} className="flashcard-topic-open">
                <div className="flashcard-topic-row-text">
                  <h2>{topic.name}</h2>

                  <p>{plural(cards.length, "kort", "kort")}</p>
                </div>

                <FlashcardProgressBar counts={countFlashcardLevels(cards, progress)} />
              </Link>
            ) : (
              <div className="flashcard-topic-open">
                <div className="flashcard-topic-row-text">
                  <h2>{topic.name}</h2>

                  <p>Flashcards kommer</p>
                </div>
              </div>
            )}

            {cards.length > 0 && (
              <button
                type="button"
                className="flashcard-primary-button flashcard-topic-start"
                onClick={() => onStartPractice(topic.name, cards)}
              >
                Start øving
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
