import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type BookChapter = {
  id: string;
  title: string;
  startPage: number;
  endPage: number;
};

type Book = {
  id: string;
  title: string;
  shortTitle: string;
  chapters: BookChapter[];
};

type BookProgressCardProps = {
  book: Book;
};

export const BookProgressCard = ({
  book,
}: BookProgressCardProps) => {
  const storageKey = `book-progress-${book.id}`;

  const [checkedPages, setCheckedPages] = useState<number[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const updateProgress = () => {
      const saved = localStorage.getItem(storageKey);

      setCheckedPages(saved ? JSON.parse(saved) : []);
    };

    window.addEventListener("focus", updateProgress);

    return () => {
      window.removeEventListener("focus", updateProgress);
    };
  }, [storageKey]);

  const totalPages = book.chapters.reduce(
    (total, chapter) =>
      total + (chapter.endPage - chapter.startPage + 1),
    0,
  );

  const readPages = checkedPages.length;

  const progress =
    totalPages === 0
      ? 0
      : Math.round((readPages / totalPages) * 100);

  return (
    <Link
      to={`/fag/tma4412/bok/${book.id}`}
      className="book-progress-link"
    >
      <section className="book-progress-card">
        <div className="book-progress-header">
          <div>
            <p className="study-plan-summary-label">
              Bokfremdrift
            </p>

            <h2>{book.title}</h2>

            <p>
              {readPages} / {totalPages} sider lest
            </p>
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
    </Link>
  );
};