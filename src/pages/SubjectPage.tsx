import { useParams } from "react-router-dom";

export const SubjectPage = () => {
  const { subjectId } = useParams();

  return (
    <main className="subject-page">
      <p>Fag</p>
      <h1>{subjectId}</h1>
      <p>Her kommer notater, flashcards, videoer og eksamensoppgaver.</p>
    </main>
  );
};