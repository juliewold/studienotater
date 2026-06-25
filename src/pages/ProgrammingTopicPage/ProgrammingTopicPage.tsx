import { Link, useParams } from "react-router-dom";
import { pythonOverview } from "../../data/programming/python/overview";
import { CodeBlock } from "../../components/CodeBlock/CodeBlock";
import "./ProgrammingTopicPage.css";

const programmingData = {
  python: pythonOverview,
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

          {lesson.sections.map((section) => {
            return (
              <section key={section.title} className="lesson-section">
                <h2>{section.title}</h2>

                {section.content && <p>{section.content}</p>}

                {section.code && (
                  <CodeBlock language="python" code={section.code} />
                )}

                {section.output && (
                  <div className="code-output">
                    <p>Output</p>
                    <pre>{section.output}</pre>
                  </div>
                )}
              </section>
            );
          })}
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
