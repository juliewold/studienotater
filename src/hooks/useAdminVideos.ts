import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import { subjects } from "../data/subjects";
import {
  createVideo,
  deleteVideo,
  getVideosBySubject,
  updateVideo,
  type DatabaseVideo,
} from "../services/media/videosService";

import {
  getSubtopicsByTopic,
  getTopicsBySubject,
  type DatabaseSubtopic,
  type DatabaseTopic,
} from "../services/subjects/subjectStructureService";

export const useAdminVideos = () => {
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);
  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [editingVideo, setEditingVideo] = useState<DatabaseVideo | null>(null);

  const [uploadedVideos, setUploadedVideos] = useState<DatabaseVideo[]>([]);

  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setSubjectId("");
    setTopicId("");
    setSubtopicId("");

    setTopics([]);
    setSubtopics([]);

    setTitle("");
    setYoutubeId("");
    setSortOrder("1");

    setEditingVideo(null);
  };

  const loadUploadedVideos = useCallback(async () => {
    setIsLoadingVideos(true);
    setErrorMessage("");

    try {
      const videosBySubject = await Promise.all(
        subjects.map((subject) => getVideosBySubject(subject.id)),
      );

      const allUploadedVideos = videosBySubject
        .flat()
        .sort((firstVideo, secondVideo) => {
          const subjectComparison = firstVideo.subjectId.localeCompare(
            secondVideo.subjectId,
            "nb",
          );

          if (subjectComparison !== 0) {
            return subjectComparison;
          }

          const topicOrderComparison =
            firstVideo.topicOrder - secondVideo.topicOrder;

          if (topicOrderComparison !== 0) {
            return topicOrderComparison;
          }

          const topicComparison = firstVideo.topic.localeCompare(
            secondVideo.topic,
            "nb",
          );

          if (topicComparison !== 0) {
            return topicComparison;
          }

          const subtopicOrderComparison =
            firstVideo.subtopicOrder - secondVideo.subtopicOrder;

          if (subtopicOrderComparison !== 0) {
            return subtopicOrderComparison;
          }

          const subtopicComparison = firstVideo.subtopic.localeCompare(
            secondVideo.subtopic,
            "nb",
          );

          if (subtopicComparison !== 0) {
            return subtopicComparison;
          }

          return firstVideo.sortOrder - secondVideo.sortOrder;
        });

      setUploadedVideos(allUploadedVideos);
    } catch (error) {
      console.error("Kunne ikke hente videoer:", error);
      setErrorMessage("Kunne ikke hente videoene.");
    } finally {
      setIsLoadingVideos(false);
    }
  }, []);

  const loadTopics = useCallback(async (selectedSubjectId: string) => {
    if (!selectedSubjectId) {
      setTopics([]);
      return;
    }

    setIsLoadingTopics(true);

    try {
      const loadedTopics = await getTopicsBySubject(selectedSubjectId);

      setTopics(loadedTopics);
    } catch (error) {
      console.error("Kunne ikke hente temaer:", error);
      setTopics([]);
      setErrorMessage("Kunne ikke hente temaene.");
    } finally {
      setIsLoadingTopics(false);
    }
  }, []);

  const loadSubtopics = useCallback(async (selectedTopicId: string) => {
    if (!selectedTopicId) {
      setSubtopics([]);
      return;
    }

    setIsLoadingSubtopics(true);

    try {
      const loadedSubtopics = await getSubtopicsByTopic(selectedTopicId);

      setSubtopics(loadedSubtopics);
    } catch (error) {
      console.error("Kunne ikke hente undertemaer:", error);
      setSubtopics([]);
      setErrorMessage("Kunne ikke hente undertemaene.");
    } finally {
      setIsLoadingSubtopics(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedVideos();
  }, [loadUploadedVideos]);

  const handleSubjectChange = async (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    setTopicId("");
    setSubtopicId("");
    setSubtopics([]);

    setErrorMessage("");
    setSuccessMessage("");

    await loadTopics(newSubjectId);
  };

  const handleTopicChange = async (newTopicId: string) => {
    setTopicId(newTopicId);
    setSubtopicId("");

    setErrorMessage("");
    setSuccessMessage("");

    await loadSubtopics(newTopicId);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedYoutubeId = youtubeId.trim();
    const parsedSortOrder = Number(sortOrder);

    setErrorMessage("");
    setSuccessMessage("");

    if (!subjectId) {
      setErrorMessage("Du må velge et fag.");
      return;
    }

    if (!topicId) {
      setErrorMessage("Du må velge et overordnet tema.");
      return;
    }

    if (!subtopicId) {
      setErrorMessage("Du må velge et undertema.");
      return;
    }

    if (!trimmedTitle) {
      setErrorMessage("Du må skrive inn en videotittel.");
      return;
    }

    if (!trimmedYoutubeId) {
      setErrorMessage("Du må skrive inn en YouTube-ID.");
      return;
    }

    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 1) {
      setErrorMessage(
        "Video-rekkefølgen må være et heltall som er 1 eller høyere.",
      );
      return;
    }

    setIsSaving(true);

    try {
      if (editingVideo) {
        await updateVideo(
          editingVideo.id,
          subtopicId,
          trimmedTitle,
          trimmedYoutubeId,
          parsedSortOrder,
        );

        resetForm();
        await loadUploadedVideos();
        setSuccessMessage("Videoen ble oppdatert.");
        return;
      }

      await createVideo(
        subjectId,
        subtopicId,
        trimmedTitle,
        trimmedYoutubeId,
        parsedSortOrder,
      );

      resetForm();
      await loadUploadedVideos();
      setSuccessMessage("Videoen ble opprettet.");
    } catch (error) {
      console.error(
        editingVideo
          ? "Kunne ikke oppdatere video:"
          : "Kunne ikke opprette video:",
        error,
      );

      setErrorMessage(
        editingVideo
          ? "Kunne ikke oppdatere videoen."
          : "Kunne ikke opprette videoen.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (video: DatabaseVideo) => {
    setEditingVideo(video);

    setSubjectId(video.subjectId);
    setTopicId(video.topicId);
    setSubtopicId(video.subtopicId);

    setTitle(video.title);
    setYoutubeId(video.youtubeId);
    setSortOrder(String(video.sortOrder));

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const loadedTopics = await getTopicsBySubject(video.subjectId);

      const loadedSubtopics = await getSubtopicsByTopic(video.topicId);

      setTopics(loadedTopics);
      setSubtopics(loadedSubtopics);
    } catch (error) {
      console.error("Kunne ikke hente temaer ved redigering:", error);
      setErrorMessage("Kunne ikke hente temaene for videoen.");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    resetForm();
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDelete = async (video: DatabaseVideo) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette «${video.title}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingVideoId(video.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteVideo(video.id);

      setUploadedVideos((currentVideos) =>
        currentVideos.filter((currentVideo) => currentVideo.id !== video.id),
      );

      if (editingVideo?.id === video.id) {
        resetForm();
      }

      setSuccessMessage("Videoen ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette video:", error);
      setErrorMessage("Kunne ikke slette videoen.");
    } finally {
      setDeletingVideoId(null);
    }
  };

  return {
    subjectId,
    topicId,
    subtopicId,

    topics,
    subtopics,

    title,
    setTitle,

    youtubeId,
    setYoutubeId,

    sortOrder,
    setSortOrder,

    editingVideo,

    uploadedVideos,
    isLoadingVideos,
    isLoadingTopics,
    isLoadingSubtopics,
    isSaving,
    deletingVideoId,

    errorMessage,
    successMessage,

    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};
