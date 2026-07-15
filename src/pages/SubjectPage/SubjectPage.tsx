import "./SubjectPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { subjects } from "../../data/subjects";
import { SubjectFeatureCard } from "../../components/SubjectFeatureCard/SubjectFeatureCard";
import { SyllabusTracker } from "../../components/SyllabusTracker/SyllabusTracker";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";

export const SubjectPage = () => {
  const { subjectId } = useParams();

  const [subjectNotes, setSubjectNotes] = useState<DatabaseNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const subject = subjects.find(
    (currentSubject) => currentSubject.id === subjectId,
  );

  useEffect(() => {
    const loadNotes = async () => {
      if (!subjectId) {
        setSubjectNotes([]);
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      setErrorMessage("");

      try {
        const loadedNotes = await getNotesBySubject(subjectId);
        setSubjectNotes(loadedNotes);
      } catch (error) {
        console.error("Kunne ikke hente notater:", error);
        setErrorMessage("Kunne ikke hente pensumoversikten.");
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [subjectId]);

  if (!subject) {
    return (
      <main className="subject-page">
        <h1>Fant ikke faget</h1>
      </main>
    );
  }

  const syllabusTopics = subjectNotes.map((note) => ({
    id: note.slug,
    title: note.title,
    description: note.description,
  }));

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

        <SubjectFeatureCard
          title="PDF-er"
          description="Forelesninger og egne notater"
          link={`/fag/${subject.id}/pdfs`}
        />

        <SubjectFeatureCard
          title="Studieplan"
          description="Pensum, oppgaver og fremdrift"
          link={`/fag/${subject.id}/studieplan`}
        />
      </div>

      {isLoadingNotes ? (
        <p>Laster pensumoversikt...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <SyllabusTracker
          subjectId={subject.id}
          topics={syllabusTopics}
        />
      )}
    </main>
  );
};