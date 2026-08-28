import { useEffect, useMemo, useState } from "react";

import { getPdfsBySubject, type DatabasePdf } from "../services/media/pdfsService";

import { getNotesBySubject, type DatabaseNote } from "../services/notes/notesService";

import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../services/media/videosService";

import { useProgress } from "./useProgress";

export type TopicProgress = {
  topicId: string;
  topicName: string;
  topicOrder: number;
  completed: number;
  total: number;
  progress: number;
  averageRating: number;
};

export type SubjectProgress = {
  completed: number;
  total: number;
  progress: number;
  averageRating: number;

  pdfCompleted: number;
  pdfTotal: number;

  noteCompleted: number;
  noteTotal: number;

  videoCompleted: number;
  videoTotal: number;

  topicProgress: TopicProgress[];
};

type TopicResource = {
  topicId?: string | null;
  topicName?: string | null;
  topic?: string | null;
  topicOrder?: number | null;
};

type GroupedTopic = {
  topicId: string;
  topicName: string;
  topicOrder: number;
  completed: number;
  total: number;
  ratings: number[];
};

const emptyProgress: SubjectProgress = {
  completed: 0,
  total: 0,
  progress: 0,
  averageRating: 0,

  pdfCompleted: 0,
  pdfTotal: 0,

  noteCompleted: 0,
  noteTotal: 0,

  videoCompleted: 0,
  videoTotal: 0,

  topicProgress: [],
};

const getTopicInformation = (resource: unknown) => {
  const topicResource = resource as TopicResource;

  return {
    topicId: topicResource.topicId ?? "",
    topicName: topicResource.topicName ?? topicResource.topic ?? "Uten tema",
    topicOrder: topicResource.topicOrder ?? 0,
  };
};

export const useSubjectProgress = (subjectId: string | undefined) => {
  const { getProgress, isLoadingProgress } = useProgress();

  const [pdfs, setPdfs] = useState<DatabasePdf[]>([]);
  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [videos, setVideos] = useState<DatabaseVideo[]>([]);

  const [isLoadingResources, setIsLoadingResources] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadResources = async () => {
      if (!subjectId) {
        setPdfs([]);
        setNotes([]);
        setVideos([]);
        setIsLoadingResources(false);
        return;
      }

      setIsLoadingResources(true);
      setErrorMessage("");

      try {
        const [loadedPdfs, loadedNotes, loadedVideos] = await Promise.all([
          getPdfsBySubject(subjectId),
          getNotesBySubject(subjectId),
          getVideosBySubject(subjectId),
        ]);

        setPdfs(loadedPdfs);
        setNotes(loadedNotes);
        setVideos(loadedVideos);
      } catch (error) {
        console.error("Kunne ikke hente fagprogresjon:", error);

        setPdfs([]);
        setNotes([]);
        setVideos([]);

        setErrorMessage("Kunne ikke hente progresjonen for faget.");
      } finally {
        setIsLoadingResources(false);
      }
    };

    loadResources();
  }, [subjectId]);

  const subjectProgress = useMemo<SubjectProgress>(() => {
    if (!subjectId) {
      return emptyProgress;
    }

    const pdfProgress = pdfs.map((pdf) => ({
      pdf,
      progress: getProgress(`pdf-${subjectId}-database-${pdf.id}`, "resource"),
    }));

    const noteProgress = notes.map((note) => ({
      note,
      progress: getProgress(
        `note-${subjectId}-database-${note.slug}`,
        "resource",
      ),
    }));

    const videoProgress = videos.map((video) => ({
      video,
      progress: getProgress(
        `video-${subjectId}-database-${video.youtubeId}`,
        "resource",
      ),
    }));

    const completedPdfs = pdfProgress.filter(
      ({ progress }) => progress.completed,
    ).length;

    const completedNotes = noteProgress.filter(
      ({ progress }) => progress.completed,
    ).length;

    const completedVideos = videoProgress.filter(
      ({ progress }) => progress.completed,
    ).length;

    const ratings = [
      ...pdfProgress.map(({ progress }) => progress.rating),
      ...noteProgress.map(({ progress }) => progress.rating),
      ...videoProgress.map(({ progress }) => progress.rating),
    ].filter((rating) => rating > 0);

    const averageRating =
      ratings.length === 0
        ? 0
        : Math.round(
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          );

    const completed = completedPdfs + completedNotes + completedVideos;

    const total = pdfs.length + notes.length + videos.length;

    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    const groupedTopics = new Map<string, GroupedTopic>();

    const addResourceToTopic = (
      resource: unknown,
      resourceProgress: {
        completed: boolean;
        rating: number;
      },
    ) => {
      const { topicId, topicName, topicOrder } = getTopicInformation(resource);

      if (!topicId) {
        return;
      }

      const currentTopic = groupedTopics.get(topicId) ?? {
        topicId,
        topicName,
        topicOrder,
        completed: 0,
        total: 0,
        ratings: [],
      };

      currentTopic.total += 1;

      if (resourceProgress.completed) {
        currentTopic.completed += 1;
      }

      if (resourceProgress.rating > 0) {
        currentTopic.ratings.push(resourceProgress.rating);
      }

      groupedTopics.set(topicId, currentTopic);
    };

    pdfProgress.forEach(({ pdf, progress }) => {
      addResourceToTopic(pdf, progress);
    });

    noteProgress.forEach(({ note, progress }) => {
      addResourceToTopic(note, progress);
    });

    videoProgress.forEach(({ video, progress }) => {
      addResourceToTopic(video, progress);
    });

    const topicProgress = Array.from(groupedTopics.values())
      .map((topic) => {
        const topicAverageRating =
          topic.ratings.length === 0
            ? 0
            : Math.round(
                topic.ratings.reduce((sum, rating) => sum + rating, 0) /
                  topic.ratings.length,
              );

        const topicCompletion =
          topic.total === 0
            ? 0
            : Math.round((topic.completed / topic.total) * 100);

        return {
          topicId: topic.topicId,
          topicName: topic.topicName,
          topicOrder: topic.topicOrder,
          completed: topic.completed,
          total: topic.total,
          progress: topicCompletion,
          averageRating: topicAverageRating,
        };
      })
      .sort((firstTopic, secondTopic) => {
        const orderComparison = firstTopic.topicOrder - secondTopic.topicOrder;

        if (orderComparison !== 0) {
          return orderComparison;
        }

        return firstTopic.topicName.localeCompare(secondTopic.topicName, "nb");
      });

    return {
      completed,
      total,
      progress,
      averageRating,

      pdfCompleted: completedPdfs,
      pdfTotal: pdfs.length,

      noteCompleted: completedNotes,
      noteTotal: notes.length,

      videoCompleted: completedVideos,
      videoTotal: videos.length,

      topicProgress,
    };
  }, [getProgress, notes, pdfs, subjectId, videos]);

  return {
    subjectProgress,
    isLoading: isLoadingProgress || isLoadingResources,
    errorMessage,
  };
};
