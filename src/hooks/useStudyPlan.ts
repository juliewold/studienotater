import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  getStudyTopicsBySubject,
  type DatabaseStudyTopic,
  type DatabaseStudyTopicItem,
  type DatabaseStudyTopicResource,
} from "../services/study/studyPlansService";
import {
  getNotesBySubject,
  type DatabaseNote,
} from "../services/notes/notesService";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../services/media/videosService";
import {
  getPdfsBySubject,
  type DatabasePdf,
} from "../services/media/pdfsService";
import {
  getStudyPlanItems,
  saveStudyPlanItem,
} from "../services/progress/progressService";
import { useProgress } from "./useProgress";
import { useBookProgress } from "./useBookProgress";
import { tma4412Book } from "../data/books/tma4412Book";

type StudyPlanResourceType = "pdf" | "note" | "video";

type TopicProgressItem =
  | {
      id: string;
      type: "study-plan";
    }
  | {
      id: string;
      type: "resource";
      resourceType: StudyPlanResourceType;
    };

export const useStudyPlan = (subjectId?: string) => {
  const { user } = useContext(AuthContext);

  const {
    getProgress,
    isLoadingProgress,
  } = useProgress();

  const {
    checkedPages,
    isLoading: isLoadingBookProgress,
  } = useBookProgress(tma4412Book.id);

  const [topics, setTopics] = useState<DatabaseStudyTopic[]>([]);
  const [pdfs, setPdfs] = useState<DatabasePdf[]>([]);
  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [videos, setVideos] = useState<DatabaseVideo[]>([]);

  const [
    completedStudyPlanItems,
    setCompletedStudyPlanItems,
  ] = useState<string[]>([]);

  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadStudyPlan = useCallback(async () => {
    if (!subjectId) {
      setTopics([]);
      setPdfs([]);
      setNotes([]);
      setVideos([]);
      setIsLoadingPlan(false);
      return;
    }

    setIsLoadingPlan(true);
    setErrorMessage("");

    try {
      const [
        loadedTopics,
        loadedPdfs,
        loadedNotes,
        loadedVideos,
      ] = await Promise.all([
        getStudyTopicsBySubject(subjectId),
        getPdfsBySubject(subjectId),
        getNotesBySubject(subjectId),
        getVideosBySubject(subjectId),
      ]);

      setTopics(loadedTopics);
      setPdfs(loadedPdfs);
      setNotes(loadedNotes);
      setVideos(loadedVideos);
    } catch (error) {
      console.error("Kunne ikke hente studieplan:", error);
      setErrorMessage("Kunne ikke hente studieplanen.");
    } finally {
      setIsLoadingPlan(false);
    }
  }, [subjectId]);

  const loadCompletedItems = useCallback(async () => {
    if (!user || !subjectId) {
      setCompletedStudyPlanItems([]);
      return;
    }

    try {
      const completedItems = await getStudyPlanItems(
        user.id,
        subjectId,
      );

      setCompletedStudyPlanItems(completedItems);
    } catch (error) {
      console.error(
        "Kunne ikke hente studieplanfremdrift:",
        error,
      );
    }
  }, [subjectId, user]);

  useEffect(() => {
    loadStudyPlan();
  }, [loadStudyPlan]);

  useEffect(() => {
    loadCompletedItems();
  }, [loadCompletedItems]);

  const toggleItem = async (itemId: string) => {
    if (!user || !subjectId) {
      return;
    }

    const wasCompleted =
      completedStudyPlanItems.includes(itemId);

    const previousItems = completedStudyPlanItems;

    setCompletedStudyPlanItems((currentItems) =>
      wasCompleted
        ? currentItems.filter(
            (currentItemId) =>
              currentItemId !== itemId,
          )
        : [...currentItems, itemId],
    );

    try {
      await saveStudyPlanItem(
        user.id,
        subjectId,
        itemId,
        !wasCompleted,
      );
    } catch (error) {
      console.error(
        "Kunne ikke lagre studieplanfremdrift:",
        error,
      );

      setCompletedStudyPlanItems(previousItems);
    }
  };

  const getBookChapter = (readingTitle: string) => {
    if (subjectId !== "tma4412") {
      return undefined;
    }

    return tma4412Book.chapters.find(
      (chapter) => chapter.title === readingTitle,
    );
  };

  const getBookChapterProgress = (
    readingTitle: string,
  ) => {
    const chapter = getBookChapter(readingTitle);

    if (!chapter) {
      return null;
    }

    const pages = Array.from(
      {
        length:
          chapter.endPage -
          chapter.startPage +
          1,
      },
      (_, index) => chapter.startPage + index,
    );

    const readPages = pages.filter((page) =>
      checkedPages.includes(page),
    ).length;

    const progress =
      pages.length === 0
        ? 0
        : Math.round(
            (readPages / pages.length) * 100,
          );

    return {
      chapter,
      readPages,
      totalPages: pages.length,
      progress,
    };
  };

  const getStudyItemProgressId = (
    topic: DatabaseStudyTopic,
    item: DatabaseStudyTopicItem,
  ) => {
    return `study-topic-${topic.id}-item-${item.id}`;
  };

  const getResourceProgressId = (
    resource: DatabaseStudyTopicResource,
  ) => {
    const source = "database";

    if (resource.resourceType === "pdf") {
      return `pdf-${subjectId}-${source}-${resource.resourceId}`;
    }

    if (resource.resourceType === "note") {
      const note = notes.find(
        (currentNote) =>
          currentNote.id === resource.resourceId,
      );

      return note
        ? `note-${subjectId}-${source}-${note.slug}`
        : `note-${subjectId}-${source}-${resource.resourceId}`;
    }

    const video = videos.find(
      (currentVideo) =>
        currentVideo.id === resource.resourceId,
    );

    return video
      ? `video-${subjectId}-${source}-${video.youtubeId}`
      : `video-${subjectId}-${source}-${resource.resourceId}`;
  };

  const isStudyItemCompleted = (
    topic: DatabaseStudyTopic,
    item: DatabaseStudyTopicItem,
  ) => {
    const bookProgress = getBookChapterProgress(
      item.value,
    );

    if (
      item.type === "reading" &&
      bookProgress
    ) {
      return bookProgress.progress === 100;
    }

    return completedStudyPlanItems.includes(
      getStudyItemProgressId(topic, item),
    );
  };

  const isResourceCompleted = (
    resource: DatabaseStudyTopicResource,
  ) => {
    return getProgress(
      getResourceProgressId(resource),
      "resource",
    ).completed;
  };

  const getTopicProgressItems = (
    topic: DatabaseStudyTopic,
  ): TopicProgressItem[] => {
    const studyItems: TopicProgressItem[] =
      topic.items.map((item) => ({
        id: getStudyItemProgressId(topic, item),
        type: "study-plan",
      }));

    const resourceItems: TopicProgressItem[] =
      topic.resources.map((resource) => ({
        id: getResourceProgressId(resource),
        type: "resource",
        resourceType: resource.resourceType,
      }));

    return [...studyItems, ...resourceItems];
  };

  const isTopicProgressItemCompleted = (
    item: TopicProgressItem,
  ) => {
    if (item.type === "study-plan") {
      return completedStudyPlanItems.includes(item.id);
    }

    return getProgress(
      item.id,
      "resource",
    ).completed;
  };

  const progressSummary = useMemo(() => {
    const allItems = topics.flatMap((topic) =>
      getTopicProgressItems(topic),
    );

    const completedItems = allItems.filter(
      isTopicProgressItemCompleted,
    );

    const percentage =
      allItems.length === 0
        ? 0
        : Math.round(
            (completedItems.length /
              allItems.length) *
              100,
          );

    return {
      completed: completedItems.length,
      total: allItems.length,
      percentage,
    };
  }, [
    completedStudyPlanItems,
    getProgress,
    notes,
    topics,
    videos,
  ]);

  const getTopicProgress = (
    topic: DatabaseStudyTopic,
  ) => {
    const topicItems = getTopicProgressItems(topic);

    const completedItems = topicItems.filter(
      isTopicProgressItemCompleted,
    );

    return {
      completed: completedItems.length,
      total: topicItems.length,
      percentage:
        topicItems.length === 0
          ? 0
          : Math.round(
              (completedItems.length /
                topicItems.length) *
                100,
            ),
    };
  };

  const getPdfById = (id: string) => {
    return (
      pdfs.find((pdf) => pdf.id === id) ?? null
    );
  };

  const getNoteById = (id: string) => {
    return (
      notes.find((note) => note.id === id) ?? null
    );
  };

  const getVideoById = (id: string) => {
    return (
      videos.find((video) => video.id === id) ?? null
    );
  };

  const getResourceUrl = (
    resource: DatabaseStudyTopicResource,
  ) => {
    if (resource.resourceType === "pdf") {
      return `/fag/${subjectId}/pdfs/${resource.resourceId}`;
    }

    if (resource.resourceType === "note") {
      const note = getNoteById(resource.resourceId);

      return note
        ? `/fag/${subjectId}/notater/${note.slug}`
        : `/fag/${subjectId}/notater`;
    }

    return `/fag/${subjectId}/videoer`;
  };

  const getResourceTitle = (
    resource: DatabaseStudyTopicResource,
  ) => {
    if (resource.resourceType === "pdf") {
      return (
        getPdfById(resource.resourceId)?.title ??
        "Ukjent PDF"
      );
    }

    if (resource.resourceType === "note") {
      return (
        getNoteById(resource.resourceId)?.title ??
        "Ukjent notat"
      );
    }

    return (
      getVideoById(resource.resourceId)?.title ??
      "Ukjent video"
    );
  };

  const isLoading =
    isLoadingPlan ||
    isLoadingProgress ||
    isLoadingBookProgress;

  return {
    topics,
    errorMessage,
    isLoading,

    progressSummary,

    toggleItem,
    getStudyItemProgressId,
    getBookChapterProgress,
    isStudyItemCompleted,
    isResourceCompleted,
    getTopicProgress,

    getResourceUrl,
    getResourceTitle,
  };
};