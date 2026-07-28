import "./VideosPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../services/videosService";
import { ResourceProgress } from "../../components/ResourceProgress/ResourceProgress";

type SubtopicGroup = {
  subtopic: string;
  videos: DatabaseVideo[];
};

type TopicGroup = {
  topic: string;
  subtopics: SubtopicGroup[];
};

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
        const loadedVideos = await getVideosBySubject(subjectId);

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

  const groupedVideos = useMemo<TopicGroup[]>(() => {
    const topics = new Map<
      string,
      Map<string, DatabaseVideo[]>
    >();

    videos.forEach((video) => {
      const topicGroup =
        topics.get(video.topic) ??
        new Map<string, DatabaseVideo[]>();

      const subtopicVideos =
        topicGroup.get(video.subtopic) ?? [];

      subtopicVideos.push(video);
      topicGroup.set(video.subtopic, subtopicVideos);
      topics.set(video.topic, topicGroup);
    });

    return Array.from(topics.entries()).map(
      ([topic, subtopicMap]) => ({
        topic,
        subtopics: Array.from(subtopicMap.entries()).map(
          ([subtopic, subtopicVideos]) => ({
            subtopic,
            videos: [...subtopicVideos].sort(
              (firstVideo, secondVideo) =>
                firstVideo.sortOrder - secondVideo.sortOrder,
            ),
          }),
        ),
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

              <div className="video-subtopics">
                {topicGroup.subtopics.map((subtopicGroup) => (
                  <section
                    key={`${topicGroup.topic}-${subtopicGroup.subtopic}`}
                    className="video-subtopic-section"
                  >
                    <h3>{subtopicGroup.subtopic}</h3>

                    <div className="video-grid">
                      {subtopicGroup.videos.map((video) => {
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

                            <h4>{video.title}</h4>

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
            </section>
          ))}
        </div>
      )}
    </main>
  );
};