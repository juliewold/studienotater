import { useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import { notes } from "../data/notes";

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
      <p className="notes-label">Notater</p>
      <h1>{subject.code}</h1>
      <p>{subject.name}</p>

      <div className="notes-list">
        {subjectNotes.map((note) => (
          <article key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
};
