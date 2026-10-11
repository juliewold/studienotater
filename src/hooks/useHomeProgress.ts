import { useEffect, useMemo, useState } from "react";

import { subjects } from "../data/subjects";
import {
  getPdfsBySubject,
  type DatabasePdf,
} from "../services/media/pdfsService";

import {
  getNotesBySubject,
  type DatabaseNote,
} from "../services/notes/notesService";

import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../services/media/videosService";

import { useProgress } from "../hooks/useProgress";
import { useSemesterSubjects } from "../hooks/useSemesterSubjects";

export const useHomeProgress = () => {
  const { getProgress, isLoadingProgress } = useProgress();

  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();

  const [databasePdfs, setDatabasePdfs] = useState<DatabasePdf[]>([]);
  const [databaseNotes, setDatabaseNotes] = useState<DatabaseNote[]>([]);
  const [databaseVideos, setDatabaseVideos] = useState<DatabaseVideo[]>([]);

  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [resourcesError, setResourcesError] = useState("");

  const selectedSubjectIds = useMemo(
    () => semesterSubjects.map((semesterSubject) => semesterSubject.subjectId),
    [semesterSubjects],
  );

  useEffect(() => {
    const loadResources = async () => {
      if (selectedSubjectIds.length === 0) {
        setDatabasePdfs([]);
        setDatabaseNotes([]);
        setDatabaseVideos([]);
        setIsLoadingResources(false);
        return;
      }

      setIsLoadingResources(true);
      setResourcesError("");

      try {
        const [pdfsBySubject, notesBySubject, videosBySubject] =
          await Promise.all([
            Promise.all(
              selectedSubjectIds.map((subjectId) =>
                getPdfsBySubject(subjectId),
              ),
            ),
            Promise.all(
              selectedSubjectIds.map((subjectId) =>
                getNotesBySubject(subjectId),
              ),
            ),
            Promise.all(
              selectedSubjectIds.map((subjectId) =>
                getVideosBySubject(subjectId),
              ),
            ),
          ]);

        setDatabasePdfs(pdfsBySubject.flat());
        setDatabaseNotes(notesBySubject.flat());
        setDatabaseVideos(videosBySubject.flat());
      } catch (error) {
        console.error("Kunne ikke hente ressurser til fremdriften:", error);

        setResourcesError("Kunne ikke hente all fremdrift.");
      } finally {
        setIsLoadingResources(false);
      }
    };

    loadResources();
  }, [selectedSubjectIds]);

  const progressSubjects = useMemo(() => {
    return semesterSubjects.map((semesterSubject) => {
      const subjectId = semesterSubject.subjectId;

      const regularSubject = subjects.find(
        (subject) => subject.id === subjectId,
      );

      const subjectPdfs = databasePdfs.filter(
        (pdf) => pdf.subjectId === subjectId,
      );

      const subjectNotes = databaseNotes.filter(
        (note) => note.subjectId === subjectId,
      );

      const subjectVideos = databaseVideos.filter(
        (video) => video.subjectId === subjectId,
      );

      const pdfProgress = subjectPdfs.map((pdf) =>
        getProgress(`pdf-${subjectId}-database-${pdf.id}`, "resource"),
      );

      const noteProgress = subjectNotes.map((note) =>
        getProgress(`note-${subjectId}-database-${note.slug}`, "resource"),
      );

      const videoProgress = subjectVideos.map((video) =>
        getProgress(
          `video-${subjectId}-database-${video.youtubeId}`,
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
              ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
            );

      const completed =
        completedPdfs.length + completedNotes.length + completedVideos.length;

      const total =
        subjectPdfs.length + subjectNotes.length + subjectVideos.length;

      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        id: subjectId,

        code:
          semesterSubject.customCode ??
          regularSubject?.code ??
          subjectId.toUpperCase(),

        color: regularSubject?.color ?? "default",

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
    semesterSubjects,
    databasePdfs,
    databaseNotes,
    databaseVideos,
    getProgress,
  ]);

  return { progressSubjects, isLoading: isLoadingProgress || isLoadingSemesterSubjects || isLoadingResources, resourcesError };
};
