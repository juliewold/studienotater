import "./VideosPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { videos } from "../../data/videos";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../services/videosService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

type LocalVideo = {
  title: string;
  youtubeId: string;
};

type VideoItem = {
  id: string;
  title: string;
  youtubeId: string;
  topic: string;
  source: "local" | "database";
};

export const VideosPage = () => {
  const { subjectId } = useParams();

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [databaseVideos, setDatabaseVideos] = useState<DatabaseVideo[]>(
    [],
  );
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const localVideoTopics =
    videos[subjectId as keyof typeof videos] || [];

  useEffect(() => {
    const loadVideos = async () => {
      if (!subjectId) {
        setDatabaseVideos([]);
        setIsLoadingVideos(false);
        return;
      }

      setIsLoadingVideos(true);
      setErrorMessage("");

      try {
        const loadedVideos = await getVideosBySubject(subjectId);
        setDatabaseVideos(loadedVideos);
      } catch (error) {
        console.error("Kunne ikke hente videoer:", error);
        setErrorMessage("Kunne ikke hente nye videoer.");
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadVideos();
  }, [subjectId]);

  const groupedVideos = useMemo(() => {
    const allVideos: VideoItem[] = [
      ...localVideoTopics.flatMap((topic) =>
        topic.videos.map((video: LocalVideo) => ({
          id: `local-${topic.id}-${video.youtubeId}`,
          title: video.title,
          youtubeId: video.youtubeId,
          topic: topic.topic,
          source: "local" as const,
        })),
      ),
      ...databaseVideos.map((video) => ({
        id: `database-${video.id}`,
        title: video.title,
        youtubeId: video.youtubeId,
        topic: video.topic,
        source: "database" as const,
      })),
    ];

    const grouped = new Map<string, VideoItem[]>();

    allVideos.forEach((video) => {
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
  }, [databaseVideos, localVideoTopics]);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Videoer</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingVideos && <p>Laster videoer...</p>}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingVideos && (
        <div className="video-topics">
          {groupedVideos.map((topicGroup) => (
            <section
              key={topicGroup.topic}
              className="video-topic-section"
            >
              <h2>{topicGroup.topic}</h2>

              <div className="video-grid">
                {topicGroup.videos.map((video) => {
                  const activeId = `${video.source}-${video.id}`;
                  const isActive = activeVideoId === activeId;

                  return (
                    <div key={video.id} className="video-card">
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
                          onClick={() => setActiveVideoId(activeId)}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                            alt={video.title}
                          />

                          <span className="play-button">▶</span>
                        </button>
                      )}

                      <h3>{video.title}</h3>

                      <ResourceProgress
                        resourceId={`video-${subjectId}-${video.source}-${video.youtubeId}`}
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