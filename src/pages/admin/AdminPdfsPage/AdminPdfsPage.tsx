import "./AdminPdfsPage.css";

import { subjects } from "../../../data/subjects";
import { useAdminPdfs } from "../../../hooks/useAdminPdfs";

const categories = [
  {
    value: "forelesninger",
    label: "Forelesninger",
  },
  {
    value: "pensum",
    label: "Pensum",
  },
  {
    value: "presentasjoner",
    label: "Presentasjoner",
  },
  {
    value: "formler",
    label: "Formelark",
  },
];

export const AdminPdfsPage = () => {
  const {
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
  } = useAdminPdfs();

  const getCategoryLabel = (pdfCategory: string) => {
    return (
      categories.find((categoryOption) => categoryOption.value === pdfCategory)
        ?.label ?? pdfCategory
    );
  };

  const pdfsGroupedBySubject = subjects
    .map((subject) => {
      const pdfs = uploadedPdfs.filter((pdf) => pdf.subjectId === subject.id);

      return {
        subject,
        pdfs,
      };
    })
    .filter((group) => group.pdfs.length > 0);

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer PDF-er</h1>

      <p className="page-description">
        Last opp PDF-er og knytt dem til riktig fag, kategori og undertema.
      </p>

      <section className="admin-pdf-card">
        <h2>Last opp ny PDF</h2>

        <form className="admin-pdf-form" onSubmit={handleSubmit}>
          <label htmlFor="subject">Fag</label>

          <select
            id="subject"
            value={subjectId}
            onChange={(event) => handleSubjectChange(event.target.value)}
            required
          >
            <option value="">Velg fag</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} – {subject.name}
              </option>
            ))}
          </select>

          <label htmlFor="topic">Tema</label>

          <select
            id="topic"
            value={topicId}
            onChange={(event) => handleTopicChange(event.target.value)}
            disabled={!subjectId || isLoadingStructure}
            required
          >
            <option value="">
              {!subjectId
                ? "Velg fag først"
                : availableTopics.length === 0
                  ? "Ingen temaer i faget"
                  : "Velg tema"}
            </option>

            {availableTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>

          <label htmlFor="subtopic">Undertema</label>

          <select
            id="subtopic"
            value={subtopicId}
            onChange={(event) => setSubtopicId(event.target.value)}
            disabled={!topicId || isLoadingStructure}
            required
          >
            <option value="">
              {!topicId
                ? "Velg tema først"
                : availableSubtopics.length === 0
                  ? "Ingen undertemaer"
                  : "Velg undertema"}
            </option>

            {availableSubtopics.map((subtopic) => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.name}
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
              <option key={categoryOption.value} value={categoryOption.value}>
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
            onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
            required
          />

          {errorMessage && (
            <p className="admin-pdf-message admin-pdf-error">{errorMessage}</p>
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
        <div className="uploaded-pdfs-heading">
          <div>
            <h2>Opplastede PDF-er</h2>

            {!isLoadingPdfs && (
              <p>
                {uploadedPdfs.length}{" "}
                {uploadedPdfs.length === 1 ? "PDF" : "PDF-er"}
              </p>
            )}
          </div>
        </div>

        {isLoadingPdfs || isLoadingStructure ? (
          <p>Laster PDF-er...</p>
        ) : uploadedPdfs.length === 0 ? (
          <p>Ingen PDF-er er lastet opp gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-pdf-subject-groups">
            {pdfsGroupedBySubject.map(({ subject, pdfs }) => (
              <details key={subject.id} className="uploaded-pdf-subject-group">
                <summary className="uploaded-pdf-subject-heading">
                  <div>
                    <h3>
                      {subject.code} – {subject.name}
                    </h3>

                    <p>
                      {pdfs.length} {pdfs.length === 1 ? "PDF" : "PDF-er"}
                    </p>
                  </div>

                  <span className="uploaded-pdf-subject-toggle">Åpne</span>
                </summary>

                <div className="uploaded-pdf-list">
                  {pdfs.map((pdf) => {
                    const pdfTopics = topics.filter(
                      (topic) => topic.subjectId === pdf.subjectId,
                    );

                    return (
                      <article key={pdf.id} className="uploaded-pdf-item">
                        <div className="uploaded-pdf-information">
                          <div className="uploaded-pdf-heading">
                            <div className="uploaded-pdf-title-group">
                              <h3>{pdf.title}</h3>
                            </div>

                            <span className="uploaded-pdf-category">
                              {getCategoryLabel(pdf.category)}
                            </span>
                          </div>

                          <div className="uploaded-pdf-topic-status">
                            <div className="uploaded-pdf-status-item">
                              <span>Tema</span>

                              <strong>{pdf.topicName ?? "Ikke valgt"}</strong>
                            </div>

                            <div className="uploaded-pdf-status-item">
                              <span>Undertema</span>

                              <strong>
                                {pdf.subtopicName ?? "Ikke valgt"}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="uploaded-pdf-controls">
                          <div className="uploaded-pdf-subtopic-field">
                            <label htmlFor={`pdf-subtopic-${pdf.id}`}>
                              Endre undertema
                            </label>

                            <select
                              id={`pdf-subtopic-${pdf.id}`}
                              value={pdf.subtopicId ?? ""}
                              disabled={updatingPdfId === pdf.id}
                              onChange={(event) =>
                                handlePdfSubtopicChange(
                                  pdf.id,
                                  event.target.value,
                                )
                              }
                            >
                              <option value="">
                                Ikke koblet til undertema
                              </option>

                              {pdfTopics.map((topic) => {
                                const topicSubtopics = subtopics.filter(
                                  (subtopic) => subtopic.topicId === topic.id,
                                );

                                if (topicSubtopics.length === 0) {
                                  return null;
                                }

                                return (
                                  <optgroup key={topic.id} label={topic.name}>
                                    {topicSubtopics.map((subtopic) => (
                                      <option
                                        key={subtopic.id}
                                        value={subtopic.id}
                                      >
                                        {subtopic.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                );
                              })}
                            </select>

                            {updatingPdfId === pdf.id && (
                              <span className="uploaded-pdf-updating">
                                Oppdaterer...
                              </span>
                            )}
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
                              disabled={
                                deletingPdfId === pdf.id ||
                                updatingPdfId === pdf.id
                              }
                              onClick={() => handleDelete(pdf)}
                            >
                              {deletingPdfId === pdf.id
                                ? "Sletter..."
                                : "Slett"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
