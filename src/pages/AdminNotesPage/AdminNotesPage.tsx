import "./AdminNotesPage.css";
import { useState, type SyntheticEvent } from "react";
import { subjects } from "../../data/subjects";
import { createNote } from "../../services/notesService";

export const AdminNotesPage = () => {
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createSlug = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const slug = createSlug(title);

    if (!slug) {
      setErrorMessage("Notatet må ha en gyldig tittel.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createNote(
        subjectId,
        slug,
        title.trim(),
        description.trim(),
        content.trim(),
      );

      setSubjectId("");
      setTitle("");
      setDescription("");
      setContent("");

      setSuccessMessage("Notatet ble opprettet.");
    } catch (error) {
      console.error("Kunne ikke opprette notat:", error);
      setErrorMessage(
        "Kunne ikke opprette notatet. Det kan allerede finnes et notat med samme adresse.",
      );
    } finally {
      setIsSaving(false);
    }
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
          <h2>Opprett nytt notat</h2>

          <form className="admin-note-form" onSubmit={handleSubmit}>
            <label htmlFor="note-subject">Fag</label>

            <select
              id="note-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              required
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>

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

            <button type="submit" disabled={isSaving}>
              {isSaving ? "Lagrer..." : "Opprett notat"}
            </button>
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
    </main>
  );
};