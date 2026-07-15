import "./AdminPdfsPage.css";
import { subjects } from "../../data/subjects";
import { useAdminPdfs } from "../../hooks/useAdminPdfs";

const categories = [
  { value: "forelesninger", label: "Forelesninger" },
  { value: "pensum", label: "Pensum" },
  { value: "presentasjoner", label: "Presentasjoner" },
  { value: "formler", label: "Formelark" },
  { value: "eksamener", label: "Eksamener" },
];

export const AdminPdfsPage = () => {
  const {
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
  } = useAdminPdfs();

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
        (categoryOption) => categoryOption.value === pdfCategory,
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