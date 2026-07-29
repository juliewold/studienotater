import "./AdminNotesPage.css";

import { NoteEditor } from "../../components/NoteEditor/NoteEditor";
import { subjects } from "../../data/subjects";
import { useAdminNotes } from "../../hooks/useAdminNotes";

export const AdminNotesPage = () => {
  const {
    subjectId,
    topicId,
    subtopicId,

    title,
    setTitle,

    description,
    setDescription,

    content,
    setContent,

    availableTopics,
    availableSubtopics,

    editingNote,

    uploadedNotes,

    isLoadingNotes,
    isLoadingStructure,
    isSaving,

    deletingNoteId,

    errorMessage,
    successMessage,

    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,

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

      <section className="admin-note-card admin-note-editor-card">
        <h2>{editingNote ? "Rediger notat" : "Opprett nytt notat"}</h2>

        <form className="admin-note-form" onSubmit={handleSubmit}>
          <div className="admin-note-field">
            <label htmlFor="note-subject">Fag</label>

            <select
              id="note-subject"
              value={subjectId}
              onChange={(event) => handleSubjectChange(event.target.value)}
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
          </div>

          <div className="admin-note-field">
            <label htmlFor="note-topic">Tema</label>

            <select
              id="note-topic"
              value={topicId}
              onChange={(event) => handleTopicChange(event.target.value)}
              disabled={!subjectId || isLoadingStructure}
              required
            >
              <option value="">
                {!subjectId
                  ? "Velg fag først"
                  : availableTopics.length === 0
                    ? "Ingen temaer i faget"
                    : "Velg tema"}
              </option>

              {availableTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-note-field">
            <label htmlFor="note-subtopic">Undertema</label>

            <select
              id="note-subtopic"
              value={subtopicId}
              onChange={(event) => setSubtopicId(event.target.value)}
              disabled={!topicId || isLoadingStructure}
              required
            >
              <option value="">
                {!topicId
                  ? "Velg tema først"
                  : availableSubtopics.length === 0
                    ? "Ingen undertemaer"
                    : "Velg undertema"}
              </option>

              {availableSubtopics.map((subtopic) => (
                <option key={subtopic.id} value={subtopic.id}>
                  {subtopic.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-note-document-header">
            <input
              id="note-title"
              className="admin-note-title-input"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Tittel på notatet"
              aria-label="Tittel"
              required
            />

            <input
              id="note-description"
              className="admin-note-description-input"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Skriv en kort beskrivelse..."
              aria-label="Beskrivelse"
              required
            />
          </div>

          <div className="admin-note-editor-section">
            <NoteEditor value={content} onChange={setContent} />
          </div>

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

      <section className="admin-note-card uploaded-notes-section">
        <h2>Opprettede notater</h2>

        {isLoadingNotes || isLoadingStructure ? (
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

                  <p>
                    Tema: <strong>{note.topicName ?? "Ikke valgt"}</strong>
                  </p>

                  <p>
                    Undertema:{" "}
                    <strong>{note.subtopicName ?? "Ikke valgt"}</strong>
                  </p>
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
                    {deletingNoteId === note.id ? "Sletter..." : "Slett"}
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
