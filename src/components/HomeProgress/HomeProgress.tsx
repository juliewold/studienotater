import "./HomeProgress.css";
import { Link } from "react-router-dom";
import { pdfs } from "../../data/pdfs";
import { notes } from "../../data/notes";
import { videos } from "../../data/videos";
import { subjects } from "../../data/subjects";

export const HomeProgress = () => {
  const savedSubjects = localStorage.getItem("semester-subjects");

  const selectedSubjects: string[] = savedSubjects
    ? JSON.parse(savedSubjects)
    : [];

  const progressSubjects = selectedSubjects.map((subjectId) => {
    const subject = subjects.find((subject) => subject.id === subjectId);

    const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];
    const subjectNotes = notes[subjectId as keyof typeof notes] || [];
    const subjectVideoTopics =
      videos[subjectId as keyof typeof videos] || [];

    const subjectVideos = subjectVideoTopics.flatMap(
      (topic) => topic.videos,
    );

    const completedPdfs = subjectPdfs.filter(
      (pdf) =>
        localStorage.getItem(
          `resource-progress-pdf-${subjectId}-${pdf.id}-completed`,
        ) === "true",
    );

    const completedNotes = subjectNotes.filter(
      (note) =>
        localStorage.getItem(
          `resource-progress-note-${subjectId}-${note.id}-completed`,
        ) === "true",
    );

    const completedVideos = subjectVideos.filter(
      (video) =>
        localStorage.getItem(
          `resource-progress-video-${subjectId}-${video.youtubeId}-completed`,
        ) === "true",
    );

    const pdfRatings = subjectPdfs.map((pdf) =>
      Number(
        localStorage.getItem(
          `resource-progress-pdf-${subjectId}-${pdf.id}-rating`,
        ),
      ),
    );

    const noteRatings = subjectNotes.map((note) =>
      Number(
        localStorage.getItem(
          `resource-progress-note-${subjectId}-${note.id}-rating`,
        ),
      ),
    );

    const videoRatings = subjectVideos.map((video) =>
      Number(
        localStorage.getItem(
          `resource-progress-video-${subjectId}-${video.youtubeId}-rating`,
        ),
      ),
    );

    const ratings = [...pdfRatings, ...noteRatings, ...videoRatings].filter(
      (rating) => rating > 0,
    );

    const averageRating =
      ratings.length === 0
        ? 0
        : Math.round(
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          );

    const completed =
      completedPdfs.length + completedNotes.length + completedVideos.length;

    const total =
      subjectPdfs.length + subjectNotes.length + subjectVideos.length;

    const progress =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      id: subjectId,
      code: subject?.code ?? subjectId.toUpperCase(),
      name: subject?.name ?? "",
      completed,
      total,
      progress,
      averageRating,
      pdfCompleted: completedPdfs.length,
      pdfTotal: subjectPdfs.length,
      noteCompleted: completedNotes.length,
      noteTotal: subjectNotes.length,
      videoCompleted: completedVideos.length,
      videoTotal: subjectVideos.length,
    };
  });

  if (progressSubjects.length === 0) {
    return null;
  }

  return (
    <section className="home-progress">
      <div className="home-progress-header">
        <div>
          <p className="home-progress-label">Pensumtracker</p>
          <h2>Fremdrift i semesterfagene dine</h2>
        </div>
      </div>

      <div className="home-progress-list">
        {progressSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}`}
            className="home-progress-item"
          >
            <div className="home-progress-info">
              <div>
                <strong>{subject.code}</strong>
                <span>{subject.name}</span>
              </div>

              <p>
                {subject.completed} / {subject.total} ressurser fullført
              </p>
            </div>

            <div className="home-progress-details">
              <span>
                PDF-er: {subject.pdfCompleted} / {subject.pdfTotal}
              </span>
              <span>
                Notater: {subject.noteCompleted} / {subject.noteTotal}
              </span>
              <span>
                Videoer: {subject.videoCompleted} / {subject.videoTotal}
              </span>
            </div>

            <div className="home-progress-bar">
              <div
                className="home-progress-fill"
                style={{ width: `${subject.progress}%` }}
              />
            </div>

            <p className="home-progress-percent">
              {subject.progress}% fullført
              {subject.averageRating > 0 &&
                ` · Forståelse: ${"★".repeat(subject.averageRating)}`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};