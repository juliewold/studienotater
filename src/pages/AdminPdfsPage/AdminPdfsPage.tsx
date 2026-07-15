import "./AdminPdfsPage.css";
import {
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { supabase } from "../../lib/supabase";
import { subjects } from "../../data/subjects";

const categories = [
  { value: "forelesninger", label: "Forelesninger" },
  { value: "pensum", label: "Pensum" },
  { value: "presentasjoner", label: "Presentasjoner" },
  { value: "eksamener", label: "Eksamener" },
];

export const AdminPdfsPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

    const filePath = `${subjectId}/${category}/${Date.now()}-${safeFileName}`;

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

      setSuccessMessage("PDF-en ble lastet opp.");
    } catch (error) {
      console.error("Kunne ikke laste opp PDF:", error);
      setErrorMessage("Kunne ikke laste opp PDF-en.");
    } finally {
      setIsUploading(false);
    }
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
    </main>
  );
};