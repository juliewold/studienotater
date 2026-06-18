import "./VideosPage.css"
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { videos } from "../../data/videos";

export const VideosPage = () => {
  const { subjectId } = useParams();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const subjectVideoTopics =
    videos[subjectId as keyof typeof videos] || [];

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Videoer</p>
      <h1>{subjectId?.toUpperCase()}</h1>

      <div className="video-topics">
        {subjectVideoTopics.map((topic) => (
          <section key={topic.id} className="video-topic-section">
            <h2>{topic.topic}</h2>

            <div className="video-grid">
              {topic.videos.map((video) => (
                <div key={video.youtubeId} className="video-card">
                  {activeVideoId === video.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className="video-thumbnail-button"
                      onClick={() => setActiveVideoId(video.youtubeId)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                        alt={video.title}
                      />
                      <span className="play-button">▶</span>
                    </button>
                  )}

                  <h3>{video.title}</h3>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};