import "./AdminExamsPage.css";
import { subjects } from "../../../data/subjects";
import { useAdminExams } from "../../../hooks/admin/useAdminExams";
import { useAdminUpcomingExams } from "../../../hooks/admin/useAdminUpcomingExams";

const semesters = [
  { value: "Vår", label: "Vår" },
  { value: "Høst", label: "Høst" },
  { value: "Kont", label: "Kont" },
];

export const AdminExamsPage = () => {
  const {
    examFileInputRef,
    solutionFileInputRef,
    mySolutionFileInputRef,

    subjectId: previousExamSubjectId,
    setSubjectId: setPreviousExamSubjectId,

    title,
    setTitle,

    semester,
    setSemester,

    year,
    setYear,

    relevantTasks,
    setRelevantTasks,

    setExamFile,
    setSolutionFile,
    setMySolutionFile,

    editingExam,

    uploadedExams,
    isLoadingExams: isLoadingPreviousExams,
    isSaving: isSavingPreviousExam,
    deletingExamId: deletingPreviousExamId,

    errorMessage: previousExamError,
    successMessage: previousExamSuccess,

    getFileUrl,
    handleSubmit: handlePreviousExamSubmit,
    handleEdit: handlePreviousExamEdit,
    cancelEdit: cancelPreviousExamEdit,
    handleDelete: handlePreviousExamDelete,
  } = useAdminExams();

  const {
    subjectId: upcomingSubjectId,
    setSubjectId: setUpcomingSubjectId,

    examDate,
    setExamDate,

    startTime,
    setStartTime,

    note,
    setNote,

    editingExam: editingUpcomingExam,

    upcomingExams,
    isLoadingExams: isLoadingUpcomingExams,
    isSaving: isSavingUpcomingExam,
    deletingExamId: deletingUpcomingExamId,

    errorMessage: upcomingExamError,
    successMessage: upcomingExamSuccess,

    handleSubmit: handleUpcomingExamSubmit,
    handleEdit: handleUpcomingExamEdit,
    cancelEdit: cancelUpcomingExamEdit,
    handleDelete: handleUpcomingExamDelete,
  } = useAdminUpcomingExams();

  const getSubjectLabel = (examSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) => currentSubject.id === examSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : examSubjectId.toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("no-NO");
  };

  const formatTime = (time: string | null) => {
    return time ? time.slice(0, 5) : null;
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer eksamener</h1>

      <p className="page-description">
        Administrer tidligere eksamensoppgaver og kommende eksamensdatoer.
      </p>

      <section className="admin-exam-area">
        <div className="admin-exam-section-heading">
          <p className="admin-exam-section-label">Eksamensarkiv</p>
          <h2>Tidligere eksamener</h2>
          <p>
            Last opp eksamensoppgaver og løsningsforslag som skal vises på
            fagsiden.
          </p>
        </div>

        <section className="admin-exam-card">
          <h2>{editingExam ? "Rediger eksamen" : "Opprett ny eksamen"}</h2>

          <form className="admin-exam-form" onSubmit={handlePreviousExamSubmit}>
            <label htmlFor="exam-subject">Fag</label>

            <select
              id="exam-subject"
              value={previousExamSubjectId}
              onChange={(event) => setPreviousExamSubjectId(event.target.value)}
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

            <label htmlFor="exam-relevant-tasks">Relevante oppgaver</label>

            <input
              id="exam-relevant-tasks"
              type="text"
              value={relevantTasks}
              onChange={(event) => setRelevantTasks(event.target.value)}
              placeholder="1, 2, 3a, 3b, 5, 7"
            />

            <p className="admin-exam-help">
              Skriv oppgavene som er relevante, separert med komma.
            </p>

            <label htmlFor="exam-file">Oppgavesett</label>

            <input
              ref={examFileInputRef}
              id="exam-file"
              type="file"
              accept="application/pdf"
              onChange={(event) => setExamFile(event.target.files?.[0] ?? null)}
            />

            {editingExam?.examFilePath && (
              <p className="admin-exam-help">
                Det finnes allerede et oppgavesett. Velg en ny fil bare dersom
                du vil erstatte den.
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

            <label htmlFor="my-solution-file">Min besvarelse</label>

            <input
              ref={mySolutionFileInputRef}
              id="my-solution-file"
              type="file"
              accept="application/pdf"
              onChange={(event) =>
                setMySolutionFile(event.target.files?.[0] ?? null)
              }
            />

            {editingExam?.mySolutionFilePath && (
              <p className="admin-exam-help">
                Det finnes allerede en besvarelse. Velg en ny fil bare dersom du
                vil erstatte den.
              </p>
            )}

            {previousExamError && (
              <p className="admin-exam-message admin-exam-error">
                {previousExamError}
              </p>
            )}

            {previousExamSuccess && (
              <p className="admin-exam-message admin-exam-success">
                {previousExamSuccess}
              </p>
            )}

            <div className="admin-exam-form-actions">
              <button type="submit" disabled={isSavingPreviousExam}>
                {isSavingPreviousExam
                  ? "Lagrer..."
                  : editingExam
                    ? "Lagre endringer"
                    : "Opprett eksamen"}
              </button>

              {editingExam && (
                <button
                  type="button"
                  className="cancel-exam-edit-button"
                  onClick={cancelPreviousExamEdit}
                  disabled={isSavingPreviousExam}
                >
                  Avbryt redigering
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-exam-card uploaded-exams-section">
          <h2>Opprettede eksamener</h2>

          {isLoadingPreviousExams ? (
            <p>Laster eksamener...</p>
          ) : uploadedExams.length === 0 ? (
            <p>
              Ingen tidligere eksamener er opprettet gjennom adminpanelet ennå.
            </p>
          ) : (
            <div className="uploaded-exam-list">
              {uploadedExams.map((exam) => {
                const examFileUrl = getFileUrl(exam.examFilePath);
                const solutionFileUrl = getFileUrl(exam.solutionFilePath);
                const mySolutionFileUrl = getFileUrl(exam.mySolutionFilePath);

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
                          {exam.solutionFilePath ? "Lastet opp" : "Ikke valgt"}
                        </span>

                        <span>
                          Min besvarelse:{" "}
                          {exam.mySolutionFilePath
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

                      {mySolutionFileUrl && (
                        <a
                          href={mySolutionFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Min besvarelse
                        </a>
                      )}

                      <button
                        type="button"
                        className="edit-exam-button"
                        onClick={() => handlePreviousExamEdit(exam)}
                      >
                        Rediger
                      </button>

                      <button
                        type="button"
                        className="delete-exam-button"
                        disabled={deletingPreviousExamId === exam.id}
                        onClick={() => handlePreviousExamDelete(exam)}
                      >
                        {deletingPreviousExamId === exam.id
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
      </section>

      <section className="admin-exam-area upcoming-exams-admin-area">
        <div className="admin-exam-section-heading">
          <p className="admin-exam-section-label">Eksamenskalender</p>
          <h2>Kommende eksamensdatoer</h2>
          <p>Legg inn dato, klokkeslett og sted for kommende eksamener.</p>
        </div>

        <section className="admin-exam-card">
          <h2>
            {editingUpcomingExam
              ? "Rediger eksamensdato"
              : "Legg til eksamensdato"}
          </h2>

          <form className="admin-exam-form" onSubmit={handleUpcomingExamSubmit}>
            <label htmlFor="upcoming-exam-subject">Fag</label>

            <select
              id="upcoming-exam-subject"
              value={upcomingSubjectId}
              onChange={(event) => setUpcomingSubjectId(event.target.value)}
              disabled={Boolean(editingUpcomingExam)}
              required
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>

            {editingUpcomingExam && (
              <p className="admin-exam-help">
                Faget kan ikke endres når eksamensdatoen redigeres.
              </p>
            )}

            <div className="admin-exam-row">
              <div>
                <label htmlFor="upcoming-exam-date">Dato</label>

                <input
                  id="upcoming-exam-date"
                  type="date"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="upcoming-exam-time">Klokkeslett</label>

                <input
                  id="upcoming-exam-time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
              </div>
            </div>

            <label htmlFor="upcoming-exam-note">Merknad</label>

            <textarea
              id="upcoming-exam-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Valgfri informasjon om eksamenen"
              rows={4}
            />

            {upcomingExamError && (
              <p className="admin-exam-message admin-exam-error">
                {upcomingExamError}
              </p>
            )}

            {upcomingExamSuccess && (
              <p className="admin-exam-message admin-exam-success">
                {upcomingExamSuccess}
              </p>
            )}

            <div className="admin-exam-form-actions">
              <button type="submit" disabled={isSavingUpcomingExam}>
                {isSavingUpcomingExam
                  ? "Lagrer..."
                  : editingUpcomingExam
                    ? "Lagre endringer"
                    : "Legg til eksamensdato"}
              </button>

              {editingUpcomingExam && (
                <button
                  type="button"
                  className="cancel-exam-edit-button"
                  onClick={cancelUpcomingExamEdit}
                  disabled={isSavingUpcomingExam}
                >
                  Avbryt redigering
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-exam-card uploaded-exams-section">
          <h2>Registrerte eksamensdatoer</h2>

          {isLoadingUpcomingExams ? (
            <p>Laster eksamensdatoer...</p>
          ) : upcomingExams.length === 0 ? (
            <p>Ingen eksamensdatoer er registrert ennå.</p>
          ) : (
            <div className="uploaded-exam-list">
              {upcomingExams.map((exam) => (
                <article key={exam.id} className="uploaded-exam-item">
                  <div className="uploaded-exam-content">
                    <h3>{getSubjectLabel(exam.subjectId)}</h3>

                    <p>{formatDate(exam.examDate)}</p>

                    <div className="upcoming-exam-details">
                      {exam.startTime && (
                        <span>Klokken {formatTime(exam.startTime)}</span>
                      )}

                      {exam.note && <span>{exam.note}</span>}
                    </div>
                  </div>

                  <div className="uploaded-exam-actions">
                    <button
                      type="button"
                      className="edit-exam-button"
                      onClick={() => handleUpcomingExamEdit(exam)}
                    >
                      Rediger
                    </button>

                    <button
                      type="button"
                      className="delete-exam-button"
                      disabled={deletingUpcomingExamId === exam.id}
                      onClick={() => handleUpcomingExamDelete(exam)}
                    >
                      {deletingUpcomingExamId === exam.id
                        ? "Sletter..."
                        : "Slett"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};
