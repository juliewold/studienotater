import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

import { subjects } from "../../data/subjects";
import { supabase } from "../../lib/supabase";

import {
  deletePdf,
  getAllPdfs,
  updatePdfSubtopic,
  updatePdfTitle,
  type DatabasePdf,
} from "../../services/media/pdfsService";

import {
  getTopicsBySubject,
  getSubtopicsByTopic,
  type DatabaseTopic,
  type DatabaseSubtopic,
} from "../../services/subjects/subjectStructureService";

export const useAdminPdfs = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [topics, setTopics] = useState<DatabaseTopic[]>([]);

  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);

  const [uploadedPdfs, setUploadedPdfs] = useState<DatabasePdf[]>([]);

  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);

  const [isLoadingStructure, setIsLoadingStructure] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [deletingPdfId, setDeletingPdfId] = useState<string | null>(null);

  const [updatingPdfId, setUpdatingPdfId] = useState<string | null>(null);

  const [editingPdfId, setEditingPdfId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State is only set inside promise callbacks, so the mount effect can call
  // these loaders safely. Handlers that reload use the refresh variants.
  const loadUploadedPdfs = useCallback((isCurrent: () => boolean = () => true) =>
    getAllPdfs()
      .then((loadedPdfs) => {
        const sortedPdfs = [...loadedPdfs].sort((firstPdf, secondPdf) => {
          const subjectComparison = firstPdf.subjectId.localeCompare(
            secondPdf.subjectId,
            "nb",
          );

          if (subjectComparison !== 0) {
            return subjectComparison;
          }

          return firstPdf.title.localeCompare(secondPdf.title, "nb");
        });

        if (isCurrent()) setUploadedPdfs(sortedPdfs);
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente opplastede PDF-er:", error);

        if (isCurrent()) setErrorMessage("Kunne ikke hente de opplastede PDF-ene.");
      })
      .finally(() => {
        if (isCurrent()) setIsLoadingPdfs(false);
      }), []);

  const refreshUploadedPdfs = useCallback(() => {
    setIsLoadingPdfs(true);
    setErrorMessage("");
    return loadUploadedPdfs();
  }, [loadUploadedPdfs]);

  const loadTopicStructure = useCallback((isCurrent: () => boolean = () => true) =>
    Promise.all(subjects.map((subject) => getTopicsBySubject(subject.id)))
      .then((topicsBySubject) => {
        const loadedTopics = topicsBySubject.flat();

        return Promise.all(loadedTopics.map((topic) => getSubtopicsByTopic(topic.id)))
          .then((subtopicsByTopic) => {
            if (isCurrent()) {
              setTopics(loadedTopics);
              setSubtopics(subtopicsByTopic.flat());
            }
          });
      })
      .catch((error: unknown) => {
        console.error("Kunne ikke hente temaer og undertemaer:", error);

        if (isCurrent()) {
          setTopics([]);
          setSubtopics([]);
          setErrorMessage("Kunne ikke hente temaer og undertemaer.");
        }
      })
      .finally(() => {
        if (isCurrent()) setIsLoadingStructure(false);
      }), []);

  useEffect(() => {
    let isCurrent = true;
    void loadUploadedPdfs(() => isCurrent);
    void loadTopicStructure(() => isCurrent);
    return () => {
      isCurrent = false;
    };
  }, [loadTopicStructure, loadUploadedPdfs]);

  const availableTopics = useMemo(() => {
    return topics.filter((topic) => topic.subjectId === subjectId);
  }, [subjectId, topics]);

  const availableSubtopics = useMemo(() => {
    return subtopics.filter((subtopic) => subtopic.topicId === topicId);
  }, [subtopics, topicId]);

  const handleSubjectChange = (nextSubjectId: string) => {
    setSubjectId(nextSubjectId);
    setTopicId("");
    setSubtopicId("");
  };

  const handleTopicChange = (nextTopicId: string) => {
    setTopicId(nextTopicId);
    setSubtopicId("");
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !subjectId ||
      !topicId ||
      !subtopicId ||
      !title.trim() ||
      !category ||
      !pdfFile
    ) {
      setErrorMessage("Fyll ut alle feltene før du laster opp PDF-en.");

      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const safeFileName = pdfFile.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");

    const filePath = `${subjectId}/${category}/${Date.now()}-${safeFileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, pdfFile);

      if (uploadError) {
        throw uploadError;
      }

      const { error: databaseError } = await supabase.from("pdfs").insert({
        subject_id: subjectId,
        subtopic_id: subtopicId,
        title: title.trim(),
        category,
        file_path: filePath,
      });

      if (databaseError) {
        await supabase.storage.from("pdfs").remove([filePath]);

        throw databaseError;
      }

      setSubjectId("");
      setTopicId("");
      setSubtopicId("");
      setTitle("");
      setCategory("");
      setPdfFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await refreshUploadedPdfs();

      setSuccessMessage("PDF-en ble lastet opp.");
    } catch (error) {
      console.error("Kunne ikke laste opp PDF:", error);

      setErrorMessage("Kunne ikke laste opp PDF-en.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePdfSubtopicChange = async (
    pdfId: string,
    nextSubtopicId: string,
  ) => {
    setUpdatingPdfId(pdfId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updatePdfSubtopic(pdfId, nextSubtopicId || null);

      await refreshUploadedPdfs();

      setSuccessMessage(
        nextSubtopicId
          ? "Temakoblingen ble oppdatert."
          : "Temakoblingen ble fjernet.",
      );
    } catch (error) {
      console.error("Kunne ikke oppdatere PDF-ens undertema:", error);

      setErrorMessage("Kunne ikke oppdatere temakoblingen.");
    } finally {
      setUpdatingPdfId(null);
    }
  };

  const handleDelete = async (pdf: DatabasePdf) => {
    const shouldDelete = window.confirm(
      `Er du sikker på at du vil slette «${pdf.title}»?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingPdfId(pdf.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deletePdf(pdf.id, pdf.filePath);

      setUploadedPdfs((currentPdfs) =>
        currentPdfs.filter((currentPdf) => currentPdf.id !== pdf.id),
      );

      setSuccessMessage("PDF-en ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette PDF:", error);

      setErrorMessage("Kunne ikke slette PDF-en.");
    } finally {
      setDeletingPdfId(null);
    }
  };

  const startTitleEdit = (pdf: DatabasePdf) => {
    setEditingPdfId(pdf.id);
    setEditingTitle(pdf.title);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const cancelTitleEdit = () => {
    setEditingPdfId(null);
    setEditingTitle("");
  };

  const handleTitleSave = async (pdf: DatabasePdf) => {
    const nextTitle = editingTitle.trim();

    if (!nextTitle) {
      setErrorMessage("Tittelen kan ikke være tom.");

      return;
    }

    if (nextTitle === pdf.title) {
      cancelTitleEdit();

      return;
    }

    setUpdatingPdfId(pdf.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updatePdfTitle(pdf.id, nextTitle);

      cancelTitleEdit();

      await refreshUploadedPdfs();

      setSuccessMessage("Tittelen ble oppdatert.");
    } catch (error) {
      console.error("Kunne ikke oppdatere PDF-ens tittel:", error);

      setErrorMessage("Kunne ikke oppdatere tittelen.");
    } finally {
      setUpdatingPdfId(null);
    }
  };

  return {
    fileInputRef,

    subjectId,
    topicId,
    subtopicId,

    title,
    setTitle,

    category,
    setCategory,

    setPdfFile,

    topics,
    subtopics,
    availableTopics,
    availableSubtopics,

    uploadedPdfs,

    isLoadingPdfs,
    isLoadingStructure,
    isUploading,

    deletingPdfId,
    updatingPdfId,

    errorMessage,
    successMessage,

    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,

    handleSubmit,
    handlePdfSubtopicChange,
    handleDelete,

    editingPdfId,
    editingTitle,
    setEditingTitle,
    startTitleEdit,
    cancelTitleEdit,
    handleTitleSave,
  };
};
