import { Link } from "react-router-dom";

import { useBookProgress } from "../../../hooks/useBookProgress";
import type { DatabaseBook } from "../../../services/study/booksService";

type BookProgressCardProps = {
  book: DatabaseBook;
  subjectId: string;
};

export const BookProgressCard = ({
  book,
  subjectId,
}: BookProgressCardProps) => {
  const { checkedPages, isLoading } = useBookProgress(book.slug);

  const totalPages = book.chapters.reduce(
    (total, chapter) => total + (chapter.endPage - chapter.startPage + 1),
    0,
  );

  const readPages = checkedPages.filter((page) =>
    book.chapters.some(
      (chapter) => page >= chapter.startPage && page <= chapter.endPage,
    ),
  ).length;

  const progress =
    totalPages === 0 ? 0 : Math.round((readPages / totalPages) * 100);

  if (isLoading) {
    return (
      <section className="book-progress-card">
        <p>Laster bokfremdrift...</p>
      </section>
    );
  }

  return (
    <Link
      to={`/fag/${subjectId}/bok/${book.slug}`}
      className="book-progress-link"
    >
      <section className="book-progress-card">
        <div className="book-progress-header">
          <div>
            <p className="study-plan-summary-label">Bokfremdrift</p>

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
