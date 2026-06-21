import "./HomeProgress.css";
import { Link } from "react-router-dom";
import { pdfs } from "../../data/pdfs";
import { subjects } from "../../data/subjects";

export const HomeProgress = () => {
  const savedSubjects = localStorage.getItem("semester-subjects");

  const selectedSubjects: string[] = savedSubjects
    ? JSON.parse(savedSubjects)
    : [];

  const progressSubjects = selectedSubjects.map((subjectId) => {
    const subject = subjects.find((subject) => subject.id === subjectId);
    const subjectPdfs = pdfs[subjectId as keyof typeof pdfs] || [];

    const completedPdfs = subjectPdfs.filter(
      (pdf) =>
        localStorage.getItem(
          `resource-progress-pdf-${subjectId}-${pdf.id}-completed`,
        ) === "true",
    );

    const ratings = subjectPdfs
      .map((pdf) =>
        Number(
          localStorage.getItem(
            `resource-progress-pdf-${subjectId}-${pdf.id}-rating`,
          ),
        ),
      )
      .filter((rating) => rating > 0);

    const averageRating =
      ratings.length === 0
        ? 0
        : Math.round(
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
          );

    const progress =
      subjectPdfs.length === 0
        ? 0
        : Math.round((completedPdfs.length / subjectPdfs.length) * 100);

    return {
      id: subjectId,
      code: subject?.code ?? subjectId.toUpperCase(),
      name: subject?.name ?? "",
      completed: completedPdfs.length,
      total: subjectPdfs.length,
      progress,
      averageRating,
    };
  });

  if (progressSubjects.length === 0) {
    return null;
  }

  return (
    <section className="home-progress">
      <div className="home-progress-header">
        <div>
          <p className="home-progress-label">Pensumtracker</p>
          <h2>Fremdrift i semesterfagene dine</h2>
        </div>
      </div>

      <div className="home-progress-list">
        {progressSubjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/fag/${subject.id}/pdfs`}
            className="home-progress-item"
          >
            <div className="home-progress-info">
              <div>
                <strong>{subject.code}</strong>
                <span>{subject.name}</span>
              </div>

              <p>
                {subject.total === 0
                  ? "0 / 0 PDF-er"
                  : `${subject.completed} / ${subject.total} PDF-er lest`}
              </p>
            </div>

            <div className="home-progress-bar">
              <div
                className="home-progress-fill"
                style={{ width: `${subject.progress}%` }}
              />
            </div>

            <p className="home-progress-percent">
              {subject.progress}% fullført
              {subject.averageRating > 0 &&
                ` · Forståelse: ${"★".repeat(subject.averageRating)}`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
