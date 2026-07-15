import "./AdminVideosPage.css";
import { subjects } from "../../data/subjects";
import { useAdminVideos } from "../../hooks/useAdminVideos";

export const AdminVideosPage = () => {
  const {
    subjectId,
    setSubjectId,

    topic,
    setTopic,

    title,
    setTitle,

    youtubeId,
    setYoutubeId,

    editingVideo,

    uploadedVideos,
    isLoadingVideos,
    isSaving,
    deletingVideoId,

    errorMessage,
    successMessage,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  } = useAdminVideos();

  const getSubjectLabel = (videoSubjectId: string) => {
    const subject = subjects.find(
      (currentSubject) => currentSubject.id === videoSubjectId,
    );

    return subject
      ? `${subject.code} – ${subject.name}`
      : videoSubjectId.toUpperCase();
  };

  const getYoutubeEmbedUrl = (id: string) => {
    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer videoer</h1>

      <p className="page-description">
        Opprett, rediger og slett videoer på nettsiden.
      </p>

      <div className="admin-videos-layout">
        <section className="admin-video-card">
          <h2>
            {editingVideo ? "Rediger video" : "Opprett ny video"}
          </h2>

          <form className="admin-video-form" onSubmit={handleSubmit}>
            <label htmlFor="video-subject">Fag</label>

            <select
              id="video-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              disabled={Boolean(editingVideo)}
              required
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>

            <label htmlFor="video-topic">Tema</label>

            <input
              id="video-topic"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="For eksempel Mengdelære"
              required
            />

            <label htmlFor="video-title">Tittel</label>

            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="For eksempel Mengder og delmengder"
              required
            />

            <label htmlFor="video-youtube-id">YouTube-ID</label>

            <input
              id="video-youtube-id"
              type="text"
              value={youtubeId}
              onChange={(event) => setYoutubeId(event.target.value)}
              placeholder="For eksempel wbBY2tTqXDA"
              required
            />

            {errorMessage && (
              <p className="admin-video-message admin-video-error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="admin-video-message admin-video-success">
                {successMessage}
              </p>
            )}

            <div className="admin-video-form-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Lagrer..."
                  : editingVideo
                    ? "Lagre endringer"
                    : "Opprett video"}
              </button>

              {editingVideo && (
                <button
                  type="button"
                  className="cancel-video-edit-button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  Avbryt redigering
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-video-card video-preview">
          <p className="preview-label">Forhåndsvisning</p>

          <h2>{title.trim() || "Tittel på videoen"}</h2>

          <p className="video-preview-topic">
            {topic.trim() || "Temaet vises her."}
          </p>

          {youtubeId.trim() ? (
            <iframe
              className="video-preview-frame"
              src={getYoutubeEmbedUrl(youtubeId.trim())}
              title={title.trim() || "Forhåndsvisning av video"}
              allowFullScreen
            />
          ) : (
            <div className="video-preview-placeholder">
              Videoen vises her når du skriver inn en YouTube-ID.
            </div>
          )}
        </section>
      </div>

      <section className="admin-video-card uploaded-videos-section">
        <h2>Opprettede videoer</h2>

        {isLoadingVideos ? (
          <p>Laster videoer...</p>
        ) : uploadedVideos.length === 0 ? (
          <p>Ingen videoer er opprettet gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-video-list">
            {uploadedVideos.map((video) => (
              <article key={video.id} className="uploaded-video-item">
                <div>
                  <h3>{video.title}</h3>

                  <p>{video.topic}</p>

                  <span>{getSubjectLabel(video.subjectId)}</span>
                </div>

                <div className="uploaded-video-actions">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Åpne
                  </a>

                  <button
                    type="button"
                    className="edit-video-button"
                    onClick={() => handleEdit(video)}
                  >
                    Rediger
                  </button>

                  <button
                    type="button"
                    className="delete-video-button"
                    disabled={deletingVideoId === video.id}
                    onClick={() => handleDelete(video)}
                  >
                    {deletingVideoId === video.id
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