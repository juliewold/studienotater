import { useMemo } from "react";
import { subjects } from "../data/subjects";
import type { HomeResourcesSnapshot } from "../services/home/homeResourcesService";
import { useProgress } from "./useProgress";
import { useSemesterSubjects } from "./useSemesterSubjects";

export const useHomeProgress = (resources: HomeResourcesSnapshot) => {
  const { getProgress, isLoadingProgress } = useProgress();
  const { semesterSubjects, isLoadingSemesterSubjects } = useSemesterSubjects();
  const { notes: databaseNotes, pdfs: databasePdfs, videos: databaseVideos } = resources;
  const isLoadingResources = resources.loading;
  const resourcesError = resources.progressError ? "Kunne ikke hente all fremdrift." : "";

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
