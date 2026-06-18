import { useParams } from "react-router-dom";

export const FlashcardsPage = () => {
  const { subjectId } = useParams();

  return (
    <main className="page-container">
      <p className="page-label">Flashcards</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <p>Her kommer flashcards for faget.</p>
    </main>
  );
};