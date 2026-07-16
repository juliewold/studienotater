import "./VideosPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../services/videosService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

export const VideosPage = () => {
  const { subjectId } = useParams();

  const [activeVideoId, setActiveVideoId] = useState<string | null>(
    null,
  );

  const [videos, setVideos] = useState<DatabaseVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      if (!subjectId) {
        setVideos([]);
        setIsLoadingVideos(false);
        return;
      }

      setIsLoadingVideos(true);
      setErrorMessage("");

      try {
        const loadedVideos =
          await getVideosBySubject(subjectId);

        setVideos(loadedVideos);
      } catch (error) {
        console.error("Kunne ikke hente videoer:", error);
        setErrorMessage("Kunne ikke hente videoene.");
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadVideos();
  }, [subjectId]);

  const groupedVideos = useMemo(() => {
    const grouped = new Map<string, DatabaseVideo[]>();

    videos.forEach((video) => {
      const topicVideos = grouped.get(video.topic) ?? [];
      topicVideos.push(video);
      grouped.set(video.topic, topicVideos);
    });

    return Array.from(grouped.entries()).map(
      ([topic, topicVideos]) => ({
        topic,
        videos: topicVideos,
      }),
    );
  }, [videos]);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Videoer</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingVideos && <p>Laster videoer...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingVideos &&
        !errorMessage &&
        groupedVideos.length === 0 && (
          <p>Ingen videoer er lagt til ennå.</p>
        )}

      {!isLoadingVideos && !errorMessage && (
        <div className="video-topics">
          {groupedVideos.map((topicGroup) => (
            <section
              key={topicGroup.topic}
              className="video-topic-section"
            >
              <h2>{topicGroup.topic}</h2>

              <div className="video-grid">
                {topicGroup.videos.map((video) => {
                  const isActive =
                    activeVideoId === video.id;

                  return (
                    <div
                      key={video.id}
                      className="video-card"
                    >
                      {isActive ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          className="video-thumbnail-button"
                          onClick={() =>
                            setActiveVideoId(video.id)
                          }
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                            alt={video.title}
                          />

                          <span className="play-button">
                            ▶
                          </span>
                        </button>
                      )}

                      <h3>{video.title}</h3>

                      <ResourceProgress
                        resourceId={`video-${subjectId}-database-${video.youtubeId}`}
                        resourceType="sett"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
};