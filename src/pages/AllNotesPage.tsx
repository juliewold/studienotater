import { Link } from "react-router-dom";
import { notes } from "../data/notes";
import { subjects } from "../data/subjects";
import { useState } from "react";

export const AllNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

      <div className="all-notes-grid">
        {filteredNotes.map((note) => (
          <Link
            key={`${note.subjectId}-${note.id}`}
            to={`/fag/${note.subjectId}/notater/${note.id}`}
            className="note-card"
          >
            <p className="subject-code">{note.subjectCode}</p>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};
