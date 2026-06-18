import { useParams } from "react-router-dom";

export const VideosPage = () => {
  const { subjectId } = useParams();

  return (
    <main className="page-container">
      <p className="page-label">Videoer</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      <p>Her kommer videoer og forelesninger.</p>
    </main>
  );
};
