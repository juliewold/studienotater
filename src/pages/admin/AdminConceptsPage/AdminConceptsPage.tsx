import "./AdminConceptsPage.css";

import { subjects } from "../../../data/subjects";
import { useAdminConcepts } from "../../../hooks/admin/useAdminConcepts";

export const AdminConceptsPage = () => {
  const {
    concepts,

    conceptId,
    subjectId,
    topicId,
    subtopicId,

    topics,
    subtopics,
    conceptLinks,

    isLoadingTopics,
    isLoadingSubtopics,
    isLoadingConceptLinks,
    isSaving,

    errorMessage,
    successMessage,

    handleConceptChange,
    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,
    handleSubmit,
    handleRemoveConceptLink,
  } = useAdminConcepts();

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer konsepter</h1>

      <p className="page-description">
        Koble konsepter til temaer og undertemaer i pensum.
      </p>

      <section className="admin-concepts-card">
        <h2>Koble konsept til pensum</h2>

        <form className="admin-concepts-form" onSubmit={handleSubmit}>
          <label htmlFor="concept">Konsept</label>

          <select
            id="concept"
            value={conceptId}
            onChange={(event) => handleConceptChange(event.target.value)}
            required
          >
            <option value="">Velg konsept</option>

            {concepts.map((concept) => (
              <option key={concept.id} value={concept.id}>
                {concept.name}
              </option>
            ))}
          </select>

          {conceptId && (
            <div className="admin-concept-links">
              <p className="admin-concept-links-label">Koblet til</p>

              {isLoadingConceptLinks ? (
                <p className="admin-concept-links-empty">Laster koblinger...</p>
              ) : conceptLinks.length === 0 ? (
                <p className="admin-concept-links-empty">
                  Konseptet er ikke koblet til noen undertemaer ennå.
                </p>
              ) : (
                <div className="admin-concept-links-list">
                  {conceptLinks.map((link) => (
                    <div key={link.subtopicId} className="admin-concept-link">
                      <div className="admin-concept-link-name">
                        <span>✓</span>

                        <strong>{link.subtopicName}</strong>
                      </div>

                      <button
                        type="button"
                        className="admin-concept-link-remove"
                        onClick={() => handleRemoveConceptLink(link.subtopicId)}
                      >
                        Fjern
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <label htmlFor="concept-subject">Fag</label>

          <select
            id="concept-subject"
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

          <label htmlFor="concept-topic">Tema</label>

          <select
            id="concept-topic"
            value={topicId}
            onChange={(event) => handleTopicChange(event.target.value)}
            disabled={!subjectId || isLoadingTopics}
            required
          >
            <option value="">
              {isLoadingTopics
                ? "Laster temaer..."
                : !subjectId
                  ? "Velg fag først"
                  : "Velg tema"}
            </option>

            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.sortOrder}. {topic.name}
              </option>
            ))}
          </select>

          <label htmlFor="concept-subtopic">Undertema</label>

          <select
            id="concept-subtopic"
            value={subtopicId}
            onChange={(event) => setSubtopicId(event.target.value)}
            disabled={!topicId || isLoadingSubtopics}
            required
          >
            <option value="">
              {isLoadingSubtopics
                ? "Laster undertemaer..."
                : !topicId
                  ? "Velg tema først"
                  : "Velg undertema"}
            </option>

            {subtopics.map((subtopic) => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.sortOrder}. {subtopic.name}
              </option>
            ))}
          </select>

          {errorMessage && (
            <p className="admin-concepts-message admin-concepts-error">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="admin-concepts-message admin-concepts-success">
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Lagrer..." : "Lagre kobling"}
          </button>
        </form>
      </section>
    </main>
  );
};
