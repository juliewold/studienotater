import "./VideosPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../../services/videosService";
import { ResourceProgress } from "../../../components/progress/ResourceProgress/ResourceProgress";

type SubtopicGroup = {
  subtopic: string;
  subtopicOrder: number;
  videos: DatabaseVideo[];
};

type TopicGroup = {
  topic: string;
  topicOrder: number;
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
      {
        topicOrder: number;
        subtopics: Map<
          string,
          {
            subtopicOrder: number;
            videos: DatabaseVideo[];
          }
        >;
      }
    >();

    videos.forEach((video) => {
      const topicGroup = topics.get(video.topic) ?? {
        topicOrder: video.topicOrder,
        subtopics: new Map(),
      };

      const subtopicGroup = topicGroup.subtopics.get(
        video.subtopic,
      ) ?? {
        subtopicOrder: video.subtopicOrder,
        videos: [],
      };

      subtopicGroup.videos.push(video);

      topicGroup.subtopics.set(
        video.subtopic,
        subtopicGroup,
      );

      topics.set(video.topic, topicGroup);
    });

    return Array.from(topics.entries())
      .map(([topic, topicGroup]) => ({
        topic,
        topicOrder: topicGroup.topicOrder,
        subtopics: Array.from(
          topicGroup.subtopics.entries(),
        )
          .map(([subtopic, subtopicGroup]) => ({
            subtopic,
            subtopicOrder: subtopicGroup.subtopicOrder,
            videos: [...subtopicGroup.videos].sort(
              (firstVideo, secondVideo) =>
                firstVideo.sortOrder - secondVideo.sortOrder,
            ),
          }))
          .sort((firstSubtopic, secondSubtopic) => {
            const orderComparison =
              firstSubtopic.subtopicOrder -
              secondSubtopic.subtopicOrder;

            if (orderComparison !== 0) {
              return orderComparison;
            }

            return firstSubtopic.subtopic.localeCompare(
              secondSubtopic.subtopic,
              "nb",
            );
          }),
      }))
      .sort((firstTopic, secondTopic) => {
        const orderComparison =
          firstTopic.topicOrder - secondTopic.topicOrder;

        if (orderComparison !== 0) {
          return orderComparison;
        }

        return firstTopic.topic.localeCompare(
          secondTopic.topic,
          "nb",
        );
      });
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