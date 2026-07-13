import "./AllNotesPage.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { notes } from "../../data/notes";
import { subjects } from "../../data/subjects";
import { useProgress } from "../../hooks/useProgress";

export const AllNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { getProgress, isLoadingProgress } = useProgress();

  const allNotes = Object.entries(notes).flatMap(
    ([subjectId, subjectNotes]) => {
      const subject = subjects.find((subject) => subject.id === subjectId);

      return subjectNotes.map((note) => ({
        ...note,
        subjectId,
        subjectCode: subject?.code ?? subjectId.toUpperCase(),
      }));
    },
  );

  const filteredNotes = allNotes.filter((note) =>
    `${note.title} ${note.description} ${note.subjectCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <main className="page-container">
      <p className="page-label">Notater</p>
      <h1>Notater</h1>

      <input
        className="notes-search"
        type="text"
        placeholder="Søk i notater..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {isLoadingProgress && <p>Laster fremdrift...</p>}

      <div className="all-notes-grid">
        {filteredNotes.map((note) => {
          const resourceId = `note-${note.subjectId}-${note.id}`;

          const { completed, rating } = getProgress(
            resourceId,
            "resource",
          );

          return (
            <Link
              key={`${note.subjectId}-${note.id}`}
              to={`/fag/${note.subjectId}/notater/${note.id}`}
              className="note-card"
            >
              <p className="subject-code">{note.subjectCode}</p>
              <h3>{note.title}</h3>
              <p>{note.description}</p>

              <div className="note-progress-preview">
                <span>{completed ? "✓ Lest" : "Ikke lest"}</span>

                <span>{"★".repeat(rating)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
};