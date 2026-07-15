import "./AdminPdfsPage.css";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { supabase } from "../../lib/supabase";
import { subjects } from "../../data/subjects";
import {
  deletePdf,
  getPdfsBySubject,
  type DatabasePdf,
} from "../../services/pdfsService";

const categories = [
  { value: "forelesninger", label: "Forelesninger" },
  { value: "pensum", label: "Pensum" },
  { value: "presentasjoner", label: "Presentasjoner" },
  { value: "formler", label: "Formelark" },
  { value: "eksamener", label: "Eksamener" },
];

export const AdminPdfsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [uploadedPdfs, setUploadedPdfs] = useState<DatabasePdf[]>([]);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(true);
  const [deletingPdfId, setDeletingPdfId] = useState<string | null>(
    null,
  );

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUploadedPdfs = useCallback(async () => {
    setIsLoadingPdfs(true);

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

  const getSubjectLabel = (pdfSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) => currentSubject.id === pdfSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : pdfSubjectId.toUpperCase();
  };

  const getCategoryLabel = (pdfCategory: string) => {
    return (
      categories.find(
        (categoryOption) =>
          categoryOption.value === pdfCategory,
      )?.label ?? pdfCategory
    );
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer PDF-er</h1>

      <p className="page-description">
        Last opp PDF-er og knytt dem til riktig fag og kategori.
      </p>

      <section className="admin-pdf-card">
        <h2>Last opp ny PDF</h2>

        <form className="admin-pdf-form" onSubmit={handleSubmit}>
          <label htmlFor="subject">Fag</label>

          <select
            id="subject"
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            required
          >
            <option value="">Velg fag</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} – {subject.name}
              </option>
            ))}
          </select>

          <label htmlFor="title">Tittel</label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="For eksempel Kapittel 1"
            required
          />

          <label htmlFor="category">Kategori</label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="">Velg kategori</option>

            {categories.map((categoryOption) => (
              <option
                key={categoryOption.value}
                value={categoryOption.value}
              >
                {categoryOption.label}
              </option>
            ))}
          </select>

          <label htmlFor="pdfFile">PDF-fil</label>

          <input
            ref={fileInputRef}
            id="pdfFile"
            type="file"
            accept="application/pdf"
            onChange={(event) =>
              setPdfFile(event.target.files?.[0] ?? null)
            }
            required
          />

          {errorMessage && (
            <p className="admin-pdf-message admin-pdf-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="admin-pdf-message admin-pdf-success">
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Laster opp..." : "Last opp PDF"}
          </button>
        </form>
      </section>

      <section className="admin-pdf-card uploaded-pdfs-section">
        <h2>Opplastede PDF-er</h2>

        {isLoadingPdfs ? (
          <p>Laster PDF-er...</p>
        ) : uploadedPdfs.length === 0 ? (
          <p>Ingen PDF-er er lastet opp gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-pdf-list">
            {uploadedPdfs.map((pdf) => (
              <article key={pdf.id} className="uploaded-pdf-item">
                <div>
                  <h3>{pdf.title}</h3>

                  <p>{getSubjectLabel(pdf.subjectId)}</p>

                  <span>{getCategoryLabel(pdf.category)}</span>
                </div>

                <div className="uploaded-pdf-actions">
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne
                  </a>

                  <button
                    type="button"
                    className="delete-pdf-button"
                    disabled={deletingPdfId === pdf.id}
                    onClick={() => handleDelete(pdf)}
                  >
                    {deletingPdfId === pdf.id
                      ? "Sletter..."
                      : "Slett"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};