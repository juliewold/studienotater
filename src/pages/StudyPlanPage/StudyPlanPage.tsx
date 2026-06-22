import "./StudyPlanPage.css";
import { Link, useParams } from "react-router-dom";
import { studyPlans } from "../../data/studyPlans";
import { pdfs } from "../../data/pdfs";
import { notes } from "../../data/notes";
import { videos } from "../../data/videos";
import { BookProgressCard } from "../../components/BookProgressCard/BookProgressCard";
import { tma4412Book } from "../../data/books/tma4412Book";

export const StudyPlanPage = () => {
  const { subjectId } = useParams();

  const plan = studyPlans[subjectId as keyof typeof studyPlans] || [];

  const toggleItem = (itemId: string) => {
    const key = `study-plan-${subjectId}-${itemId}`;
    const currentValue = localStorage.getItem(key) === "true";

    localStorage.setItem(key, String(!currentValue));
    window.location.reload();
  };

  const isChecked = (itemId: string) => {
    if (subjectId === "tma4412") {
      const readingTitle = itemId.split("-reading-")[1];

      const chapter = tma4412Book.chapters.find(
        (chapter) => chapter.title === readingTitle,
      );

      if (chapter) {
        const saved = localStorage.getItem(`book-progress-${tma4412Book.id}`);
        const checkedPages: number[] = saved ? JSON.parse(saved) : [];

        const pages = Array.from(
          { length: chapter.endPage - chapter.startPage + 1 },
          (_, index) => chapter.startPage + index,
        );

        return pages.every((page) => checkedPages.includes(page));
      }
    }

    return localStorage.getItem(`study-plan-${subjectId}-${itemId}`) === "true";
  };

  const getBookChapter = (readingTitle: string) => {
    if (subjectId !== "tma4412") return undefined;

    return tma4412Book.chapters.find(
      (chapter) => chapter.title === readingTitle,
    );
  };

  const getBookChapterProgress = (readingTitle: string) => {
    const chapter = getBookChapter(readingTitle);

    if (!chapter) return null;

    const saved = localStorage.getItem(`book-progress-${tma4412Book.id}`);
    const checkedPages: number[] = saved ? JSON.parse(saved) : [];

    const pages = Array.from(
      { length: chapter.endPage - chapter.startPage + 1 },
      (_, index) => chapter.startPage + index,
    );

    const readPages = pages.filter((page) =>
      checkedPages.includes(page),
    ).length;

    const progress =
      pages.length === 0 ? 0 : Math.round((readPages / pages.length) * 100);

    return {
      chapter,
      readPages,
      totalPages: pages.length,
      progress,
    };
  };

  const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];
  const subjectNotes = notes[subjectId as keyof typeof notes] || [];
  const subjectVideoTopics = videos[subjectId as keyof typeof videos] || [];
  const subjectVideos = subjectVideoTopics.flatMap((topic) => topic.videos);

  const isResourceCompleted = (
    type: "pdf" | "note" | "video",
    resourceId: string,
  ) => {
    return (
      localStorage.getItem(
        `resource-progress-${type}-${subjectId}-${resourceId}-completed`,
      ) === "true"
    );
  };

  const getTopicItems = (topic: (typeof plan)[number]) => {
    return [
      ...topic.reading.map((item) => ({
        id: `${topic.id}-reading-${item}`,
        type: "study-plan",
      })),

      ...[...topic.exercises, ...topic.assignments, ...topic.stack].map(
        (item) => ({
          id: `${topic.id}-task-${item}`,
          type: "study-plan",
        }),
      ),

      ...(topic.resources?.pdfs ?? []).map((item) => ({
        id: `resource-progress-pdf-${subjectId}-${item}-completed`,
        type: "resource",
      })),

      ...(topic.resources?.notes ?? []).map((item) => ({
        id: `resource-progress-note-${subjectId}-${item}-completed`,
        type: "resource",
      })),

      ...(topic.resources?.videos ?? []).map((item) => ({
        id: `resource-progress-video-${subjectId}-${item}-completed`,
        type: "resource",
      })),
    ];
  };

  const allItems = plan.flatMap((topic) => getTopicItems(topic));
  const completedItems = allItems.filter((item) =>
    item.type === "resource"
      ? localStorage.getItem(item.id) === "true"
      : isChecked(item.id),
  );

  const totalProgress =
    allItems.length === 0
      ? 0
      : Math.round((completedItems.length / allItems.length) * 100);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="page-label">Studieplan</p>
      <h1>Fremdriftsplan</h1>

      <p>
        Kryss av det du har lest, sett eller gjort. Planen er sortert etter
        tema, slik at du kan øve i ditt eget tempo.
      </p>

      <section className="study-plan-summary">
        <div>
          <p className="study-plan-summary-label">Total fremdrift</p>
          <h2>
            {completedItems.length} / {allItems.length} punkter fullført
          </h2>
        </div>

        <p>{totalProgress}%</p>

        <div className="study-plan-progress-bar">
          <div
            className="study-plan-progress-fill"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </section>

      {subjectId === "tma4412" && <BookProgressCard book={tma4412Book} />}

      <div className="study-plan-list">
        {plan.map((topic) => {
          const topicItems = getTopicItems(topic);
          const completedTopicItems = topicItems.filter((item) =>
            item.type === "resource"
              ? localStorage.getItem(item.id) === "true"
              : isChecked(item.id),
          );

          const topicProgress =
            topicItems.length === 0
              ? 0
              : Math.round(
                  (completedTopicItems.length / topicItems.length) * 100,
                );

          return (
            <section key={topic.id} className="study-plan-card">
              <div className="study-plan-card-header">
                <div>
                  <h2>{topic.title}</h2>

                  <p>
                    {completedTopicItems.length} / {topicItems.length} punkter
                    fullført
                  </p>
                </div>

                <span>{topicProgress}%</span>
              </div>

              <div className="study-plan-progress-bar">
                <div
                  className="study-plan-progress-fill"
                  style={{ width: `${topicProgress}%` }}
                />
              </div>

              <div className="study-plan-grid">
                <div>
                  <h3>Pensum</h3>
                  {topic.reading.map((item) => {
                    const bookProgress = getBookChapterProgress(item);

                    if (bookProgress) {
                      return (
                        <Link
                          key={item}
                          to={`/fag/${subjectId}/bok/${tma4412Book.id}`}
                          className="study-plan-book-item"
                        >
                          <div className="study-plan-book-item-header">
                            <span>{item}</span>
                            <span>
                              {bookProgress.progress === 100
                                ? "✓"
                                : `${bookProgress.progress}%`}
                            </span>
                          </div>

                          <div className="study-plan-progress-bar small">
                            <div
                              className="study-plan-progress-fill"
                              style={{ width: `${bookProgress.progress}%` }}
                            />
                          </div>

                          <p>
                            {bookProgress.readPages} / {bookProgress.totalPages}{" "}
                            sider lest
                          </p>
                        </Link>
                      );
                    }

                    return (
                      <label key={item} className="study-plan-item">
                        <input
                          type="checkbox"
                          checked={isChecked(`${topic.id}-reading-${item}`)}
                          onChange={() =>
                            toggleItem(`${topic.id}-reading-${item}`)
                          }
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>

                <div>
                  <h3>Oppgaver</h3>
                  {[
                    ...topic.exercises,
                    ...topic.assignments,
                    ...topic.stack,
                  ].map((item) => (
                    <label key={item} className="study-plan-item">
                      <input
                        type="checkbox"
                        checked={isChecked(`${topic.id}-task-${item}`)}
                        onChange={() => toggleItem(`${topic.id}-task-${item}`)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {topic.resources && (
                <div className="study-plan-resources">
                  {topic.resources.pdfs.length > 0 && (
                    <div>
                      <h3>PDF-er / forelesningsnotater</h3>

                      {topic.resources.pdfs.map((pdfId) => {
                        const pdf = subjectPdfs.find((pdf) => pdf.id === pdfId);

                        return (
                          <Link
                            key={pdfId}
                            to={`/fag/${subjectId}/pdfs/${pdfId}`}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted("pdf", pdfId) ? "✓" : "○"}
                            </span>
                            <span>{pdf?.title ?? pdfId}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {topic.resources.notes.length > 0 && (
                    <div>
                      <h3>Notater</h3>

                      {topic.resources.notes.map((noteId) => {
                        const note = subjectNotes.find(
                          (note) => note.id === noteId,
                        );

                        return (
                          <Link
                            key={noteId}
                            to={`/fag/${subjectId}/notater/${noteId}`}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted("note", noteId) ? "✓" : "○"}
                            </span>
                            <span>{note?.title ?? noteId}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {topic.resources.videos.length > 0 && (
                    <div>
                      <h3>Videoer</h3>

                      {topic.resources.videos.map((videoId) => {
                        const video = subjectVideos.find(
                          (video) => video.youtubeId === videoId,
                        );

                        return (
                          <Link
                            key={videoId}
                            to={`/fag/${subjectId}/videoer`}
                            className="study-plan-resource-item"
                          >
                            <span>
                              {isResourceCompleted("video", videoId)
                                ? "✓"
                                : "○"}
                            </span>
                            <span>{video?.title ?? videoId}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};
