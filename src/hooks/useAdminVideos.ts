import {
  useCallback,
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";
import { subjects } from "../data/subjects";
import {
  createVideo,
  deleteVideo,
  getVideosBySubject,
  updateVideo,
  type DatabaseVideo,
} from "../services/videosService";

export const useAdminVideos = () => {
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [sortOrder, setSortOrder] = useState("1");

  const [editingVideo, setEditingVideo] =
    useState<DatabaseVideo | null>(null);

  const [uploadedVideos, setUploadedVideos] = useState<DatabaseVideo[]>(
    [],
  );
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<
    string | null
  >(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const resetForm = () => {
    setSubjectId("");
    setTopic("");
    setSubtopic("");
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
        subjects.map((subject) =>
          getVideosBySubject(subject.id),
        ),
      );

      const allUploadedVideos = videosBySubject
        .flat()
        .sort((firstVideo, secondVideo) => {
          const subjectComparison =
            firstVideo.subjectId.localeCompare(
              secondVideo.subjectId,
              "nb",
            );

          if (subjectComparison !== 0) {
            return subjectComparison;
          }

          const topicComparison = firstVideo.topic.localeCompare(
            secondVideo.topic,
            "nb",
          );

          if (topicComparison !== 0) {
            return topicComparison;
          }

          const subtopicComparison =
            firstVideo.subtopic.localeCompare(
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

  useEffect(() => {
    loadUploadedVideos();
  }, [loadUploadedVideos]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTopic = topic.trim();
    const trimmedSubtopic = subtopic.trim();
    const trimmedTitle = title.trim();
    const trimmedYoutubeId = youtubeId.trim();
    const parsedSortOrder = Number(sortOrder);

    setErrorMessage("");
    setSuccessMessage("");

    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 1) {
      setErrorMessage(
        "Rekkefølgen må være et heltall som er 1 eller høyere.",
      );
      return;
    }

    setIsSaving(true);

    try {
      if (editingVideo) {
        await updateVideo(
          editingVideo.id,
          trimmedTopic,
          trimmedSubtopic,
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
        trimmedTopic,
        trimmedSubtopic,
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

  const handleEdit = (video: DatabaseVideo) => {
    setEditingVideo(video);
    setSubjectId(video.subjectId);
    setTopic(video.topic);
    setSubtopic(video.subtopic);
    setTitle(video.title);
    setYoutubeId(video.youtubeId);
    setSortOrder(String(video.sortOrder));

    setErrorMessage("");
    setSuccessMessage("");

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
        currentVideos.filter(
          (currentVideo) => currentVideo.id !== video.id,
        ),
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
    setSubjectId,

    topic,
    setTopic,

    subtopic,
    setSubtopic,

    title,
    setTitle,

    youtubeId,
    setYoutubeId,

    sortOrder,
    setSortOrder,

    editingVideo,

    uploadedVideos,
    isLoadingVideos,
    isSaving,
    deletingVideoId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};