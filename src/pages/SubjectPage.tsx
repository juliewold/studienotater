import { useParams } from "react-router-dom";
import { subjects } from "../data/subjects";

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);

  if (!subject) {
    return (
      <main className="subject-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  return (
    <main className="subject-page">
      <p className="subject-page-label">Fag</p>
      <h1>{subject.code}</h1>
      <p>{subject.name}</p>

      <div className="subject-actions">
        <button>Notater</button>
        <button>Flashcards</button>
        <button>Videoer</button>
        <button>Eksamen</button>
      </div>
    </main>
  );
};