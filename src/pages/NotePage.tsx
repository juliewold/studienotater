import { useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import { notes } from "../data/notes";

export const NotePage = () => {
  const { subjectId, noteId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);

  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

  const note = subjectNotes.find((note) => note.id === noteId);

  if (!subject || !note) {
    return (
      <main className="note-page">
        <h1>Fant ikke notatet</h1>
      </main>
    );
  }

  return (
    <main className="note-page">
      <p className="note-label">{subject.code}</p>
      <h1>{note.title}</h1>
      <p>{note.description}</p>

      <section className="note-content">
        <pre>{note.content}</pre>
      </section>
    </main>
  );
};
