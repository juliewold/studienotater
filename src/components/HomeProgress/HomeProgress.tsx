import "./HomeProgress.css";
import { Link } from "react-router-dom";
import { notes } from "../../data/notes";
import { subjects } from "../../data/subjects";

export const HomeProgress = () => {
  const savedSubjects = localStorage.getItem("semester-subjects");

  const selectedSubjects: string[] = savedSubjects
    ? JSON.parse(savedSubjects)
    : [];

  const progressSubjects = selectedSubjects.map((subjectId) => {
    const subject = subjects.find((subject) => subject.id === subjectId);
    const subjectNotes = notes[subjectId as keyof typeof notes] || [];

    const savedCompletedTopics = localStorage.getItem(`syllabus-${subjectId}`);

    const completedTopics: string[] = savedCompletedTopics
      ? JSON.parse(savedCompletedTopics)
      : [];

    const progress =
      subjectNotes.length === 0
        ? 0
        : Math.round((completedTopics.length / subjectNotes.length) * 100);

    return {
      id: subjectId,
      code: subject?.code ?? subjectId.toUpperCase(),
      name: subject?.name ?? "",
      completed: completedTopics.length,
      total: subjectNotes.length,
      progress,
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
            to={`/fag/${subject.id}`}
            className="home-progress-item"
          >
            <div className="home-progress-info">
              <div>
                <strong>{subject.code}</strong>
                <span>{subject.name}</span>
              </div>

              <p>
                {subject.total === 0
                  ? "0 / 0 temaer"
                  : `${subject.completed} / ${subject.total} temaer`}
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
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
