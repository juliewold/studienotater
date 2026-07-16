import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { subjects } from "../data/subjects";
import {
  createStudyTopic,
  deleteStudyTopic,
  getStudyTopicsBySubject,
  replaceStudyTopicItems,
  replaceStudyTopicResources,
  updateStudyTopic,
  type DatabaseStudyTopic,
  type StudyTopicItemType,
  type StudyTopicResourceType,
} from "../services/studyPlansService";
import { getNotesBySubject, type DatabaseNote } from "../services/notesService";
import {
  getVideosBySubject,
  type DatabaseVideo,
} from "../services/videosService";
import { getPdfsBySubject, type DatabasePdf } from "../services/pdfsService";

type ResourceSelection = {
  resourceType: StudyTopicResourceType;
  resourceId: string;
};

export const useAdminStudyPlans = () => {
  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  const [reading, setReading] = useState("");
  const [lectures, setLectures] = useState("");
  const [exercises, setExercises] = useState("");
  const [assignments, setAssignments] = useState("");
  const [stack, setStack] = useState("");

  const [selectedPdfIds, setSelectedPdfIds] = useState<string[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);

  const [editingTopic, setEditingTopic] = useState<DatabaseStudyTopic | null>(
    null,
  );

  const [studyTopics, setStudyTopics] = useState<DatabaseStudyTopic[]>([]);

  const [availablePdfs, setAvailablePdfs] = useState<DatabasePdf[]>([]);
  const [availableNotes, setAvailableNotes] = useState<DatabaseNote[]>([]);
  const [availableVideos, setAvailableVideos] = useState<DatabaseVideo[]>([]);

  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createSlug = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const splitLines = (value: string) => {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const resetForm = () => {
    setSubjectId("");
    setTitle("");
    setSortOrder("0");

    setReading("");
    setLectures("");
    setExercises("");
    setAssignments("");
    setStack("");

    setSelectedPdfIds([]);
    setSelectedNoteIds([]);
    setSelectedVideoIds([]);

    setEditingTopic(null);
  };

  const loadStudyTopics = useCallback(async () => {
    setIsLoadingTopics(true);
    setErrorMessage("");

    try {
      const topicsBySubject = await Promise.all(
        subjects.map((subject) => getStudyTopicsBySubject(subject.id)),
      );

      const loadedTopics = topicsBySubject
        .flat()
        .sort((firstTopic, secondTopic) => {
          if (firstTopic.subjectId !== secondTopic.subjectId) {
            return firstTopic.subjectId.localeCompare(
              secondTopic.subjectId,
              "nb",
            );
          }

          if (firstTopic.sortOrder !== secondTopic.sortOrder) {
            return firstTopic.sortOrder - secondTopic.sortOrder;
          }

          return firstTopic.title.localeCompare(secondTopic.title, "nb");
        });

      setStudyTopics(loadedTopics);
    } catch (error) {
      console.error("Kunne ikke hente studieplaner:", error);
      setErrorMessage("Kunne ikke hente studieplanene.");
    } finally {
      setIsLoadingTopics(false);
    }
  }, []);

  const loadResourcesForSubject = useCallback(
    async (selectedSubjectId: string) => {
      if (!selectedSubjectId) {
        setAvailablePdfs([]);
        setAvailableNotes([]);
        setAvailableVideos([]);
        return;
      }

      setIsLoadingResources(true);

      try {
        const [pdfs, notes, videos] = await Promise.all([
          getPdfsBySubject(selectedSubjectId),
          getNotesBySubject(selectedSubjectId),
          getVideosBySubject(selectedSubjectId),
        ]);

        setAvailablePdfs(pdfs);
        setAvailableNotes(notes);
        setAvailableVideos(videos);
      } catch (error) {
        console.error("Kunne ikke hente ressurser til studieplanen:", error);

        setErrorMessage("Kunne ikke hente PDF-er, notater og videoer.");
      } finally {
        setIsLoadingResources(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadStudyTopics();
  }, [loadStudyTopics]);

  useEffect(() => {
    loadResourcesForSubject(subjectId);
  }, [loadResourcesForSubject, subjectId]);

  const subjectTopics = useMemo(() => {
    if (!subjectId) {
      return [];
    }

    return studyTopics.filter((topic) => topic.subjectId === subjectId);
  }, [studyTopics, subjectId]);

  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);

    if (!editingTopic) {
      setSelectedPdfIds([]);
      setSelectedNoteIds([]);
      setSelectedVideoIds([]);

      const topicsInSubject = studyTopics.filter(
        (topic) => topic.subjectId === newSubjectId,
      );

      setSortOrder(String(topicsInSubject.length));
    }
  };

  const createItems = () => {
    const itemGroups: Array<{
      type: StudyTopicItemType;
      values: string[];
    }> = [
      {
        type: "reading",
        values: splitLines(reading),
      },
      {
        type: "lecture",
        values: splitLines(lectures),
      },
      {
        type: "exercise",
        values: splitLines(exercises),
      },
      {
        type: "assignment",
        values: splitLines(assignments),
      },
      {
        type: "stack",
        values: splitLines(stack),
      },
    ];

    return itemGroups.flatMap((group) =>
      group.values.map((value) => ({
        type: group.type,
        value,
      })),
    );
  };

  const createResources = (): ResourceSelection[] => {
    return [
      ...selectedPdfIds.map((resourceId) => ({
        resourceType: "pdf" as const,
        resourceId,
      })),
      ...selectedNoteIds.map((resourceId) => ({
        resourceType: "note" as const,
        resourceId,
      })),
      ...selectedVideoIds.map((resourceId) => ({
        resourceType: "video" as const,
        resourceId,
      })),
    ];
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const parsedSortOrder = Number(sortOrder);

    if (!trimmedTitle) {
      setErrorMessage("Temaet må ha en tittel.");
      return;
    }

    if (!Number.isInteger(parsedSortOrder) || parsedSortOrder < 0) {
      setErrorMessage("Rekkefølgen må være et heltall som er 0 eller høyere.");
      return;
    }

    const items = createItems();
    const resources = createResources();

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    let createdTopicId: string | null = null;

    try {
      if (editingTopic) {
        await updateStudyTopic(editingTopic.id, trimmedTitle, parsedSortOrder);

        await replaceStudyTopicItems(editingTopic.id, items);

        await replaceStudyTopicResources(editingTopic.id, resources);

        resetForm();
        await loadStudyTopics();

        setSuccessMessage("Studietemaet ble oppdatert.");
        return;
      }

      const slug = createSlug(trimmedTitle);

      if (!slug) {
        setErrorMessage("Temaet må ha en gyldig tittel.");
        return;
      }

      createdTopicId = await createStudyTopic(
        subjectId,
        slug,
        trimmedTitle,
        parsedSortOrder,
      );

      await replaceStudyTopicItems(createdTopicId, items);

      await replaceStudyTopicResources(createdTopicId, resources);

      resetForm();
      await loadStudyTopics();

      setSuccessMessage("Studietemaet ble opprettet.");
    } catch (error) {
      if (createdTopicId) {
        try {
          await deleteStudyTopic(createdTopicId);
        } catch (cleanupError) {
          console.error(
            "Kunne ikke rydde opp etter mislykket oppretting:",
            cleanupError,
          );
        }
      }

      console.error(
        editingTopic
          ? "Kunne ikke oppdatere studietema:"
          : "Kunne ikke opprette studietema:",
        error,
      );

      setErrorMessage(
        editingTopic
          ? "Kunne ikke oppdatere studietemaet."
          : "Kunne ikke opprette studietemaet.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const joinItemValues = (
    topic: DatabaseStudyTopic,
    type: StudyTopicItemType,
  ) => {
    return topic.items
      .filter((item) => item.type === type)
      .map((item) => item.value)
      .join("\n");
  };

  const getResourceIds = (
    topic: DatabaseStudyTopic,
    resourceType: StudyTopicResourceType,
  ) => {
    return topic.resources
      .filter((resource) => resource.resourceType === resourceType)
      .map((resource) => resource.resourceId);
  };

  const handleEdit = (topic: DatabaseStudyTopic) => {
    setEditingTopic(topic);

    setSubjectId(topic.subjectId);
    setTitle(topic.title);
    setSortOrder(String(topic.sortOrder));

    setReading(joinItemValues(topic, "reading"));
    setLectures(joinItemValues(topic, "lecture"));
    setExercises(joinItemValues(topic, "exercise"));
    setAssignments(joinItemValues(topic, "assignment"));
    setStack(joinItemValues(topic, "stack"));

    setSelectedPdfIds(getResourceIds(topic, "pdf"));
    setSelectedNoteIds(getResourceIds(topic, "note"));
    setSelectedVideoIds(getResourceIds(topic, "video"));

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

  const handleDelete = async (topic: DatabaseStudyTopic) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette temaet «${topic.title}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingTopicId(topic.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteStudyTopic(topic.id);

      setStudyTopics((currentTopics) =>
        currentTopics.filter((currentTopic) => currentTopic.id !== topic.id),
      );

      if (editingTopic?.id === topic.id) {
        resetForm();
      }

      setSuccessMessage("Studietemaet ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette studietema:", error);
      setErrorMessage("Kunne ikke slette studietemaet.");
    } finally {
      setDeletingTopicId(null);
    }
  };

  const toggleResource = (
    resourceId: string,
    selectedIds: string[],
    setSelectedIds: Dispatch<SetStateAction<string[]>>,
  ) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(resourceId)
        ? currentIds.filter((currentId) => currentId !== resourceId)
        : [...currentIds, resourceId],
    );
  };

  const togglePdf = (pdfId: string) => {
    toggleResource(pdfId, selectedPdfIds, setSelectedPdfIds);
  };

  const toggleNote = (noteId: string) => {
    toggleResource(noteId, selectedNoteIds, setSelectedNoteIds);
  };

  const toggleVideo = (videoId: string) => {
    toggleResource(videoId, selectedVideoIds, setSelectedVideoIds);
  };

  return {
    subjectId,
    handleSubjectChange,

    title,
    setTitle,

    sortOrder,
    setSortOrder,

    reading,
    setReading,

    lectures,
    setLectures,

    exercises,
    setExercises,

    assignments,
    setAssignments,

    stack,
    setStack,

    selectedPdfIds,
    selectedNoteIds,
    selectedVideoIds,

    editingTopic,

    studyTopics,
    subjectTopics,

    availablePdfs,
    availableNotes,
    availableVideos,

    isLoadingTopics,
    isLoadingResources,
    isSaving,
    deletingTopicId,

    errorMessage,
    successMessage,

    togglePdf,
    toggleNote,
    toggleVideo,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  };
};
