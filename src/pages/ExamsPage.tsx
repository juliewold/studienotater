import { useParams } from "react-router-dom";

export const ExamsPage = () => {
  const { subjectId } = useParams();

  return (
    <main className="page-container">
      <p className="page-label">Eksamen</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <p>Her kommer tidligere eksamener og løsningsforslag.</p>
    </main>
  );
};
