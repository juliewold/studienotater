import "./AdminVideosPage.css";
import { useMemo } from "react";
import { subjects } from "../../../data/subjects";
import { useAdminVideos } from "../../../hooks/useAdminVideos";
import type { DatabaseVideo } from "../../../services/videosService";

type AdminSubtopicGroup = {
  id: string;
  name: string;
  sortOrder: number;
  videos: DatabaseVideo[];
};

type AdminTopicGroup = {
  id: string;
  name: string;
  sortOrder: number;
  subtopics: AdminSubtopicGroup[];
};

type AdminSubjectGroup = {
  subjectId: string;
  topics: AdminTopicGroup[];
};

export const AdminVideosPage = () => {
  const {
    subjectId,
    topicId,
    subtopicId,

    topics,
    subtopics,

    title,
    setTitle,

    youtubeId,
    setYoutubeId,

    sortOrder,
    setSortOrder,

    editingVideo,

    uploadedVideos,
    isLoadingVideos,
    isLoadingTopics,
    isLoadingSubtopics,
    isSaving,
    deletingVideoId,

    errorMessage,
    successMessage,

    handleSubjectChange,
    handleTopicChange,
    setSubtopicId,

    handleSubmit,
    handleEdit,
    cancelEdit,
    handleDelete,
  } = useAdminVideos();

  const selectedTopic = topics.find((topic) => topic.id === topicId);

  const selectedSubtopic = subtopics.find(
    (subtopic) => subtopic.id === subtopicId,
  );

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

  const groupedVideos = useMemo<AdminSubjectGroup[]>(() => {
    const subjectGroups = new Map<
      string,
      Map<
        string,
        {
          id: string;
          name: string;
          sortOrder: number;
          subtopics: Map<
            string,
            {
              id: string;
              name: string;
              sortOrder: number;
              videos: DatabaseVideo[];
            }
          >;
        }
      >
    >();

    uploadedVideos.forEach((video) => {
      const subjectTopics = subjectGroups.get(video.subjectId) ?? new Map();

      const topicGroup = subjectTopics.get(video.topicId) ?? {
        id: video.topicId,
        name: video.topic,
        sortOrder: video.topicOrder,
        subtopics: new Map(),
      };

      const subtopicGroup = topicGroup.subtopics.get(video.subtopicId) ?? {
        id: video.subtopicId,
        name: video.subtopic,
        sortOrder: video.subtopicOrder,
        videos: [],
      };

      subtopicGroup.videos.push(video);

      topicGroup.subtopics.set(video.subtopicId, subtopicGroup);

      subjectTopics.set(video.topicId, topicGroup);
      subjectGroups.set(video.subjectId, subjectTopics);
    });

    return Array.from(subjectGroups.entries())
      .map(([groupSubjectId, topicMap]) => ({
        subjectId: groupSubjectId,

        topics: Array.from(topicMap.values())
          .map((topicGroup) => ({
            id: topicGroup.id,
            name: topicGroup.name,
            sortOrder: topicGroup.sortOrder,

            subtopics: Array.from(topicGroup.subtopics.values())
              .map((subtopicGroup) => ({
                id: subtopicGroup.id,
                name: subtopicGroup.name,
                sortOrder: subtopicGroup.sortOrder,

                videos: [...subtopicGroup.videos].sort(
                  (firstVideo, secondVideo) => {
                    const orderComparison =
                      firstVideo.sortOrder - secondVideo.sortOrder;

                    if (orderComparison !== 0) {
                      return orderComparison;
                    }

                    return firstVideo.title.localeCompare(
                      secondVideo.title,
                      "nb",
                    );
                  },
                ),
              }))
              .sort((firstSubtopic, secondSubtopic) => {
                const orderComparison =
                  firstSubtopic.sortOrder - secondSubtopic.sortOrder;

                if (orderComparison !== 0) {
                  return orderComparison;
                }

                return firstSubtopic.name.localeCompare(
                  secondSubtopic.name,
                  "nb",
                );
              }),
          }))
          .sort((firstTopic, secondTopic) => {
            const orderComparison =
              firstTopic.sortOrder - secondTopic.sortOrder;

            if (orderComparison !== 0) {
              return orderComparison;
            }

            return firstTopic.name.localeCompare(secondTopic.name, "nb");
          }),
      }))
      .sort((firstSubject, secondSubject) =>
        getSubjectLabel(firstSubject.subjectId).localeCompare(
          getSubjectLabel(secondSubject.subjectId),
          "nb",
        ),
      );
  }, [uploadedVideos]);

  return (
    <main className="page-container">
      <p className="page-label">Administrasjon</p>

      <h1>Administrer videoer</h1>

      <p className="page-description">
        Opprett, rediger og slett videoer på nettsiden.
      </p>

      <div className="admin-videos-layout">
        <section className="admin-video-card">
          <h2>{editingVideo ? "Rediger video" : "Opprett ny video"}</h2>

          <form className="admin-video-form" onSubmit={handleSubmit}>
            <label htmlFor="video-subject">Fag</label>

            <select
              id="video-subject"
              value={subjectId}
              onChange={(event) => handleSubjectChange(event.target.value)}
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

            <label htmlFor="video-topic">Overordnet tema</label>

            <select
              id="video-topic"
              value={topicId}
              onChange={(event) => handleTopicChange(event.target.value)}
              disabled={!subjectId || isLoadingTopics || Boolean(editingVideo)}
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

            {subjectId && !isLoadingTopics && topics.length === 0 && (
              <p className="admin-video-field-help">
                Dette faget har ingen temaer ennå.
              </p>
            )}

            <label htmlFor="video-subtopic">Undertema</label>

            <select
              id="video-subtopic"
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

            {topicId && !isLoadingSubtopics && subtopics.length === 0 && (
              <p className="admin-video-field-help">
                Dette temaet har ingen undertemaer ennå.
              </p>
            )}

            <label htmlFor="video-title">Tittel</label>

            <input
              id="video-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="For eksempel Euklids algoritme – metode 1"
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

            <label htmlFor="video-sort-order">Video-rekkefølge</label>

            <input
              id="video-sort-order"
              type="number"
              min="1"
              step="1"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              required
            />

            <p className="admin-video-field-help">
              Bruk 1 for første video, 2 for neste video og så videre innenfor
              samme undertema.
            </p>

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

          <div className="video-preview-structure">
            <div>
              <span>Tema {selectedTopic?.sortOrder ?? "–"}</span>

              <strong>{selectedTopic?.name ?? "Overordnet tema"}</strong>
            </div>

            <div>
              <span>Undertema {selectedSubtopic?.sortOrder ?? "–"}</span>

              <strong>{selectedSubtopic?.name ?? "Undertema"}</strong>
            </div>

            <div>
              <span>Video {sortOrder || "1"}</span>

              <strong>{title.trim() || "Tittel på videoen"}</strong>
            </div>
          </div>

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
        ) : groupedVideos.length === 0 ? (
          <p>Ingen videoer er opprettet gjennom adminpanelet ennå.</p>
        ) : (
          <div className="uploaded-video-subject-list">
            {groupedVideos.map((subjectGroup) => (
              <section
                key={subjectGroup.subjectId}
                className="uploaded-video-subject-group"
              >
                <h3 className="uploaded-video-subject-heading">
                  {getSubjectLabel(subjectGroup.subjectId)}
                </h3>

                <div className="uploaded-video-topic-list">
                  {subjectGroup.topics.map((topicGroup) => (
                    <section
                      key={topicGroup.id}
                      className="uploaded-video-topic-group"
                    >
                      <div className="uploaded-video-topic-heading">
                        <h4>{topicGroup.name}</h4>

                        <span className="uploaded-video-order-label">
                          Tema {topicGroup.sortOrder}
                        </span>
                      </div>

                      <div className="uploaded-video-subtopic-list">
                        {topicGroup.subtopics.map((subtopicGroup) => (
                          <section
                            key={subtopicGroup.id}
                            className="uploaded-video-subtopic-group"
                          >
                            <div className="uploaded-video-subtopic-heading">
                              <h5>{subtopicGroup.name}</h5>

                              <span className="uploaded-video-order-label">
                                Undertema {subtopicGroup.sortOrder}
                              </span>
                            </div>

                            <div className="uploaded-video-list">
                              {subtopicGroup.videos.map((video) => (
                                <article
                                  key={video.id}
                                  className="uploaded-video-item"
                                >
                                  <div className="uploaded-video-information">
                                    <h6>{video.title}</h6>

                                    <span className="uploaded-video-item-order">
                                      Video {video.sortOrder}
                                    </span>

                                    <p>YouTube-ID: {video.youtubeId}</p>
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
                          </section>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
