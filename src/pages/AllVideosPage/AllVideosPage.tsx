import "./AllVideosPage.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { subjects } from "../../data/subjects";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../../services/videosService";
import { useProgress } from "../../hooks/useProgress";

type VideoSubject = {
  id: string;
  code: string;
  name: string;
  totalVideos: number;
  completedVideos: number;
};

export const AllVideosPage = () => {
  const [videos, setVideos] = useState<DatabaseVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { getProgress, isLoadingProgress } = useProgress();

  useEffect(() => {
    const loadVideos = async () => {
      setIsLoadingVideos(true);
      setErrorMessage("");

      try {
        const videosBySubject = await Promise.all(
          subjects.map((subject) =>
            getVideosBySubject(subject.id),
          ),
        );

        setVideos(videosBySubject.flat());
      } catch (error) {
        console.error("Kunne ikke hente videoer:", error);
        setErrorMessage("Kunne ikke hente videoene.");
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadVideos();
  }, []);

  const videoSubjects = useMemo<VideoSubject[]>(() => {
    return subjects
      .map((subject) => {
        const subjectVideos = videos.filter(
          (video) => video.subjectId === subject.id,
        );

        const completedVideos = subjectVideos.filter((video) => {
          const { completed } = getProgress(
            `video-${subject.id}-database-${video.youtubeId}`,
            "resource",
          );

          return completed;
        }).length;

        return {
          id: subject.id,
          code: subject.code,
          name: subject.name,
          totalVideos: subjectVideos.length,
          completedVideos,
        };
      })
      .filter((subject) => subject.totalVideos > 0);
  }, [getProgress, videos]);

  return (
    <main className="page-container">
      <p className="page-label">Videoer</p>

      <h1>Videoer</h1>

      <p>Velg et fag for å se videoer og forelesninger.</p>

      {(isLoadingProgress || isLoadingVideos) && (
        <p>Laster videoer...</p>
      )}

      {errorMessage && <p>{errorMessage}</p>}

      {!isLoadingVideos &&
        !errorMessage &&
        videoSubjects.length === 0 && (
          <p>Fant ingen fag med videoer.</p>
        )}

      {!isLoadingVideos && !errorMessage && (
        <div className="all-videos-grid">
          {videoSubjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/fag/${subject.id}/videoer`}
              className="video-subject-card"
            >
              <p className="subject-code">{subject.code}</p>

              <h3>{subject.name}</h3>

              <p>
                {subject.completedVideos} / {subject.totalVideos} videoer sett
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};