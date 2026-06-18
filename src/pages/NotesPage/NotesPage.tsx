import "./NotesPage.css"
import { useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { notes } from "../../data/notes";
import { Link } from "react-router-dom";

export const NotesPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);

  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  if (!subject) {
    return (
      <main className="notes-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="notes-page">
      <Link to={`/fag/${subject.id}`} className="back-link">
        ← Tilbake til faget
      </Link>
      <p className="notes-label">Notater</p>
      <h1>{subject.code}</h1>
      <p>{subject.name}</p>

      <div className="notes-list">
        {subjectNotes.map((note) => (
          <Link
            key={note.id}
            to={`/fag/${subject.id}/notater/${note.id}`}
            className="note-card"
          >
            <h3>{note.title}</h3>
            <p>{note.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};
