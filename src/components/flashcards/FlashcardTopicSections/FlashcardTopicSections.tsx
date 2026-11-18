import "./FlashcardTopicSections.css";

import { useContext, useEffect, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  generateAndSaveFlashcardsForNotes,
  loadTopicFlashcardStatus,
  type TopicFlashcardStatus,
} from "../../../services/flashcards/subjectFlashcardsService";
import type { DatabaseFlashcard } from "../../../services/study/flashcardsService";

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
  onStartPractice: (title: string, flashcards: DatabaseFlashcard[]) => void;
};

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

/**
 * One section per tema, in the order of the subject's topics. The generate button
 * sits under the tema title. Admins generate; everyone else sees «Flashcards kommer».
 */
export const FlashcardTopicSections = ({ subjectId, groups, onStartPractice }: FlashcardTopicSectionsProps) => {
  const { isAdmin } = useContext(AuthContext);
  const [topics, setTopics] = useState<TopicFlashcardStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyTopicId, setBusyTopicId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const reload = async () => {
    setTopics(await loadTopicFlashcardStatus(subjectId));
  };

  useEffect(() => {
    let ignore = false;

    loadTopicFlashcardStatus(subjectId)
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

  const handleGenerate = async (topic: TopicFlashcardStatus) => {
    setBusyTopicId(topic.topicId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await generateAndSaveFlashcardsForNotes(subjectId, topic.pending);

      setSuccessMessage(
        `${plural(result.cardsSaved, "flashcard", "flashcards")} lagret i ${topic.topicName} fra ${plural(result.notesProcessed, "notat", "notater")}.` +
          (result.failedNotes.length > 0 ? ` Ingen kort for: ${result.failedNotes.join(", ")}.` : ""),
      );

      await reload();
    } catch (error) {
      console.error("Kunne ikke generere flashcards:", error);

      setErrorMessage(error instanceof Error ? error.message : "Kunne ikke generere flashcards.");
    } finally {
      setBusyTopicId(null);
    }
  };

  if (isLoading) {
    return <p>Laster temaer...</p>;
  }

  if (topics.length === 0) {
    return errorMessage ? <p className="flashcards-error">{errorMessage}</p> : null;
  }

  return (
    <div className="flashcard-topics">
      {errorMessage && <p className="flashcards-error">{errorMessage}</p>}
      {successMessage && <p className="topic-flashcard-success">{successMessage}</p>}

      {topics.map((topic) => {
        const group = groups.find((item) => item.topicId === topic.topicId);
        const cards = group?.subtopics.flatMap((subtopic) => subtopic.flashcards) ?? [];
        const pendingCount = topic.pending.length;
        const isReady = pendingCount === 0 && topic.flashcardCount > 0;

        let status: string;

        if (!isAdmin) {
          status = topic.flashcardCount > 0 ? plural(topic.flashcardCount, "flashcard", "flashcards") : "Flashcards kommer";
        } else if (isReady) {
          status = `Ferdig: ${plural(topic.flashcardCount, "flashcard", "flashcards")}`;
        } else if (pendingCount > 0) {
          status = `${plural(pendingCount, "notat", "notater")} mangler flashcards`;
        } else {
          status = "Ingen notater med innhold ennå";
        }

        return (
          <section key={topic.topicId} className="flashcard-topic-section">
            <div className="flashcard-topic-header">
              <div>
                <p className="flashcard-topic-label">Tema</p>

                <h2>{topic.topicName}</h2>

                <p>{cards.length} kort</p>
              </div>

              {cards.length > 0 && (
                <button
                  type="button"
                  className="flashcard-primary-button"
                  onClick={() => onStartPractice(topic.topicName, cards)}
                >
                  Start øving
                </button>
              )}
            </div>

            <div className="topic-flashcard-action">
              <p className="topic-flashcard-status">{status}</p>

              {isAdmin && pendingCount > 0 && (
                <button
                  type="button"
                  className="topic-flashcard-button"
                  onClick={() => void handleGenerate(topic)}
                  disabled={busyTopicId !== null}
                >
                  {busyTopicId === topic.topicId ? (
                    <>
                      <LoaderCircle size={16} className="topic-flashcard-spinner" />
                      Genererer …
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generer flashcards
                    </>
                  )}
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
