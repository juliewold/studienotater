import "./SubjectPage.css";
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { SubjectFeatureCard } from "../../components/SubjectFeatureCard/SubjectFeatureCard";

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

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

      <p className="subject-page-name">{subject.name}</p>

      <div className="subject-features-grid">
        <SubjectFeatureCard
          title="Notater"
          description="Les fagnotater og sammendrag"
          link={`/fag/${subject.id}/notater`}
        />

        <SubjectFeatureCard
          title="Flashcards"
          description="Repeter med flashcards"
          link={`/fag/${subject.id}/flashcards`}
        />

        <SubjectFeatureCard
          title="Oppgaver"
          description="Øv med flervalg og tallsvar"
          link={`/fag/${subject.id}/oppgaver`}
        />

        <SubjectFeatureCard
          title="Videoer"
          description="Se forelesninger og videoer"
          link={`/fag/${subject.id}/videoer`}
        />

        <SubjectFeatureCard
          title="Tidligere eksamener"
          description="Øv med tidligere eksamener"
          link={`/fag/${subject.id}/eksamen`}
        />

        <SubjectFeatureCard
          title="Forelesningsnotater"
          description="Forelesninger, presentasjoner og pensum"
          link={`/fag/${subject.id}/pdfs`}
        />

        <SubjectFeatureCard
          title="Pensum"
          description="Følg pensum og fremdrift"
          link={`/fag/${subject.id}/studieplan`}
        />
      </div>
    </main>
  );
};
