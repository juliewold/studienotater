import "./SubjectPage.css"
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { SubjectFeatureCard } from "../../components/SubjectFeatureCard/SubjectFeatureCard";
import { SyllabusTracker } from "../../components/SyllabusTracker/SyllabusTracker";
import { notes } from "../../data/notes";

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find((subject) => subject.id === subjectId);
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];

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
          link={`/fag/${subject.id}/flashcards`}
        />

        <SubjectFeatureCard
          title="Videoer"
          description="Se forelesninger og videoer"
          link={`/fag/${subject.id}/videoer`}
        />

        <SubjectFeatureCard
          title="Eksamen"
          description="Tidligere eksamener og løsninger"
          link={`/fag/${subject.id}/eksamen`}
        />
      </div>

      <SyllabusTracker subjectId={subject.id} topics={subjectNotes} />
    </main>
  );
};
