import "./BookProgressPage.css";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useBookProgress } from "../../../hooks/useBookProgress";
import { useBookTaskProgress } from "../../../hooks/useBookTaskProgress";
import {
  getBookBySlug,
  getBookTasksByChapter,
  type DatabaseBook,
  type DatabaseBookTask,
} from "../../../services/study/booksService";

export const BookProgressPage = () => {
  const { subjectId, bookId } = useParams();

  const [book, setBook] = useState<DatabaseBook | null>(null);

  const [tasksByChapter, setTasksByChapter] = useState<
    Record<string, DatabaseBookTask[]>
  >({});

  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const [bookErrorMessage, setBookErrorMessage] = useState("");

  const {
    checkedPages,
    togglePage,
    isLoading: isLoadingProgress,
  } = useBookProgress(book?.slug ?? "");

  const {
    completedTaskIds,
    toggleTask,
    isLoading: isLoadingTaskProgress,
  } = useBookTaskProgress();

  useEffect(() => {
    const loadBook = async () => {
      if (!subjectId || !bookId) {
        setBook(null);
        setIsLoadingBook(false);
        return;
      }

      setIsLoadingBook(true);
      setBookErrorMessage("");

      try {
        const loadedBook = await getBookBySlug(subjectId, bookId);

        setBook(loadedBook);

        if (!loadedBook) {
          setBookErrorMessage("Fant ikke boka.");
        }
      } catch (error) {
        console.error("Kunne ikke hente bok:", error);

        setBook(null);
        setBookErrorMessage("Kunne ikke hente boka.");
      } finally {
        setIsLoadingBook(false);
      }
    };

    loadBook();
  }, [subjectId, bookId]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!book) {
        setTasksByChapter({});
        return;
      }

      setIsLoadingTasks(true);

      try {
        const chapterTasks = await Promise.all(
          book.chapters.map(async (chapter) => {
            const tasks = await getBookTasksByChapter(chapter.id);

            return {
              chapterId: chapter.id,
              tasks,
            };
          }),
        );

        const tasksRecord = chapterTasks.reduce<
          Record<string, DatabaseBookTask[]>
        >((result, item) => {
          result[item.chapterId] = item.tasks;
          return result;
        }, {});

        setTasksByChapter(tasksRecord);
      } catch (error) {
        console.error("Kunne ikke hente bokoppgaver:", error);
        setTasksByChapter({});
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [book]);

  if (isLoadingBook) {
    return (
      <main className="page-container">
        <p>Laster bok...</p>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="page-container">
        <Link to={subjectId ? `/fag/${subjectId}` : "/"} className="back-link">
          ← Tilbake
        </Link>

        <h1>Fant ikke bok</h1>

        <p>
          {bookErrorMessage || "Fant ingen bok som passer til denne adressen."}
        </p>
      </main>
    );
  }

  const totalPages = book.chapters.reduce(
    (total, chapter) => total + chapter.endPage - chapter.startPage + 1,
    0,
  );

  const completedPages = checkedPages.filter((page) =>
    book.chapters.some(
      (chapter) => page >= chapter.startPage && page <= chapter.endPage,
    ),
  ).length;

  const progress =
    totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

  return (
    <main className="page-container book-progress-page">
      <Link to={`/fag/${subjectId}/studieplan`} className="back-link">
        ← Tilbake til studieplan
      </Link>

      <header>
        <p className="page-label">Bok</p>

        <h1>{book.title}</h1>

        <p className="page-description">
          Kryss av sider og oppgaver etter hvert som du fullfører dem.
        </p>

        <div className="book-progress-summary">
          <strong>{progress}%</strong>

          <span>
            {completedPages} / {totalPages} sider
          </span>
        </div>
      </header>

      {isLoadingProgress ? (
        <p>Laster fremdrift...</p>
      ) : (
        <div className="book-chapter-list">
          {book.chapters.map((chapter) => {
            const pages = Array.from(
              {
                length: chapter.endPage - chapter.startPage + 1,
              },
              (_, index) => chapter.startPage + index,
            );

            const chapterTasks = tasksByChapter[chapter.id] ?? [];

            return (
              <section key={chapter.id} className="book-chapter">
                <div className="book-chapter-header">
                  <h2>{chapter.title}</h2>

                  <span>
                    Side {chapter.startPage}–{chapter.endPage}
                  </span>
                </div>

                <div className="book-page-grid">
                  {pages.map((page) => {
                    const isChecked = checkedPages.includes(page);

                    return (
                      <button
                        key={page}
                        type="button"
                        className={
                          isChecked
                            ? "book-page-cell is-read"
                            : "book-page-cell"
                        }
                        onClick={() => togglePage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {!isLoadingTasks &&
                  !isLoadingTaskProgress &&
                  chapterTasks.length > 0 && (
                    <div className="book-task-list">
                      <h3>Oppgaver</h3>

                      {chapterTasks.map((task) => {
                        const isCompleted = completedTaskIds.includes(task.id);

                        return (
                          <label key={task.id} className="book-task-item">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => toggleTask(task.id)}
                            />

                            <span>{task.title}</span>
                          </label>
                        );
                      })}
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
