import "./FlashcardGenerator.css";

import { useCallback, useEffect, useState } from "react";
import { Check, LoaderCircle, Save, Sparkles, Trash2 } from "lucide-react";

import {
  generateFlashcards,
  type GeneratedFlashcard,
  type AvailableFlashcardSubtopic,
} from "../../../services/flashcards/flashcardGenerationService";

import { getAllSubtopicsBySubject, getTopicsBySubject } from "../../../services/subjects/subjectStructureService";

import { createFlashcard } from "../../../services/study/flashcardsService";

import { markNotesFlashcardsCovered } from "../../../services/flashcards/noteFlashcardSourceService";
import {
  loadNotesNeedingFlashcards,
  type NoteNeedingFlashcards,
} from "../../../services/flashcards/subjectFlashcardsService";

type FlashcardGeneratorProps = {
  subjectId: string;
};

type BatchCard = GeneratedFlashcard & {
  id: string;
  noteId: string;
  noteTitle: string;
};

type BatchNote = {
  noteId: string;
  contentHash: string;
  title: string;
};

const createSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

export const FlashcardGenerator = ({ subjectId }: FlashcardGeneratorProps) => {
  const [notesNeedingFlashcards, setNotesNeedingFlashcards] = useState<NoteNeedingFlashcards[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  const [subtopics, setSubtopics] = useState<AvailableFlashcardSubtopic[]>([]);
  const [cards, setCards] = useState<BatchCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Notes whose cards are previewed but not saved. They count as covered only when saved.
  const [batchNotes, setBatchNotes] = useState<BatchNote[]>([]);

  const [progress, setProgress] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const refreshStatus = useCallback(async () => {
    setIsChecking(true);

    try {
      setNotesNeedingFlashcards(await loadNotesNeedingFlashcards(subjectId));
    } catch (error) {
      console.error("Kunne ikke sjekke notatene for flashcards:", error);

      setErrorMessage("Kunne ikke sjekke notatene for flashcards.");
    } finally {
      setIsChecking(false);
    }
  }, [subjectId]);

  useEffect(() => {
    let ignore = false;

    loadNotesNeedingFlashcards(subjectId)
      .then((result) => {
        if (!ignore) setNotesNeedingFlashcards(result);
      })
      .catch((error) => {
        console.error("Kunne ikke sjekke notatene for flashcards:", error);

        if (!ignore) setErrorMessage("Kunne ikke sjekke notatene for flashcards.");
      })
      .finally(() => {
        if (!ignore) setIsChecking(false);
      });

    return () => {
      ignore = true;
    };
  }, [subjectId]);

  // Notes already in the open preview are not generated again until the preview is saved or discarded.
  const notesToGenerate = notesNeedingFlashcards.filter(
    ({ note }) => !batchNotes.some((batchNote) => batchNote.noteId === note.id),
  );

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage("");
    setSuccessMessage("");

    let producedCount = 0;
    const failedTitles: string[] = [];

    try {
      const [topics, allSubtopics] = await Promise.all([
        getTopicsBySubject(subjectId),
        getAllSubtopicsBySubject(subjectId),
      ]);
      const options = allSubtopics.map((subtopic) => ({
        id: subtopic.id,
        name: subtopic.name,
        topicName: topics.find((topic) => topic.id === subtopic.topicId)?.name ?? "",
      }));
      setSubtopics(options);

      // One request at a time: the NTNU API allows one parallel request per key.
      for (const [index, { note, contentHash }] of notesToGenerate.entries()) {
        setProgress(`Lager flashcards ${index + 1} av ${notesToGenerate.length}: ${note.title}`);

        let generated: GeneratedFlashcard[];

        try {
          generated = await generateFlashcards(note.content, options);
        } catch (noteError) {
          // One bad note should not stop the rest of the subject. It stays stale and is reported below.
          console.error(`Kunne ikke lage flashcards for ${note.title}:`, noteError);
          failedTitles.push(note.title);
          continue;
        }

        if (generated.length === 0) {
          // Nothing to review, so the note is up to date now.
          await markNotesFlashcardsCovered([{ noteId: note.id, contentHash }]);
          continue;
        }

        const batch = generated.map((card) => ({
          ...card,
          id: crypto.randomUUID(),
          noteId: note.id,
          noteTitle: note.title,
        }));

        producedCount += batch.length;
        setCards((current) => [...current, ...batch]);
        setSelectedIds((current) => [...current, ...batch.map((card) => card.id)]);
        setBatchNotes((current) => [...current, { noteId: note.id, contentHash, title: note.title }]);
      }

      if (failedTitles.length > 0) {
        setErrorMessage(`Ingen flashcards ble laget for: ${failedTitles.join(", ")}. Prøv disse på nytt senere.`);
      }

      if (producedCount === 0 && failedTitles.length === 0) {
        setSuccessMessage("Ingen av notatene ga grunnlag for nye flashcards.");
      }
    } catch (error) {
      console.error("Kunne ikke generere flashcards:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke generere flashcards.",
      );
    } finally {
      setIsGenerating(false);
      setProgress("");
      await refreshStatus();
    }
  };

  const discardBatch = () => {
    setCards([]);
    setSelectedIds([]);
    setBatchNotes([]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSave = async () => {
    const selectedCards = cards.filter((card) => selectedIds.includes(card.id));

    if (selectedCards.length === 0) {
      setErrorMessage("Velg minst ett flashcard du vil lagre.");
      return;
    }

    const invalidCard = selectedCards.find(
      (card) => !card.question.trim() || !card.answer.trim(),
    );

    if (invalidCard) {
      setErrorMessage("Alle valgte flashcards må ha både spørsmål og svar.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const currentSubtopics = await getAllSubtopicsBySubject(subjectId);

      if (selectedCards.some((card) => !card.subtopicId ||
        !currentSubtopics.some((subtopic) => subtopic.id === card.subtopicId))) {
        throw new Error("Velg et gyldig tema/undertema for alle valgte kort før lagring.");
      }

      for (const card of selectedCards) {
        const question = card.question.trim();
        const answer = card.answer.trim();
        const baseSlug = createSlug(question);

        if (!baseSlug) {
          throw new Error("Et av flashcardene har et spørsmål som ikke kan brukes.");
        }

        const uniquePart = crypto.randomUUID().slice(0, 8);
        const slug = `${baseSlug}-${uniquePart}`;

        await createFlashcard(subjectId, card.subtopicId!, slug, question, answer, card.noteId);

        // Saved cards leave the preview, so a later failure does not save them twice.
        setCards((current) => current.filter((listed) => listed.id !== card.id));
        setSelectedIds((current) => current.filter((id) => id !== card.id));
      }

      await markNotesFlashcardsCovered(
        batchNotes.map(({ noteId, contentHash }) => ({ noteId, contentHash })),
      );

      // Saving closes the review: unchecked cards in the batch are dropped.
      setCards([]);
      setSelectedIds([]);
      setBatchNotes([]);

      setSuccessMessage(
        selectedCards.length === 1
          ? "1 flashcard ble lagret."
          : `${selectedCards.length} flashcards ble lagret.`,
      );
      await refreshStatus();
    } catch (error) {
      console.error("Kunne ikke lagre flashcards:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Kunne ikke lagre flashcards.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCard = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((currentId) => currentId !== id)
        : [...current, id],
    );

    setSuccessMessage("");
  };

  const updateCard = (id: string, changes: Partial<BatchCard>) => {
    setCards((current) =>
      current.map((card) => (card.id === id ? { ...card, ...changes } : card)),
    );

    setSuccessMessage("");
  };

  const hasBatch = cards.length > 0;

  const statusText = isChecking
    ? "Sjekker notatene …"
    : notesToGenerate.length === 0
      ? "Alle notater i faget er oppdatert. Det er ingen nye flashcards å lage."
      : `${plural(notesToGenerate.length, "notat", "notater")} har nytt innhold eller mangler flashcards.`;

  const buttonLabel = isGenerating
    ? progress || "Genererer …"
    : notesToGenerate.length === 0
      ? "Alt er oppdatert"
      : `Generer flashcards for ${plural(notesToGenerate.length, "notat", "notater")}`;

  return (
    <section className="flashcard-generator">
      <div className="flashcard-generator-header">
        <div>
          <h2>Flashcards</h2>

          <p>{statusText}</p>
        </div>

        <button
          type="button"
          className="flashcard-generate-button"
          onClick={handleGenerate}
          disabled={isGenerating || isSaving || isChecking || notesToGenerate.length === 0}
        >
          {isGenerating ? (
            <>
              <LoaderCircle size={17} className="flashcard-generator-spinner" />
              {buttonLabel}
            </>
          ) : (
            <>
              <Sparkles size={17} />
              {buttonLabel}
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

      {hasBatch && (
        <div className="flashcard-generator-results">
          <div className="flashcard-generator-result-header">
            <p className="flashcard-generator-summary">
              {selectedIds.length} av {cards.length} valgt
            </p>

            <div>
              <button
                type="button"
                className="flashcard-generate-button"
                onClick={discardBatch}
                disabled={isSaving || isGenerating}
              >
                <Trash2 size={17} />
                Forkast forslag
              </button>

              <button
                type="button"
                className="flashcard-save-button"
                onClick={handleSave}
                disabled={isSaving || isGenerating || selectedIds.length === 0}
              >
                {isSaving ? (
                  <>
                    <LoaderCircle size={17} className="flashcard-generator-spinner" />
                    Lagrer...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Lagre {selectedIds.length} flashcards
                  </>
                )}
              </button>
            </div>
          </div>

          {cards.map((card) => {
            const isSelected = selectedIds.includes(card.id);

            return (
              <article
                key={card.id}
                className={`flashcard-generator-card ${isSelected ? "is-selected" : ""}`}
              >
                <p className="flashcard-generator-source">Fra: {card.noteTitle}</p>

                <label className="flashcard-generator-select">
                  <input
                    type="checkbox"
                    disabled={isSaving || isGenerating}
                    checked={isSelected}
                    onChange={() => toggleCard(card.id)}
                  />
                  Ta med
                </label>

                <label>
                  Spørsmål
                  <textarea
                    disabled={isSaving || isGenerating}
                    value={card.question}
                    onChange={(event) => updateCard(card.id, { question: event.target.value })}
                    rows={2}
                  />
                </label>

                <label>
                  Svar
                  <textarea
                    disabled={isSaving || isGenerating}
                    value={card.answer}
                    onChange={(event) => updateCard(card.id, { answer: event.target.value })}
                    rows={3}
                  />
                </label>

                <label className="flashcard-generator-placement">
                  Tema / undertema
                  <select
                    value={card.subtopicId ?? ""}
                    disabled={isSaving || isGenerating}
                    onChange={(event) => updateCard(card.id, { subtopicId: event.target.value || null })}
                  >
                    <option value="">Velg plassering før lagring</option>
                    {subtopics.map((subtopic) => (
                      <option key={subtopic.id} value={subtopic.id}>
                        {subtopic.topicName} → {subtopic.name}
                      </option>
                    ))}
                  </select>
                  {subtopics.length === 0 && "Opprett tema/undertema i fagets kunnskapsbase for å lagre kortene."}
                </label>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
