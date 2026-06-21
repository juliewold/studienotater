import "./AllVideosPage.css";
import { Link } from "react-router-dom";
import { videos } from "../../data/videos";
import { subjects } from "../../data/subjects";

export const AllVideosPage = () => {
  const videoSubjects = Object.entries(videos).map(
    ([subjectId, subjectVideos]) => {
      const subject = subjects.find((subject) => subject.id === subjectId);

      const totalVideos = subjectVideos.reduce(
        (total, topic) => total + topic.videos.length,
        0,
      );

      const completedVideos = subjectVideos.reduce((total, topic) => {
        return (
          total +
          topic.videos.filter((video) => {
            return (
              localStorage.getItem(
                `resource-progress-video-${video.youtubeId}-completed`,
              ) === "true"
            );
          }).length
        );
      }, 0);

      return {
        id: subjectId,
        code: subject?.code ?? subjectId.toUpperCase(),
        name: subject?.name ?? "",
        totalVideos,
        completedVideos,
      };
    },
  );

  return (
    <main className="page-container">
      <p className="page-label">Videoer</p>
      <h1>Videoer</h1>
      <p>Velg et fag for å se videoer og forelesninger.</p>

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
    </main>
  );
};
