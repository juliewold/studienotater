import { Link, useParams } from "react-router-dom";
import { videos } from "../data/videos";

export const VideosPage = () => {
  const { subjectId } = useParams();

  const subjectVideos =
    videos[subjectId as keyof typeof videos] || [];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Videoer</p>
      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="video-grid">
        {subjectVideos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            className="video-card"
          >
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
};