import "./AdminExamsPage.css";
import { subjects } from "../../data/subjects";
import { useAdminExams } from "../../hooks/useAdminExams";

const semesters = [
  { value: "Vår", label: "Vår" },
  { value: "Høst", label: "Høst" },
  { value: "Kont", label: "Kont" },
];

export const AdminExamsPage = () => {
  const {
    examFileInputRef,
    solutionFileInputRef,

    subjectId,
    setSubjectId,

    title,
    setTitle,

    semester,
    setSemester,

    year,
    setYear,

    setExamFile,
    setSolutionFile,

    editingExam,

    uploadedExams,
    isLoadingExams,
    isSaving,
    deletingExamId,

    errorMessage,
    successMessage,

    getFileUrl,
    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  } = useAdminExams();

  const getSubjectLabel = (examSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) => currentSubject.id === examSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : examSubjectId.toUpperCase();
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer eksamener</h1>

      <p className="page-description">
        Last opp tidligere eksamensoppgaver og løsningsforslag.
      </p>

      <section className="admin-exam-card">
        <h2>
          {editingExam ? "Rediger eksamen" : "Opprett ny eksamen"}
        </h2>

        <form className="admin-exam-form" onSubmit={handleSubmit}>
          <label htmlFor="exam-subject">Fag</label>

          <select
            id="exam-subject"
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            disabled={Boolean(editingExam)}
            required
          >
            <option value="">Velg fag</option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} – {subject.name}
              </option>
            ))}
          </select>

          {editingExam && (
            <p className="admin-exam-help">
              Faget kan ikke endres når eksamenen redigeres.
            </p>
          )}

          <label htmlFor="exam-title">Tittel</label>

          <input
            id="exam-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="For eksempel Ordinær eksamen"
            required
          />

          <div className="admin-exam-row">
            <div>
              <label htmlFor="exam-semester">Semester</label>

              <select
                id="exam-semester"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
                required
              >
                <option value="">Velg semester</option>

                {semesters.map((semesterOption) => (
                  <option
                    key={semesterOption.value}
                    value={semesterOption.value}
                  >
                    {semesterOption.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="exam-year">År</label>

              <input
                id="exam-year"
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2026"
                required
              />
            </div>
          </div>

          <label htmlFor="exam-file">Oppgavesett</label>

          <input
            ref={examFileInputRef}
            id="exam-file"
            type="file"
            accept="application/pdf"
            onChange={(event) =>
              setExamFile(event.target.files?.[0] ?? null)
            }
          />

          {editingExam?.examFilePath && (
            <p className="admin-exam-help">
              Det finnes allerede et oppgavesett. Velg en ny fil bare
              dersom du vil erstatte den.
            </p>
          )}

          <label htmlFor="solution-file">Løsningsforslag</label>

          <input
            ref={solutionFileInputRef}
            id="solution-file"
            type="file"
            accept="application/pdf"
            onChange={(event) =>
              setSolutionFile(event.target.files?.[0] ?? null)
            }
          />

          {editingExam?.solutionFilePath && (
            <p className="admin-exam-help">
              Det finnes allerede et løsningsforslag. Velg en ny fil
              bare dersom du vil erstatte den.
            </p>
          )}

          {errorMessage && (
            <p className="admin-exam-message admin-exam-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="admin-exam-message admin-exam-success">
              {successMessage}
            </p>
          )}

          <div className="admin-exam-form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Lagrer..."
                : editingExam
                  ? "Lagre endringer"
                  : "Opprett eksamen"}
            </button>

            {editingExam && (
              <button
                type="button"
                className="cancel-exam-edit-button"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Avbryt redigering
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-exam-card uploaded-exams-section">
        <h2>Opprettede eksamener</h2>

        {isLoadingExams ? (
          <p>Laster eksamener...</p>
        ) : uploadedExams.length === 0 ? (
          <p>Ingen eksamener er opprettet gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-exam-list">
            {uploadedExams.map((exam) => {
              const examFileUrl = getFileUrl(exam.examFilePath);
              const solutionFileUrl = getFileUrl(
                exam.solutionFilePath,
              );

              return (
                <article key={exam.id} className="uploaded-exam-item">
                  <div className="uploaded-exam-content">
                    <h3>{exam.title}</h3>

                    <p>
                      {exam.semester} {exam.year}
                    </p>

                    <span>{getSubjectLabel(exam.subjectId)}</span>

                    <div className="uploaded-exam-files">
                      <span>
                        Oppgavesett:{" "}
                        {exam.examFilePath ? "Lastet opp" : "Ikke valgt"}
                      </span>

                      <span>
                        Løsningsforslag:{" "}
                        {exam.solutionFilePath
                          ? "Lastet opp"
                          : "Ikke valgt"}
                      </span>
                    </div>
                  </div>

                  <div className="uploaded-exam-actions">
                    {examFileUrl && (
                      <a
                        href={examFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Oppgavesett
                      </a>
                    )}

                    {solutionFileUrl && (
                      <a
                        href={solutionFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Løsning
                      </a>
                    )}

                    <button
                      type="button"
                      className="edit-exam-button"
                      onClick={() => handleEdit(exam)}
                    >
                      Rediger
                    </button>

                    <button
                      type="button"
                      className="delete-exam-button"
                      disabled={deletingExamId === exam.id}
                      onClick={() => handleDelete(exam)}
                    >
                      {deletingExamId === exam.id
                        ? "Sletter..."
                        : "Slett"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};