import { LoadingPlaceholder } from "../../common/LoadingPlaceholder/LoadingPlaceholder";
import "./FlashcardTopicSections.css";

import { useEffect, useState } from "react";

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
 * One section per tema, in the order of the subject's topics. Flashcards are written
 * by hand in the admin editor, so this view only reads them.
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
    <div className="flashcard-topics">
      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}

      {topics.map((topic) => {
        const group = groups.find((item) => item.topicId === topic.id);
        const cards = group?.subtopics.flatMap((subtopic) => subtopic.flashcards) ?? [];

        return (
          <section key={topic.id} className="flashcard-topic-section">
            <div className="flashcard-topic-header">
              <div>
                <p className="flashcard-topic-label">Tema</p>

                <h2>{topic.name}</h2>

                <p>{cards.length === 0 ? "Flashcards kommer" : plural(cards.length, "kort", "kort")}</p>

                {cards.length > 0 && <FlashcardProgressBar counts={countFlashcardLevels(cards, progress)} />}
              </div>

              {cards.length > 0 && (
                <button
                  type="button"
                  className="flashcard-primary-button"
                  onClick={() => onStartPractice(topic.name, cards)}
                >
                  Start øving
                </button>
              )}
            </div>

            {group && (
              <div className="flashcard-subtopics">
                {group.subtopics.map((subtopic) => (
                  <article key={subtopic.subtopicId} className="flashcard-subtopic-card">
                    <div>
                      <p className="flashcard-subtopic-label">Undertema</p>

                      <h3>{subtopic.subtopicName}</h3>

                      <span>{subtopic.flashcards.length} kort</span>
                    </div>

                    <button
                      type="button"
                      className="flashcard-secondary-button"
                      onClick={() => onStartPractice(subtopic.subtopicName, subtopic.flashcards)}
                    >
                      Øv på undertema
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
