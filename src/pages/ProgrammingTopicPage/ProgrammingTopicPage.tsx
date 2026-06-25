import { Link, useParams } from "react-router-dom";
import { pythonOverview } from "../../data/programming/python/overview";
import "./ProgrammingTopicPage.css";
import { javascriptOverview } from "../../data/programming/javascript/overview";
import { LessonRenderer } from "../../components/lesson/LessonRenderer/LessonRenderer";

const programmingData = {
  python: pythonOverview,
  javascript: javascriptOverview,
};

export function ProgrammingTopicPage() {
  const { topicId, lessonId } = useParams();

  const topic = topicId
    ? programmingData[topicId as keyof typeof programmingData]
    : undefined;

  if (!topic) {
    return (
      <main className="programming-topic-page">
        <Link to="/programmering" className="back-link">
          ← Tilbake til programmering
        </Link>

        <h1>Fant ikke temaet</h1>
      </main>
    );
  }

  const lesson = lessonId
    ? topic.lessons.find((lesson) => lesson.id === lessonId)
    : undefined;

  if (lesson) {
    return (
      <main className="programming-doc-layout">
        <aside className="programming-sidebar">
          <Link to={`/programmering/${topic.id}`} className="back-link">
            ← Tilbake til {topic.title}
          </Link>

          <h2>{topic.title}</h2>

          {topic.lessons.map((lessonItem) => (
            <Link
              key={lessonItem.id}
              to={`/programmering/${topic.id}/${lessonItem.id}`}
              className={
                lessonItem.id === lesson.id
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {lessonItem.title}
            </Link>
          ))}
        </aside>

        <div className="programming-doc-content">
          <div className="lesson-header">
            <h1>{lesson.title}</h1>
          </div>

          <LessonRenderer lesson={lesson} language={topic.id} />
        </div>
      </main>
    );
  }

  return (
    <main className="programming-topic-page">
      <Link to="/programmering" className="back-link">
        ← Tilbake til programmering
      </Link>

      <div className="lesson-header">
        <h1>{topic.title}</h1>
        <p>{topic.description}</p>
      </div>

      <section className="topic-lessons-section">
        <h2>{topic.title}-kapitler</h2>

        <div className="topic-lessons-grid">
          {topic.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/programmering/${topic.id}/${lesson.id}`}
              className="topic-lesson-card"
            >
              {lesson.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
