import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { subjects } from "../data/subjects";
import { supabase } from "../lib/supabase";
import {
  deletePdf,
  getPdfsBySubject,
  type DatabasePdf,
} from "../services/pdfsService";

export const useAdminPdfs = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [uploadedPdfs, setUploadedPdfs] = useState<DatabasePdf[]>([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPdfId, setDeletingPdfId] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUploadedPdfs = useCallback(async () => {
    setIsLoadingPdfs(true);
    setErrorMessage("");

    try {
      const pdfsBySubject = await Promise.all(
        subjects.map((subject) => getPdfsBySubject(subject.id)),
      );

      const allUploadedPdfs = pdfsBySubject
        .flat()
        .sort((firstPdf, secondPdf) =>
          firstPdf.title.localeCompare(secondPdf.title, "nb"),
        );

      setUploadedPdfs(allUploadedPdfs);
    } catch (error) {
      console.error("Kunne ikke hente opplastede PDF-er:", error);
      setErrorMessage("Kunne ikke hente de opplastede PDF-ene.");
    } finally {
      setIsLoadingPdfs(false);
    }
  }, []);

  useEffect(() => {
    loadUploadedPdfs();
  }, [loadUploadedPdfs]);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!pdfFile) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const safeFileName = pdfFile.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");

    const filePath =
      `${subjectId}/${category}/${Date.now()}-${safeFileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, pdfFile);

      if (uploadError) {
        throw uploadError;
      }

      const { error: databaseError } = await supabase
        .from("pdfs")
        .insert({
          subject_id: subjectId,
          title: title.trim(),
          category,
          file_path: filePath,
        });

      if (databaseError) {
        await supabase.storage.from("pdfs").remove([filePath]);
        throw databaseError;
      }

      setSubjectId("");
      setTitle("");
      setCategory("");
      setPdfFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadUploadedPdfs();
      setSuccessMessage("PDF-en ble lastet opp.");
    } catch (error) {
      console.error("Kunne ikke laste opp PDF:", error);
      setErrorMessage("Kunne ikke laste opp PDF-en.");
    } finally {
      setIsUploading(false);
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
        currentPdfs.filter(
          (currentPdf) => currentPdf.id !== pdf.id,
        ),
      );

      setSuccessMessage("PDF-en ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette PDF:", error);
      setErrorMessage("Kunne ikke slette PDF-en.");
    } finally {
      setDeletingPdfId(null);
    }
  };

  return {
    fileInputRef,

    subjectId,
    setSubjectId,

    title,
    setTitle,

    category,
    setCategory,

    setPdfFile,

    uploadedPdfs,
    isLoadingPdfs,
    isUploading,
    deletingPdfId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleDelete,
  };
};