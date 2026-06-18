import { Link, useParams } from "react-router-dom";
import { subjects } from "../data/subjects";
import { SubjectFeatureCard } from "../components/SubjectFeatureCard";

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
      <Link to="/" className="back-link">
        ← Tilbake til forsiden
      </Link>
      <p className="subject-page-label">Fag</p>
      <h1>{subject.code}</h1>
      <p>{subject.name}</p>
      <div className="subject-features-grid">
        <SubjectFeatureCard
          title="Notater"
          description="Les og organiser notater"
          link={`/fag/${subject.id}/notater`}
        />

        <SubjectFeatureCard
          title="Flashcards"
          description="Repeter med flashcards"
          link="#"
        />

        <SubjectFeatureCard
          title="Videoer"
          description="Se forelesninger og videoer"
          link="#"
        />

        <SubjectFeatureCard
          title="Eksamen"
          description="Tidligere eksamener og løsninger"
          link="#"
        />
      </div>
    </main>
  );
};
