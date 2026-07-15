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
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");

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
    setTitle("");
    setYoutubeId("");
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
        .sort((firstVideo, secondVideo) =>
          firstVideo.title.localeCompare(secondVideo.title, "nb"),
        );

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
    const trimmedTitle = title.trim();
    const trimmedYoutubeId = youtubeId.trim();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (editingVideo) {
        await updateVideo(
          editingVideo.id,
          trimmedTopic,
          trimmedTitle,
          trimmedYoutubeId,
        );

        resetForm();
        await loadUploadedVideos();
        setSuccessMessage("Videoen ble oppdatert.");
        return;
      }

      await createVideo(
        subjectId,
        trimmedTopic,
        trimmedTitle,
        trimmedYoutubeId,
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
    setTitle(video.title);
    setYoutubeId(video.youtubeId);

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

    title,
    setTitle,

    youtubeId,
    setYoutubeId,

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