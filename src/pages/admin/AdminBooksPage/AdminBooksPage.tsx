import "./AdminBooksPage.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { subjects } from "../../../data/subjects";
import {
  createBook,
  createBookChapter,
  createBookTask,
  deleteBook,
  deleteBookChapter,
  deleteBookTask,
  getBookChapters,
  getBooksBySubject,
  getBookTasksByChapter,
  updateBook,
  updateBookChapter,
  updateBookTask,
  type DatabaseBook,
  type DatabaseBookChapter,
  type DatabaseBookTask,
} from "../../../services/study/booksService";

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const AdminBooksPage = () => {
  const [subjectId, setSubjectId] = useState("");

  const [books, setBooks] = useState<DatabaseBook[]>([]);
  const [selectedBookId, setSelectedBookId] = useState("");

  const [chapters, setChapters] = useState<DatabaseBookChapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const [tasks, setTasks] = useState<DatabaseBookTask[]>([]);

  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookShortTitle, setBookShortTitle] = useState("");
  const [bookSortOrder, setBookSortOrder] = useState("1");

  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterStartPage, setChapterStartPage] = useState("");
  const [chapterEndPage, setChapterEndPage] = useState("");
  const [chapterSortOrder, setChapterSortOrder] = useState("1");

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSortOrder, setTaskSortOrder] = useState("1");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadBooks = async (currentSubjectId: string) => {
    if (!currentSubjectId) {
      setBooks([]);
      return;
    }

    setIsLoadingBooks(true);

    try {
      const loadedBooks = await getBooksBySubject(currentSubjectId);
      setBooks(loadedBooks);
    } catch (error) {
      console.error("Kunne ikke hente bøker:", error);
      setBooks([]);
      setErrorMessage("Kunne ikke hente bøker.");
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const loadChapters = async (bookId: string) => {
    if (!bookId) {
      setChapters([]);
      return;
    }

    setIsLoadingChapters(true);

    try {
      const loadedChapters = await getBookChapters(bookId);
      setChapters(loadedChapters);
    } catch (error) {
      console.error("Kunne ikke hente kapitler:", error);
      setChapters([]);
      setErrorMessage("Kunne ikke hente kapitler.");
    } finally {
      setIsLoadingChapters(false);
    }
  };

  const loadTasks = async (chapterId: string) => {
    if (!chapterId) {
      setTasks([]);
      return;
    }

    setIsLoadingTasks(true);

    try {
      const loadedTasks = await getBookTasksByChapter(chapterId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Kunne ikke hente oppgaver:", error);
      setTasks([]);
      setErrorMessage("Kunne ikke hente oppgaver.");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadBooks(subjectId);
  }, [subjectId]);

  useEffect(() => {
    loadChapters(selectedBookId);
  }, [selectedBookId]);

  useEffect(() => {
    loadTasks(selectedChapterId);
  }, [selectedChapterId]);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setBookTitle("");
    setBookShortTitle("");
    setBookSortOrder("1");
  };

  const resetChapterForm = () => {
    setEditingChapterId(null);
    setChapterTitle("");
    setChapterStartPage("");
    setChapterEndPage("");
    setChapterSortOrder("1");
  };

  const resetTaskForm = () => {
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskSortOrder("1");
  };

  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    setSelectedBookId("");
    setSelectedChapterId("");
    setChapters([]);
    setTasks([]);

    resetBookForm();
    resetChapterForm();
    resetTaskForm();
    clearMessages();
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId("");
    setTasks([]);

    resetChapterForm();
    resetTaskForm();
    clearMessages();
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);

    resetTaskForm();
    clearMessages();
  };

  const handleBookSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subjectId) {
      setErrorMessage("Velg et fag først.");
      return;
    }

    if (!bookTitle.trim()) {
      setErrorMessage("Boka må ha en tittel.");
      return;
    }

    clearMessages();
    setIsSaving(true);

    try {
      if (editingBookId) {
        const existingBook = books.find((book) => book.id === editingBookId);

        if (!existingBook) {
          setErrorMessage("Fant ikke boka som skal redigeres.");
          return;
        }

        await updateBook(editingBookId, {
          subjectId,
          slug: existingBook.slug,
          title: bookTitle.trim(),
          shortTitle: bookShortTitle.trim() || null,
          sortOrder: Number(bookSortOrder),
        });

        setSuccessMessage("Boka ble oppdatert.");
      } else {
        const slug = createSlug(bookTitle);

        if (!slug) {
          setErrorMessage("Boka må ha en gyldig tittel.");
          return;
        }

        const createdBookId = await createBook({
          subjectId,
          slug,
          title: bookTitle.trim(),
          shortTitle: bookShortTitle.trim() || null,
          sortOrder: Number(bookSortOrder),
        });

        setSelectedBookId(createdBookId);
        setSuccessMessage("Boka ble opprettet.");
      }

      resetBookForm();
      await loadBooks(subjectId);
    } catch (error) {
      console.error("Kunne ikke lagre bok:", error);
      setErrorMessage("Kunne ikke lagre boka.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBook = (book: DatabaseBook) => {
    clearMessages();

    setEditingBookId(book.id);
    setBookTitle(book.title);
    setBookShortTitle(book.shortTitle ?? "");
    setBookSortOrder(String(book.sortOrder));
  };

  const handleDeleteBook = async (book: DatabaseBook) => {
    const shouldDelete = window.confirm(
      `Vil du slette "${book.title}" og alle kapitlene og oppgavene i boka?`,
    );

    if (!shouldDelete) {
      return;
    }

    clearMessages();

    try {
      await deleteBook(book.id);

      if (selectedBookId === book.id) {
        setSelectedBookId("");
        setSelectedChapterId("");
        setChapters([]);
        setTasks([]);
      }

      resetBookForm();
      resetChapterForm();
      resetTaskForm();

      await loadBooks(subjectId);

      setSuccessMessage("Boka ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette bok:", error);
      setErrorMessage("Kunne ikke slette boka.");
    }
  };

  const handleChapterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedBookId) {
      setErrorMessage("Velg en bok først.");
      return;
    }

    const startPage = Number(chapterStartPage);
    const endPage = Number(chapterEndPage);

    if (endPage < startPage) {
      setErrorMessage("Sluttsiden kan ikke være før startsiden.");
      return;
    }

    clearMessages();
    setIsSaving(true);

    try {
      if (editingChapterId) {
        await updateBookChapter(editingChapterId, {
          bookId: selectedBookId,
          title: chapterTitle.trim(),
          startPage,
          endPage,
          sortOrder: Number(chapterSortOrder),
        });

        setSuccessMessage("Kapittelet ble oppdatert.");
      } else {
        const createdChapterId = await createBookChapter({
          bookId: selectedBookId,
          title: chapterTitle.trim(),
          startPage,
          endPage,
          sortOrder: Number(chapterSortOrder),
        });

        setSelectedChapterId(createdChapterId);
        setSuccessMessage("Kapittelet ble opprettet.");
      }

      resetChapterForm();
      await loadChapters(selectedBookId);
    } catch (error) {
      console.error("Kunne ikke lagre kapittel:", error);
      setErrorMessage("Kunne ikke lagre kapittelet.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditChapter = (chapter: DatabaseBookChapter) => {
    clearMessages();

    setEditingChapterId(chapter.id);
    setChapterTitle(chapter.title);
    setChapterStartPage(String(chapter.startPage));
    setChapterEndPage(String(chapter.endPage));
    setChapterSortOrder(String(chapter.sortOrder));
  };

  const handleDeleteChapter = async (chapter: DatabaseBookChapter) => {
    const shouldDelete = window.confirm(
      `Vil du slette "${chapter.title}" og alle oppgavene i kapittelet?`,
    );

    if (!shouldDelete) {
      return;
    }

    clearMessages();

    try {
      await deleteBookChapter(chapter.id);

      if (selectedChapterId === chapter.id) {
        setSelectedChapterId("");
        setTasks([]);
      }

      resetChapterForm();
      resetTaskForm();

      await loadChapters(selectedBookId);

      setSuccessMessage("Kapittelet ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette kapittel:", error);
      setErrorMessage("Kunne ikke slette kapittelet.");
    }
  };

  const handleTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedChapterId) {
      setErrorMessage("Velg et kapittel først.");
      return;
    }

    clearMessages();
    setIsSaving(true);

    try {
      if (editingTaskId) {
        await updateBookTask(editingTaskId, {
          chapterId: selectedChapterId,
          title: taskTitle.trim(),
          sortOrder: Number(taskSortOrder),
        });

        setSuccessMessage("Oppgaven ble oppdatert.");
      } else {
        await createBookTask({
          chapterId: selectedChapterId,
          title: taskTitle.trim(),
          sortOrder: Number(taskSortOrder),
        });

        setSuccessMessage("Oppgaven ble opprettet.");
      }

      resetTaskForm();
      await loadTasks(selectedChapterId);
    } catch (error) {
      console.error("Kunne ikke lagre oppgave:", error);
      setErrorMessage("Kunne ikke lagre oppgaven.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTask = (task: DatabaseBookTask) => {
    clearMessages();

    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskSortOrder(String(task.sortOrder));
  };

  const handleDeleteTask = async (task: DatabaseBookTask) => {
    const shouldDelete = window.confirm(`Vil du slette "${task.title}"?`);

    if (!shouldDelete) {
      return;
    }

    clearMessages();

    try {
      await deleteBookTask(task.id);

      resetTaskForm();
      await loadTasks(selectedChapterId);

      setSuccessMessage("Oppgaven ble slettet.");
    } catch (error) {
      console.error("Kunne ikke slette oppgave:", error);
      setErrorMessage("Kunne ikke slette oppgaven.");
    }
  };

  return (
    <main className="page-container admin-books-page">
      <div>
        <Link to="/admin" className="back-link">
          ← Tilbake til admin
        </Link>

        <p className="page-label">Administrasjon</p>
        <h1>Administrer bøker</h1>

        <p className="page-description">
          Administrer bøker, kapitler, sider og oppgaver.
        </p>
      </div>

      {errorMessage && (
        <p className="admin-books-message admin-books-error">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="admin-books-message admin-books-success">
          {successMessage}
        </p>
      )}

      <section className="admin-books-section">
        <h2>Fag</h2>

        <div className="admin-books-form">
          <div>
            <label htmlFor="book-subject">Fag</label>

            <select
              id="book-subject"
              className="admin-books-select"
              value={subjectId}
              onChange={(event) => handleSubjectChange(event.target.value)}
            >
              <option value="">Velg fag</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} – {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {subjectId && (
        <>
          <section className="admin-books-section">
            <h2>{editingBookId ? "Rediger bok" : "Legg til bok"}</h2>

            <form className="admin-books-form" onSubmit={handleBookSubmit}>
              <div>
                <label htmlFor="book-title">Tittel</label>
                <input
                  id="book-title"
                  type="text"
                  value={bookTitle}
                  onChange={(event) => setBookTitle(event.target.value)}
                  placeholder="For eksempel Logiske metoder"
                  required
                />
              </div>

              <div className="admin-books-row">
                <div>
                  <label htmlFor="book-short-title">Kortnavn</label>
                  <input
                    id="book-short-title"
                    type="text"
                    value={bookShortTitle}
                    onChange={(event) => setBookShortTitle(event.target.value)}
                    placeholder="For eksempel RA"
                  />
                </div>

                <div>
                  <label htmlFor="book-order">Rekkefølge</label>
                  <input
                    id="book-order"
                    type="number"
                    min="0"
                    value={bookSortOrder}
                    onChange={(event) => setBookSortOrder(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="admin-books-actions">
                <button
                  type="submit"
                  className="admin-books-primary-button"
                  disabled={isSaving}
                >
                  {editingBookId ? "Lagre bok" : "Legg til bok"}
                </button>

                {editingBookId && (
                  <button
                    type="button"
                    className="admin-books-secondary-button"
                    onClick={resetBookForm}
                  >
                    Avbryt
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-books-section">
            <h2>Bøker</h2>

            {isLoadingBooks ? (
              <p className="admin-books-empty">Laster bøker...</p>
            ) : books.length === 0 ? (
              <p className="admin-books-empty">Ingen bøker er lagt til ennå.</p>
            ) : (
              <>
                <div className="admin-books-form">
                  <div>
                    <label htmlFor="book-select">Valgt bok</label>
                    <select
                      id="book-select"
                      className="admin-books-select"
                      value={selectedBookId}
                      onChange={(event) => handleBookChange(event.target.value)}
                    >
                      <option value="">Velg bok</option>

                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title}
                          {book.shortTitle ? ` (${book.shortTitle})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-books-list">
                  {books.map((book) => (
                    <div className="admin-books-item" key={book.id}>
                      <div className="admin-books-item-content">
                        <strong>{book.title}</strong>
                        {book.shortTitle && <span>{book.shortTitle}</span>}
                      </div>

                      <div className="admin-books-item-actions">
                        <button
                          type="button"
                          className="admin-books-secondary-button"
                          onClick={() => handleEditBook(book)}
                        >
                          Rediger
                        </button>

                        <button
                          type="button"
                          className="admin-books-delete-button"
                          onClick={() => handleDeleteBook(book)}
                        >
                          Slett
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </>
      )}

      {selectedBookId && (
        <>
          <section className="admin-books-section">
            <h2>
              {editingChapterId ? "Rediger kapittel" : "Legg til kapittel"}
            </h2>

            <form className="admin-books-form" onSubmit={handleChapterSubmit}>
              <div>
                <label htmlFor="chapter-title">Kapitteltittel</label>
                <input
                  id="chapter-title"
                  type="text"
                  value={chapterTitle}
                  onChange={(event) => setChapterTitle(event.target.value)}
                  placeholder="For eksempel RA kap. 1"
                  required
                />
              </div>

              <div className="admin-books-row">
                <div>
                  <label htmlFor="chapter-start-page">Fra side</label>
                  <input
                    id="chapter-start-page"
                    type="number"
                    min="1"
                    value={chapterStartPage}
                    onChange={(event) =>
                      setChapterStartPage(event.target.value)
                    }
                    required
                  />
                </div>

                <div>
                  <label htmlFor="chapter-end-page">Til side</label>
                  <input
                    id="chapter-end-page"
                    type="number"
                    min="1"
                    value={chapterEndPage}
                    onChange={(event) => setChapterEndPage(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="chapter-order">Rekkefølge</label>
                <input
                  id="chapter-order"
                  type="number"
                  min="0"
                  value={chapterSortOrder}
                  onChange={(event) => setChapterSortOrder(event.target.value)}
                  required
                />
              </div>

              <div className="admin-books-actions">
                <button
                  type="submit"
                  className="admin-books-primary-button"
                  disabled={isSaving}
                >
                  {editingChapterId ? "Lagre kapittel" : "Legg til kapittel"}
                </button>

                {editingChapterId && (
                  <button
                    type="button"
                    className="admin-books-secondary-button"
                    onClick={resetChapterForm}
                  >
                    Avbryt
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-books-section">
            <h2>Kapitler</h2>

            {isLoadingChapters ? (
              <p className="admin-books-empty">Laster kapitler...</p>
            ) : chapters.length === 0 ? (
              <p className="admin-books-empty">
                Ingen kapitler er lagt til ennå.
              </p>
            ) : (
              <>
                <div className="admin-books-form">
                  <div>
                    <label htmlFor="chapter-select">Valgt kapittel</label>
                    <select
                      id="chapter-select"
                      className="admin-books-select"
                      value={selectedChapterId}
                      onChange={(event) =>
                        handleChapterChange(event.target.value)
                      }
                    >
                      <option value="">Velg kapittel</option>

                      {chapters.map((chapter) => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-books-list">
                  {chapters.map((chapter) => (
                    <div className="admin-books-item" key={chapter.id}>
                      <div className="admin-books-item-content">
                        <strong>{chapter.title}</strong>
                        <span>
                          Side {chapter.startPage}–{chapter.endPage}
                        </span>
                      </div>

                      <div className="admin-books-item-actions">
                        <button
                          type="button"
                          className="admin-books-secondary-button"
                          onClick={() => handleEditChapter(chapter)}
                        >
                          Rediger
                        </button>

                        <button
                          type="button"
                          className="admin-books-delete-button"
                          onClick={() => handleDeleteChapter(chapter)}
                        >
                          Slett
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </>
      )}

      {selectedChapterId && (
        <>
          <section className="admin-books-section">
            <h2>{editingTaskId ? "Rediger oppgave" : "Legg til oppgave"}</h2>

            <form className="admin-books-form" onSubmit={handleTaskSubmit}>
              <div>
                <label htmlFor="task-title">Oppgave</label>
                <input
                  id="task-title"
                  type="text"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="For eksempel Oppgave 1.1"
                  required
                />
              </div>

              <div>
                <label htmlFor="task-order">Rekkefølge</label>
                <input
                  id="task-order"
                  type="number"
                  min="0"
                  value={taskSortOrder}
                  onChange={(event) => setTaskSortOrder(event.target.value)}
                  required
                />
              </div>

              <div className="admin-books-actions">
                <button
                  type="submit"
                  className="admin-books-primary-button"
                  disabled={isSaving}
                >
                  {editingTaskId ? "Lagre oppgave" : "Legg til oppgave"}
                </button>

                {editingTaskId && (
                  <button
                    type="button"
                    className="admin-books-secondary-button"
                    onClick={resetTaskForm}
                  >
                    Avbryt
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-books-section">
            <h2>Oppgaver</h2>

            {isLoadingTasks ? (
              <p className="admin-books-empty">Laster oppgaver...</p>
            ) : tasks.length === 0 ? (
              <p className="admin-books-empty">
                Ingen oppgaver er lagt til ennå.
              </p>
            ) : (
              <div className="admin-books-list">
                {tasks.map((task) => (
                  <div className="admin-books-item" key={task.id}>
                    <div className="admin-books-item-content">
                      <strong>{task.title}</strong>
                    </div>

                    <div className="admin-books-item-actions">
                      <button
                        type="button"
                        className="admin-books-secondary-button"
                        onClick={() => handleEditTask(task)}
                      >
                        Rediger
                      </button>

                      <button
                        type="button"
                        className="admin-books-delete-button"
                        onClick={() => handleDeleteTask(task)}
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};
