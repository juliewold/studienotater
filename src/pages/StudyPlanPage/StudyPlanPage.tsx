import "./StudyPlanPage.css";
import { Link, useParams } from "react-router-dom";
import { BookProgressCard } from "../../components/progress/BookProgressCard/BookProgressCard";
import { tma4412Book } from "../../data/books/tma4412Book";
import { useStudyPlan } from "../../hooks/useStudyPlan";

export const StudyPlanPage = () => {
  const { subjectId } = useParams();

  const {
    topics,
    errorMessage,
    isLoading,

    progressSummary,

    toggleItem,
    getStudyItemProgressId,
    getBookChapterProgress,
    isStudyItemCompleted,
    isResourceCompleted,
    getTopicProgress,

    getResourceUrl,
    getResourceTitle,
  } = useStudyPlan(subjectId);

  if (isLoading) {
    return (
      <main className="page-container">
        <p>Laster fremdrift...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="page-container">
        <Link to={`/fag/${subjectId}`} className="back-link">
          ← Tilbake til faget
        </Link>

        <h1>Kunne ikke hente studieplanen</h1>

        <p>{errorMessage}</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Studieplan</p>

      <h1>Fremdriftsplan</h1>

      <p>
        Kryss av det du har lest, sett eller gjort. Planen er
        sortert etter tema, slik at du kan øve i ditt eget tempo.
      </p>

      <section className="study-plan-summary">
        <div>
          <p className="study-plan-summary-label">
            Total fremdrift
          </p>

          <h2>
            {progressSummary.completed} / {progressSummary.total}{" "}
            punkter fullført
          </h2>
        </div>

        <p>{progressSummary.percentage}%</p>

        <div className="study-plan-progress-bar">
          <div
            className="study-plan-progress-fill"
            style={{
              width: `${progressSummary.percentage}%`,
            }}
          />
        </div>
      </section>

      {subjectId === "tma4412" && (
        <BookProgressCard book={tma4412Book} />
      )}

      {topics.length === 0 ? (
        <p>Ingen studietemaer er lagt til ennå.</p>
      ) : (
        <div className="study-plan-list">
          {topics.map((topic) => {
            const topicProgress = getTopicProgress(topic);

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

            const pdfResources = topic.resources.filter(
              (resource) =>
                resource.resourceType === "pdf",
            );

            const noteResources = topic.resources.filter(
              (resource) =>
                resource.resourceType === "note",
            );

            const videoResources = topic.resources.filter(
              (resource) =>
                resource.resourceType === "video",
            );

            return (
              <section
                key={topic.id}
                className="study-plan-card"
              >
                <div className="study-plan-card-header">
                  <div>
                    <h2>{topic.title}</h2>

                    <p>
                      {topicProgress.completed} /{" "}
                      {topicProgress.total} punkter fullført
                    </p>
                  </div>

                  <span>{topicProgress.percentage}%</span>
                </div>

                <div className="study-plan-progress-bar">
                  <div
                    className="study-plan-progress-fill"
                    style={{
                      width: `${topicProgress.percentage}%`,
                    }}
                  />
                </div>

                {(readingItems.length > 0 ||
                  lectureItems.length > 0 ||
                  taskItems.length > 0) && (
                  <div className="study-plan-grid">
                    <div>
                      <h3>Pensum</h3>

                      {readingItems.map((item) => {
                        const bookProgress =
                          getBookChapterProgress(item.value);

                        if (bookProgress) {
                          return (
                            <Link
                              key={item.id}
                              to={`/fag/${subjectId}/bok/${tma4412Book.id}`}
                              className="study-plan-book-item"
                            >
                              <div className="study-plan-book-item-header">
                                <span>{item.value}</span>

                                <span>
                                  {bookProgress.progress === 100
                                    ? "✓"
                                    : `${bookProgress.progress}%`}
                                </span>
                              </div>

                              <div className="study-plan-progress-bar small">
                                <div
                                  className="study-plan-progress-fill"
                                  style={{
                                    width: `${bookProgress.progress}%`,
                                  }}
                                />
                              </div>

                              <p>
                                {bookProgress.readPages} /{" "}
                                {bookProgress.totalPages} sider lest
                              </p>
                            </Link>
                          );
                        }

                        const itemProgressId =
                          getStudyItemProgressId(topic, item);

                        return (
                          <label
                            key={item.id}
                            className="study-plan-item"
                          >
                            <input
                              type="checkbox"
                              checked={isStudyItemCompleted(
                                topic,
                                item,
                              )}
                              onChange={() =>
                                toggleItem(itemProgressId)
                              }
                            />

                            <span>{item.value}</span>
                          </label>
                        );
                      })}

                      {lectureItems.map((item) => {
                        const itemProgressId =
                          getStudyItemProgressId(topic, item);

                        return (
                          <label
                            key={item.id}
                            className="study-plan-item"
                          >
                            <input
                              type="checkbox"
                              checked={isStudyItemCompleted(
                                topic,
                                item,
                              )}
                              onChange={() =>
                                toggleItem(itemProgressId)
                              }
                            />

                            <span>{item.value}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div>
                      <h3>Oppgaver</h3>

                      {taskItems.map((item) => {
                        const itemProgressId =
                          getStudyItemProgressId(topic, item);

                        return (
                          <label
                            key={item.id}
                            className="study-plan-item"
                          >
                            <input
                              type="checkbox"
                              checked={isStudyItemCompleted(
                                topic,
                                item,
                              )}
                              onChange={() =>
                                toggleItem(itemProgressId)
                              }
                            />

                            <span>{item.value}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {topic.resources.length > 0 && (
                  <div className="study-plan-resources">
                    {pdfResources.length > 0 && (
                      <div>
                        <h3>PDF-er / forelesningsnotater</h3>

                        {pdfResources.map((resource) => (
                          <Link
                            key={resource.id}
                            to={getResourceUrl(resource)}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted(resource)
                                ? "✓"
                                : "○"}
                            </span>

                            <span>
                              {getResourceTitle(resource)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {noteResources.length > 0 && (
                      <div>
                        <h3>Notater</h3>

                        {noteResources.map((resource) => (
                          <Link
                            key={resource.id}
                            to={getResourceUrl(resource)}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted(resource)
                                ? "✓"
                                : "○"}
                            </span>

                            <span>
                              {getResourceTitle(resource)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {videoResources.length > 0 && (
                      <div>
                        <h3>Videoer</h3>

                        {videoResources.map((resource) => (
                          <Link
                            key={resource.id}
                            to={getResourceUrl(resource)}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted(resource)
                                ? "✓"
                                : "○"}
                            </span>

                            <span>
                              {getResourceTitle(resource)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};