import "./AdminNotesPage.css";
import { subjects } from "../../data/subjects";
import { useAdminNotes } from "../../hooks/useAdminNotes";

export const AdminNotesPage = () => {
  const {
    subjectId,
    setSubjectId,

    title,
    setTitle,

    description,
    setDescription,

    content,
    setContent,

    editingNote,

    uploadedNotes,
    isLoadingNotes,
    isSaving,
    deletingNoteId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  } = useAdminNotes();

  const getSubjectLabel = (noteSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) => currentSubject.id === noteSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : noteSubjectId.toUpperCase();
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer notater</h1>

      <p className="page-description">
        Opprett, rediger og slett notater på nettsiden.
      </p>

      <div className="admin-notes-layout">
        <section className="admin-note-card">
          <h2>
            {editingNote ? "Rediger notat" : "Opprett nytt notat"}
          </h2>

          <form className="admin-note-form" onSubmit={handleSubmit}>
            <label htmlFor="note-subject">Fag</label>

            <select
              id="note-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              disabled={Boolean(editingNote)}
              required
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>

            {editingNote && (
              <p className="admin-note-help">
                Faget kan ikke endres når et notat redigeres.
              </p>
            )}

            <label htmlFor="note-title">Tittel</label>

            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="For eksempel Mengdelære"
              required
            />

            <label htmlFor="note-description">Beskrivelse</label>

            <input
              id="note-description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Kort beskrivelse av notatet"
              required
            />

            <label htmlFor="note-content">Innhold</label>

            <textarea
              id="note-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Skriv notatet her..."
              rows={18}
              required
            />

            {errorMessage && (
              <p className="admin-note-message admin-note-error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="admin-note-message admin-note-success">
                {successMessage}
              </p>
            )}

            <div className="admin-note-form-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Lagrer..."
                  : editingNote
                    ? "Lagre endringer"
                    : "Opprett notat"}
              </button>

              {editingNote && (
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  Avbryt redigering
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-note-card note-preview">
          <p className="preview-label">Forhåndsvisning</p>

          <h2>{title.trim() || "Tittel på notatet"}</h2>

          <p className="preview-description">
            {description.trim() || "Beskrivelsen vises her."}
          </p>

          <div className="preview-content">
            {content.trim() ? (
              content.split("\n").map((line, index) => (
                <p key={`${line}-${index}`}>
                  {line || "\u00A0"}
                </p>
              ))
            ) : (
              <p>Innholdet vises her mens du skriver.</p>
            )}
          </div>
        </section>
      </div>

      <section className="admin-note-card uploaded-notes-section">
        <h2>Opprettede notater</h2>

        {isLoadingNotes ? (
          <p>Laster notater...</p>
        ) : uploadedNotes.length === 0 ? (
          <p>Ingen notater er opprettet gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-note-list">
            {uploadedNotes.map((note) => (
              <article key={note.id} className="uploaded-note-item">
                <div>
                  <h3>{note.title}</h3>

                  <p>{note.description}</p>

                  <span>{getSubjectLabel(note.subjectId)}</span>
                </div>

                <div className="uploaded-note-actions">
                  <a
                    href={`#/fag/${note.subjectId}/notater/${note.slug}?source=database`}
                  >
                    Åpne
                  </a>

                  <button
                    type="button"
                    className="edit-note-button"
                    onClick={() => handleEdit(note)}
                  >
                    Rediger
                  </button>

                  <button
                    type="button"
                    className="delete-note-button"
                    disabled={deletingNoteId === note.id}
                    onClick={() => handleDelete(note)}
                  >
                    {deletingNoteId === note.id
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