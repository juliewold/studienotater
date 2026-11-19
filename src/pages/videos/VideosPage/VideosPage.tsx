import { LoadingPlaceholder } from "../../../components/common/LoadingPlaceholder/LoadingPlaceholder";
import "./VideosPage.css";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import cookieImage from "../../../assets/cookie.png";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../../services/media/videosService";
import { ResourceProgress } from "../../../components/progress/ResourceProgress/ResourceProgress";
import {
  getYoutubeChoice,
  setYoutubeChoice,
  type YoutubeChoice,
} from "../../../services/media/youtubeConsent";

// Same colours as the subject cards (SubjectCard.css) in light mode, and the
// dark-mode accents from theme.css in dark mode, so hues don't shift between themes.
const TOPIC_TILE_PALETTE = [
  { soft: "#f3ecff", text: "#7c3aed", dark: "#c4a0ff" }, // purple
  { soft: "#fff0f5", text: "#db2777", dark: "#f59aca" }, // pink
  { soft: "#eefaf1", text: "#2f9e55", dark: "#86dc9c" }, // green
  { soft: "#eef6ff", text: "#2563eb", dark: "#8cbfff" }, // blue
  { soft: "#fff7ed", text: "#ea580c", dark: "#ffb478" }, // orange
  { soft: "#f0fdfa", text: "#0d9488", dark: "#7be1d5" }, // teal
  { soft: "#fff1f2", text: "#e11d48", dark: "#ff9db0" }, // red
  { soft: "#fefce8", text: "#ca8a04", dark: "#edd777" }, // yellow
];

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

  const [youtubeChoice, setYoutubeChoiceState] = useState<YoutubeChoice | null>(getYoutubeChoice);

  const decideYoutube = (choice: YoutubeChoice) => {
    setYoutubeChoice(choice);
    setYoutubeChoiceState(choice);
  };

  const [videos, setVideos] = useState<DatabaseVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  // The chosen topic lives in the URL (?tema=...), so a refresh or the browser back button keeps it.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTopic = searchParams.get("tema");
  const setSelectedTopic = (topic: string | null) => {
    setSearchParams(topic ? { tema: topic } : {});
  };

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
      {youtubeChoice === null && (
        <div className="consent-overlay">
          <div
            className="consent-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="youtube-consent-title"
          >
            <img src={cookieImage} alt="" className="consent-icon" width={72} height={72} />
            <h2 id="youtube-consent-title">Vise YouTube-videoer?</h2>
            <p>
              Videoene på denne siden ligger på YouTube. Hvis du spiller dem av her, setter YouTube informasjonskapsler i
              nettleseren din og får IP-adressen din.
            </p>
            <p>Valget lagres i nettleseren din til du endrer det under Innstillinger.</p>
            <div className="consent-actions">
              <button
                type="button"
                className="consent-decline"
                onClick={() => decideYoutube("declined")}
              >
                Nei, ikke vis
              </button>
              <button
                type="button"
                className="consent-accept"
                autoFocus
                onClick={() => decideYoutube("granted")}
              >
                Ja, vis videoene
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTopic === null ? (
        <Link to={`/fag/${subjectId}`} className="back-link">
          ← Tilbake til faget
        </Link>
      ) : (
        <button
          type="button"
          className="back-link topic-back"
          onClick={() => setSelectedTopic(null)}
        >
          ← Alle temaer
        </button>
      )}

      <p className="page-label">Videoer</p>

      <h1>{subjectId?.toUpperCase()}</h1>

      {isLoadingVideos && <LoadingPlaceholder label="Laster videoer..." />}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingVideos &&
        !errorMessage &&
        groupedVideos.length === 0 && (
          <p>Ingen videoer er lagt til ennå.</p>
        )}

      {!isLoadingVideos && !errorMessage && selectedTopic === null && (
        <div className="topic-overview">
          {groupedVideos.map((topicGroup, index) => {
            const videoCount = topicGroup.subtopics.reduce(
              (total, subtopicGroup) => total + subtopicGroup.videos.length,
              0,
            );

            return (
              <button
                key={topicGroup.topic}
                type="button"
                className="topic-tile"
                style={
                  {
                    "--tile-soft":
                      TOPIC_TILE_PALETTE[index % TOPIC_TILE_PALETTE.length].soft,
                    "--tile-text":
                      TOPIC_TILE_PALETTE[index % TOPIC_TILE_PALETTE.length].text,
                    "--tile-dark":
                      TOPIC_TILE_PALETTE[index % TOPIC_TILE_PALETTE.length].dark,
                  } as CSSProperties
                }
                onClick={() => setSelectedTopic(topicGroup.topic)}
              >
                <span className="topic-tile-title">{topicGroup.topic}</span>
                <span className="topic-tile-count">
                  {videoCount} {videoCount === 1 ? "video" : "videoer"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!isLoadingVideos && !errorMessage && selectedTopic !== null && (
        <div className="video-topics">
          {groupedVideos
            .filter((topicGroup) => topicGroup.topic === selectedTopic)
            .map((topicGroup) => (
            <section
              key={topicGroup.topic}
              className="video-topic-section"
            >
              <h2>{topicGroup.topic}</h2>

              {/* One grid per topic, so single-video subtopics share rows instead of each taking a full row. */}
              <div className="video-grid">
                {topicGroup.subtopics.flatMap((subtopicGroup) =>
                  subtopicGroup.videos.map((video) => (
                    <div
                      key={video.id}
                      className="video-card"
                    >
                      <p className="video-subtopic-label">{subtopicGroup.subtopic}</p>

                      {/* Nothing from YouTube is loaded unless the visitor has said yes. */}
                      {youtubeChoice === "granted" ? (
                        <iframe
                          className="video-player"
                          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="video-consent">
                          <p>Videoen vises her når du har godtatt YouTube-videoer.</p>
                          <button
                            type="button"
                            className="video-consent-button"
                            onClick={() => decideYoutube("granted")}
                          >
                            Godta og vis videoene
                          </button>
                          <a
                            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Åpne på YouTube
                          </a>
                        </div>
                      )}

                      <h4>{video.title}</h4>

                      <ResourceProgress
                        resourceId={`video-${subjectId}-database-${video.youtubeId}`}
                        resourceType="sett"
                      />
                    </div>
                  )),
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
};