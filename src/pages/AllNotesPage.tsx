import { Link } from "react-router-dom";
import { notes } from "../data/notes";
import { subjects } from "../data/subjects";

export const AllNotesPage = () => {
  const allNotes = Object.entries(notes).flatMap(([subjectId, subjectNotes]) => {
    const subject = subjects.find((subject) => subject.id === subjectId);

    return subjectNotes.map((note) => ({
      ...note,
      subjectId,
      subjectCode: subject?.code ?? subjectId.toUpperCase(),
    }));
  });

  return (
    <main className="page-container">
      <p className="page-label">Notater</p>
      <h1>Notater</h1>
      <p>Alle notater samlet på ett sted.</p>

      <div className="all-notes-grid">
        {allNotes.map((note) => (
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