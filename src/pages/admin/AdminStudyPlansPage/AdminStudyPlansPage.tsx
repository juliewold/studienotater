import "./AdminStudyPlansPage.css";
import { subjects } from "../../../data/subjects";
import { useAdminStudyPlans } from "../../../hooks/useAdminStudyPlans";

export const AdminStudyPlansPage = () => {
  const {
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
  } = useAdminStudyPlans();

  const getSubjectLabel = (topicSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) =>
        currentSubject.id === topicSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : topicSubjectId.toUpperCase();
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer studieplaner</h1>

      <p className="page-description">
        Opprett temaer, legg til pensum og oppgaver, og koble
        ressurser til studieplanen.
      </p>

      <section className="admin-study-plan-card">
        <h2>
          {editingTopic
            ? "Rediger studietema"
            : "Opprett nytt studietema"}
        </h2>

        <form
          className="admin-study-plan-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-study-plan-row">
            <div>
              <label htmlFor="study-plan-subject">Fag</label>

              <select
                id="study-plan-subject"
                value={subjectId}
                onChange={(event) =>
                  handleSubjectChange(event.target.value)
                }
                disabled={Boolean(editingTopic)}
                required
              >
                <option value="">Velg fag</option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.code} – {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="study-plan-order">
                Rekkefølge
              </label>

              <input
                id="study-plan-order"
                type="number"
                min="0"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value)
                }
                required
              />
            </div>
          </div>

          {editingTopic && (
            <p className="admin-study-plan-help">
              Faget kan ikke endres når temaet redigeres.
            </p>
          )}

          <label htmlFor="study-plan-title">
            Tittel på tema
          </label>

          <input
            id="study-plan-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="For eksempel Mengder og relasjoner"
            required
          />

          <div className="admin-study-plan-textareas">
            <div>
              <label htmlFor="study-plan-reading">
                Pensum / lesestoff
              </label>

              <textarea
                id="study-plan-reading"
                value={reading}
                onChange={(event) =>
                  setReading(event.target.value)
                }
                placeholder={
                  "Skriv ett punkt per linje:\nRA kap. 1\nRA kap. 6"
                }
                rows={6}
              />
            </div>

            <div>
              <label htmlFor="study-plan-lectures">
                Forelesninger
              </label>

              <textarea
                id="study-plan-lectures"
                value={lectures}
                onChange={(event) =>
                  setLectures(event.target.value)
                }
                placeholder={
                  "Skriv én forelesning per linje:\nForelesning 1\nForelesning 2"
                }
                rows={6}
              />
            </div>

            <div>
              <label htmlFor="study-plan-exercises">
                Øvingsforelesningsoppgaver
              </label>

              <textarea
                id="study-plan-exercises"
                value={exercises}
                onChange={(event) =>
                  setExercises(event.target.value)
                }
                placeholder={
                  "Skriv én oppgave per linje:\nØF-oppgave 1"
                }
                rows={6}
              />
            </div>

            <div>
              <label htmlFor="study-plan-assignments">
                Innleveringer / øvinger
              </label>

              <textarea
                id="study-plan-assignments"
                value={assignments}
                onChange={(event) =>
                  setAssignments(event.target.value)
                }
                placeholder={
                  "Skriv én øving per linje:\nØving 1"
                }
                rows={6}
              />
            </div>

            <div>
              <label htmlFor="study-plan-stack">
                STACK-oppgaver
              </label>

              <textarea
                id="study-plan-stack"
                value={stack}
                onChange={(event) =>
                  setStack(event.target.value)
                }
                placeholder={
                  "Skriv én STACK-oppgave per linje:\nStack #1"
                }
                rows={6}
              />
            </div>
          </div>

          <section className="admin-study-plan-resources">
            <div className="admin-study-plan-resource-heading">
              <h3>Koble ressurser</h3>

              <p>
                Velg PDF-er, notater og videoer som hører til
                dette temaet.
              </p>
            </div>

            {!subjectId ? (
              <p className="admin-study-plan-help">
                Velg et fag for å se tilgjengelige ressurser.
              </p>
            ) : isLoadingResources ? (
              <p>Laster ressurser...</p>
            ) : (
              <div className="admin-resource-columns">
                <div className="admin-resource-group">
                  <h3>PDF-er</h3>

                  {availablePdfs.length === 0 ? (
                    <p>Ingen PDF-er er lagt til i faget.</p>
                  ) : (
                    <div className="admin-resource-list">
                      {availablePdfs.map((pdf) => (
                        <label
                          key={pdf.id}
                          className="admin-resource-option"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPdfIds.includes(
                              pdf.id,
                            )}
                            onChange={() =>
                              togglePdf(pdf.id)
                            }
                          />

                          <span>{pdf.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-resource-group">
                  <h3>Notater</h3>

                  {availableNotes.length === 0 ? (
                    <p>Ingen notater er lagt til i faget.</p>
                  ) : (
                    <div className="admin-resource-list">
                      {availableNotes.map((note) => (
                        <label
                          key={note.id}
                          className="admin-resource-option"
                        >
                          <input
                            type="checkbox"
                            checked={selectedNoteIds.includes(
                              note.id,
                            )}
                            onChange={() =>
                              toggleNote(note.id)
                            }
                          />

                          <span>{note.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="admin-resource-group">
                  <h3>Videoer</h3>

                  {availableVideos.length === 0 ? (
                    <p>Ingen videoer er lagt til i faget.</p>
                  ) : (
                    <div className="admin-resource-list">
                      {availableVideos.map((video) => (
                        <label
                          key={video.id}
                          className="admin-resource-option"
                        >
                          <input
                            type="checkbox"
                            checked={selectedVideoIds.includes(
                              video.id,
                            )}
                            onChange={() =>
                              toggleVideo(video.id)
                            }
                          />

                          <span>
                            {video.topic}: {video.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {errorMessage && (
            <p className="admin-study-plan-message admin-study-plan-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="admin-study-plan-message admin-study-plan-success">
              {successMessage}
            </p>
          )}

          <div className="admin-study-plan-form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Lagrer..."
                : editingTopic
                  ? "Lagre endringer"
                  : "Opprett tema"}
            </button>

            {editingTopic && (
              <button
                type="button"
                className="cancel-study-topic-button"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Avbryt redigering
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-study-plan-card study-topic-list-section">
        <h2>
          {subjectId
            ? "Temaer i valgt fag"
            : "Opprettede studietemaer"}
        </h2>

        {isLoadingTopics ? (
          <p>Laster studieplaner...</p>
        ) : !subjectId ? (
          <p>Velg et fag i skjemaet for å se temaene.</p>
        ) : subjectTopics.length === 0 ? (
          <p>Ingen temaer er opprettet i dette faget ennå.</p>
        ) : (
          <div className="study-topic-list">
            {subjectTopics.map((topic) => {
              const readingItems = topic.items.filter(
                (item) => item.type === "reading",
              );

              const lectureItems = topic.items.filter(
                (item) => item.type === "lecture",
              );

              const taskItems = topic.items.filter(
                (item) =>
                  item.type === "exercise" ||
                  item.type === "assignment" ||
                  item.type === "stack",
              );

              const pdfCount = topic.resources.filter(
                (resource) =>
                  resource.resourceType === "pdf",
              ).length;

              const noteCount = topic.resources.filter(
                (resource) =>
                  resource.resourceType === "note",
              ).length;

              const videoCount = topic.resources.filter(
                (resource) =>
                  resource.resourceType === "video",
              ).length;

              return (
                <article
                  key={topic.id}
                  className="study-topic-item"
                >
                  <div className="study-topic-content">
                    <div className="study-topic-heading">
                      <div>
                        <p className="study-topic-order">
                          Rekkefølge {topic.sortOrder}
                        </p>

                        <h3>{topic.title}</h3>

                        <span>
                          {getSubjectLabel(topic.subjectId)}
                        </span>
                      </div>
                    </div>

                    <div className="study-topic-summary">
                      <span>
                        {readingItems.length} pensumpunkter
                      </span>

                      <span>
                        {lectureItems.length} forelesninger
                      </span>

                      <span>
                        {taskItems.length} oppgaver
                      </span>

                      <span>{pdfCount} PDF-er</span>

                      <span>{noteCount} notater</span>

                      <span>{videoCount} videoer</span>
                    </div>
                  </div>

                  <div className="study-topic-actions">
                    <button
                      type="button"
                      className="edit-study-topic-button"
                      onClick={() => handleEdit(topic)}
                    >
                      Rediger
                    </button>

                    <button
                      type="button"
                      className="delete-study-topic-button"
                      disabled={deletingTopicId === topic.id}
                      onClick={() => handleDelete(topic)}
                    >
                      {deletingTopicId === topic.id
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