import "./FlashcardGenerator.css";

import { useState } from "react";
import { Check, LoaderCircle, Save, Sparkles } from "lucide-react";

import {
  generateFlashcards,
  type GeneratedFlashcard,
} from "../../../services/flashcards/flashcardGenerationService";

import { getSubtopicIdsByNote } from "../../../services/notes/noteSubtopicsService";

import { getAllSubtopicsBySubject } from "../../../services/subjects/subjectStructureService";

import { createFlashcard } from "../../../services/study/flashcardsService";

type FlashcardGeneratorProps = {
  noteId: string;
  subjectId: string;
  content: string;
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const FlashcardGenerator = ({
  noteId,
  subjectId,
  content,
}: FlashcardGeneratorProps) => {
  const [flashcards, setFlashcards] = useState<GeneratedFlashcard[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const [linkedSubtopicIds, allSubtopics] = await Promise.all([
        getSubtopicIdsByNote(noteId),
        getAllSubtopicsBySubject(subjectId),
      ]);

      const linkedSubtopics = allSubtopics
        .filter((subtopic) => linkedSubtopicIds.includes(subtopic.id))
        .map((subtopic) => ({
          id: subtopic.id,
          name: subtopic.name,
        }));

      if (linkedSubtopics.length === 0) {
        throw new Error(
          "Notatet må være koblet til minst ett undertema før du kan generere flashcards.",
        );
      }

      const generated = await generateFlashcards(content, linkedSubtopics);

      setFlashcards(generated);
      setSelectedIndexes(generated.map((_, index) => index));
    } catch (error) {
      console.error("Kunne ikke generere flashcards:", error);

      setFlashcards([]);
      setSelectedIndexes([]);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Kunne ikke generere flashcards.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    const selectedFlashcards = flashcards.filter((_, index) =>
      selectedIndexes.includes(index),
    );

    if (selectedFlashcards.length === 0) {
      setErrorMessage("Velg minst ett flashcard du vil lagre.");
      return;
    }

    const invalidFlashcard = selectedFlashcards.find(
      (flashcard) => !flashcard.question.trim() || !flashcard.answer.trim(),
    );

    if (invalidFlashcard) {
      setErrorMessage("Alle valgte flashcards må ha både spørsmål og svar.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      for (const flashcard of selectedFlashcards) {
        const question = flashcard.question.trim();
        const answer = flashcard.answer.trim();

        const baseSlug = createSlug(question);

        if (!baseSlug) {
          throw new Error(
            "Et av flashcardene har et spørsmål som ikke kan brukes.",
          );
        }

        const uniquePart = crypto.randomUUID().slice(0, 8);
        const slug = `${baseSlug}-${uniquePart}`;

        await createFlashcard(
          subjectId,
          flashcard.subtopicId,
          slug,
          question,
          answer,
        );
      }

      setSuccessMessage(
        selectedFlashcards.length === 1
          ? "1 flashcard ble lagret."
          : `${selectedFlashcards.length} flashcards ble lagret.`,
      );

      setFlashcards([]);
      setSelectedIndexes([]);
    } catch (error) {
      console.error("Kunne ikke lagre flashcards:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke lagre flashcards.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFlashcard = (index: number) => {
    setSelectedIndexes((current) =>
      current.includes(index)
        ? current.filter((currentIndex) => currentIndex !== index)
        : [...current, index],
    );

    setSuccessMessage("");
  };

  const updateQuestion = (index: number, question: string) => {
    setFlashcards((current) =>
      current.map((flashcard, currentIndex) =>
        currentIndex === index
          ? {
              ...flashcard,
              question,
            }
          : flashcard,
      ),
    );

    setSuccessMessage("");
  };

  const updateAnswer = (index: number, answer: string) => {
    setFlashcards((current) =>
      current.map((flashcard, currentIndex) =>
        currentIndex === index
          ? {
              ...flashcard,
              answer,
            }
          : flashcard,
      ),
    );

    setSuccessMessage("");
  };

  return (
    <section className="flashcard-generator">
      <div className="flashcard-generator-header">
        <div>
          <h2>Flashcards</h2>

          <p>Lag flashcards automatisk fra dette notatet.</p>
        </div>

        <button
          type="button"
          className="flashcard-generate-button"
          onClick={handleGenerate}
          disabled={isGenerating || isSaving}
        >
          {isGenerating ? (
            <>
              <LoaderCircle size={17} className="flashcard-generator-spinner" />
              Genererer...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Generer flashcards
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <p className="flashcard-generator-error">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="flashcard-generator-success">
          <Check size={17} />
          {successMessage}
        </p>
      )}

      {flashcards.length > 0 && (
        <div className="flashcard-generator-results">
          <div className="flashcard-generator-result-header">
            <p className="flashcard-generator-summary">
              {selectedIndexes.length} av {flashcards.length} valgt
            </p>

            <button
              type="button"
              className="flashcard-save-button"
              onClick={handleSave}
              disabled={isSaving || selectedIndexes.length === 0}
            >
              {isSaving ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="flashcard-generator-spinner"
                  />
                  Lagrer...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Lagre {selectedIndexes.length} flashcards
                </>
              )}
            </button>
          </div>

          {flashcards.map((flashcard, index) => {
            const isSelected = selectedIndexes.includes(index);

            return (
              <article
                key={`${flashcard.subtopicId}-${index}`}
                className={`flashcard-generator-card ${
                  isSelected ? "is-selected" : ""
                }`}
              >
                <label className="flashcard-generator-select">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFlashcard(index)}
                  />
                  Ta med
                </label>

                <label>
                  Spørsmål
                  <textarea
                    value={flashcard.question}
                    onChange={(event) =>
                      updateQuestion(index, event.target.value)
                    }
                    rows={2}
                  />
                </label>

                <label>
                  Svar
                  <textarea
                    value={flashcard.answer}
                    onChange={(event) =>
                      updateAnswer(index, event.target.value)
                    }
                    rows={3}
                  />
                </label>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
