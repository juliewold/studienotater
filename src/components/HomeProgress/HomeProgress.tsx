import "./HomeProgress.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { pdfs } from "../../data/pdfs";
import { videos } from "../../data/videos";
import { subjects } from "../../data/subjects";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../../services/notesService";
import { useProgress } from "../../hooks/useProgress";
import { useSemesterSubjects } from "../../hooks/useSemesterSubjects";

export const HomeProgress = () => {
  const { getProgress, isLoadingProgress } = useProgress();

  const {
    semesterSubjects,
    isLoadingSemesterSubjects,
  } = useSemesterSubjects();

  const [databaseNotes, setDatabaseNotes] = useState<DatabaseNote[]>(
    [],
  );
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notesError, setNotesError] = useState("");

  const selectedSubjectIds = semesterSubjects.map(
    (subject) => subject.subjectId,
  );

  useEffect(() => {
    const loadNotes = async () => {
      if (selectedSubjectIds.length === 0) {
        setDatabaseNotes([]);
        setIsLoadingNotes(false);
        return;
      }

      setIsLoadingNotes(true);
      setNotesError("");

      try {
        const notesBySubject = await Promise.all(
          selectedSubjectIds.map((subjectId) =>
            getNotesBySubject(subjectId),
          ),
        );

        setDatabaseNotes(notesBySubject.flat());
      } catch (error) {
        console.error(
          "Kunne ikke hente notater til fremdriften:",
          error,
        );
        setNotesError("Kunne ikke hente all fremdrift.");
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [semesterSubjects]);

  const progressSubjects = useMemo(() => {
    return selectedSubjectIds.map((subjectId) => {
      const subject = subjects.find(
        (currentSubject) => currentSubject.id === subjectId,
      );

      const subjectPdfs =
        pdfs[subjectId as keyof typeof pdfs] || [];

      const subjectNotes = databaseNotes.filter(
        (note) => note.subjectId === subjectId,
      );

      const subjectVideoTopics =
        videos[subjectId as keyof typeof videos] || [];

      const subjectVideos = subjectVideoTopics.flatMap(
        (topic) => topic.videos,
      );

      const pdfProgress = subjectPdfs.map((pdf) =>
        getProgress(
          `pdf-${subjectId}-local-${pdf.id}`,
          "resource",
        ),
      );

      const noteProgress = subjectNotes.map((note) =>
        getProgress(
          `note-${subjectId}-database-${note.slug}`,
          "resource",
        ),
      );

      const videoProgress = subjectVideos.map((video) =>
        getProgress(
          `video-${subjectId}-local-${video.youtubeId}`,
          "resource",
        ),
      );

      const completedPdfs = pdfProgress.filter(
        (progress) => progress.completed,
      );

      const completedNotes = noteProgress.filter(
        (progress) => progress.completed,
      );

      const completedVideos = videoProgress.filter(
        (progress) => progress.completed,
      );

      const ratings = [
        ...pdfProgress.map((progress) => progress.rating),
        ...noteProgress.map((progress) => progress.rating),
        ...videoProgress.map((progress) => progress.rating),
      ].filter((rating) => rating > 0);

      const averageRating =
        ratings.length === 0
          ? 0
          : Math.round(
              ratings.reduce(
                (sum, rating) => sum + rating,
                0,
              ) / ratings.length,
            );

      const completed =
        completedPdfs.length +
        completedNotes.length +
        completedVideos.length;

      const total =
        subjectPdfs.length +
        subjectNotes.length +
        subjectVideos.length;

      const progress =
        total === 0
          ? 0
          : Math.round((completed / total) * 100);

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
  }, [
    databaseNotes,
    getProgress,
    selectedSubjectIds,
  ]);

  if (
    isLoadingProgress ||
    isLoadingSemesterSubjects ||
    isLoadingNotes
  ) {
    return (
      <section className="home-progress">
        <p>Laster fremdrift...</p>
      </section>
    );
  }

  if (notesError) {
    return (
      <section className="home-progress">
        <p>{notesError}</p>
      </section>
    );
  }

  if (selectedSubjectIds.length === 0) {
    return null;
  }

  return (
    <section className="home-progress">
      <div className="home-progress-header">
        <div>
          <p className="home-progress-label">
            Pensumtracker
          </p>

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
                ` · Forståelse: ${"★".repeat(
                  subject.averageRating,
                )}`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};