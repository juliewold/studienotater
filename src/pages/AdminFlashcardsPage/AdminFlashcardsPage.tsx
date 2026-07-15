import "./AdminFlashcardsPage.css";
import { subjects } from "../../data/subjects";
import { useAdminFlashcards } from "../../hooks/useAdminFlashcards";

export const AdminFlashcardsPage = () => {
  const {
    subjectId,
    setSubjectId,

    question,
    setQuestion,

    answer,
    setAnswer,

    editingFlashcard,

    uploadedFlashcards,
    isLoadingFlashcards,
    isSaving,
    deletingFlashcardId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  } = useAdminFlashcards();

  const getSubjectLabel = (flashcardSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) =>
        currentSubject.id === flashcardSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : flashcardSubjectId.toUpperCase();
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer flashcards</h1>

      <p className="page-description">
        Opprett, rediger og slett flashcards på nettsiden.
      </p>

      <div className="admin-flashcards-layout">
        <section className="admin-flashcard-card">
          <h2>
            {editingFlashcard
              ? "Rediger flashcard"
              : "Opprett nytt flashcard"}
          </h2>

          <form
            className="admin-flashcard-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="flashcard-subject">Fag</label>

            <select
              id="flashcard-subject"
              value={subjectId}
              onChange={(event) =>
                setSubjectId(event.target.value)
              }
              disabled={Boolean(editingFlashcard)}
              required
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>

            <label htmlFor="flashcard-question">Spørsmål</label>

            <textarea
              id="flashcard-question"
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              rows={5}
              required
            />

            <label htmlFor="flashcard-answer">Svar</label>

            <textarea
              id="flashcard-answer"
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              rows={7}
              required
            />

            {errorMessage && (
              <p className="admin-flashcard-message admin-flashcard-error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="admin-flashcard-message admin-flashcard-success">
                {successMessage}
              </p>
            )}

            <div className="admin-flashcard-form-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Lagrer..."
                  : editingFlashcard
                    ? "Lagre endringer"
                    : "Opprett flashcard"}
              </button>

              {editingFlashcard && (
                <button
                  type="button"
                  className="cancel-flashcard-edit-button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  Avbryt redigering
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-flashcard-card flashcard-preview">
          <p className="preview-label">Forhåndsvisning</p>

          <h2>Spørsmål</h2>
          <p>{question.trim() || "Spørsmålet vises her."}</p>

          <h2>Svar</h2>
          <p>{answer.trim() || "Svaret vises her."}</p>
        </section>
      </div>

      <section className="admin-flashcard-card uploaded-flashcards-section">
        <h2>Opprettede flashcards</h2>

        {isLoadingFlashcards ? (
          <p>Laster flashcards...</p>
        ) : uploadedFlashcards.length === 0 ? (
          <p>
            Ingen flashcards er opprettet gjennom adminpanelet ennå.
          </p>
        ) : (
          <div className="uploaded-flashcard-list">
            {uploadedFlashcards.map((flashcard) => (
              <article
                key={flashcard.id}
                className="uploaded-flashcard-item"
              >
                <div>
                  <h3>{flashcard.question}</h3>
                  <p>{flashcard.answer}</p>
                  <span>
                    {getSubjectLabel(flashcard.subjectId)}
                  </span>
                </div>

                <div className="uploaded-flashcard-actions">
                  <button
                    type="button"
                    className="edit-flashcard-button"
                    onClick={() => handleEdit(flashcard)}
                  >
                    Rediger
                  </button>

                  <button
                    type="button"
                    className="delete-flashcard-button"
                    disabled={
                      deletingFlashcardId === flashcard.id
                    }
                    onClick={() => handleDelete(flashcard)}
                  >
                    {deletingFlashcardId === flashcard.id
                      ? "Sletter..."
                      : "Slett"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};