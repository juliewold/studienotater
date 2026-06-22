import "./BookProgressPage.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tma4412Book } from "../../data/books/tma4412Book";

export const BookProgressPage = () => {
  const { subjectId } = useParams();

  const book = tma4412Book;

  const storageKey = `book-progress-${book.id}`;

  const [checkedPages, setCheckedPages] = useState<number[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkedPages));
  }, [storageKey, checkedPages]);

  const togglePage = (page: number) => {
    setCheckedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
    );
  };

  const totalPages = book.chapters.reduce((total, chapter) => {
    return total + (chapter.endPage - chapter.startPage + 1);
  }, 0);

  const readPages = checkedPages.length;

  const progress =
    totalPages === 0 ? 0 : Math.round((readPages / totalPages) * 100);

  return (
    <main className="page-container">
      <Link to={`/fag/${subjectId}/studieplan`} className="back-link">
        ← Tilbake til fremdriftsplan
      </Link>

      <p className="page-label">Bokfremdrift</p>
      <h1>{book.title}</h1>

      <section className="book-progress-card">
        <div className="book-progress-header">
          <div>
            <p className="study-plan-summary-label">Total bokfremdrift</p>

            <h2>
              {readPages} / {totalPages} sider lest
            </h2>
          </div>

          <span>{progress}%</span>
        </div>

        <div className="study-plan-progress-bar">
          <div
            className="study-plan-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <div className="study-plan-list">
        {book.chapters.map((chapter) => {
          const chapterPages = chapter.endPage - chapter.startPage + 1;

          const pages = Array.from(
            { length: chapterPages },
            (_, index) => chapter.startPage + index,
          );

          const readChapterPages = pages.filter((page) =>
            checkedPages.includes(page),
          ).length;

          const chapterProgress =
            chapterPages === 0
              ? 0
              : Math.round((readChapterPages / chapterPages) * 100);

          return (
            <section key={chapter.id} className="study-plan-card">
              <div className="study-plan-card-header">
                <div>
                  <h2>{chapter.title}</h2>

                  <p>
                    Side {chapter.startPage}–{chapter.endPage}
                  </p>
                </div>

                <span>{chapterProgress}%</span>
              </div>

              <div className="study-plan-progress-bar">
                <div
                  className="study-plan-progress-fill"
                  style={{ width: `${chapterProgress}%` }}
                />
              </div>

              <div className="book-page-grid">
                {pages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`book-page-cell ${
                      checkedPages.includes(page) ? "is-read" : ""
                    }`}
                    onClick={() => togglePage(page)}
                    title={`Side ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
};
