import { groupSubtopicContent } from "./subtopicPresentation";
import "./SubtopicPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadTopicLearning } from "../../../services/subjects/topicLearningService";
import { StructuredConceptContent } from "../../../components/concepts/StructuredConceptContent/StructuredConceptContent";
import { MathText } from "../../../components/common/MathText/MathText";

type Content = Awaited<ReturnType<typeof loadTopicLearning>>;
export const SubtopicPage = () => {
  const { subjectId = "", topicId = "", subtopicId = "" } = useParams();
  return <SubtopicDetails key={`${subjectId}-${topicId}-${subtopicId}`} subjectId={subjectId} topicId={topicId} subtopicId={subtopicId} />;
};
function SubtopicDetails({ subjectId, topicId, subtopicId }: { subjectId: string; topicId: string; subtopicId: string }) {
  const [data, setData] = useState<Content | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    loadTopicLearning(subjectId, topicId, subtopicId).then(result => {
      if (!cancelled) setData(result);
    }).catch(() => { if (!cancelled) setError("Kunne ikke hente undertemaet."); });
    return () => { cancelled = true; };
  }, [subjectId, topicId, subtopicId]);
  if (error || !data) return <main className="subtopic-page learning-page site-container"><p role={error ? "alert" : "status"}>{error || "Laster undertema..."}</p></main>;
  const sections = groupSubtopicContent(data.content, data.sourceContent);
  const sourced = data.concepts.filter(concept => data.content.some(block => block.conceptId === concept.id));
  const fallback = data.concepts.filter(concept => !sourced.some(item => item.id === concept.id));
  return <main className="subtopic-page learning-page site-container">
    <Link to={`/fag/${subjectId}/tema/${topicId}`} className="back-link">← {data.topic.name}</Link>
    <header><p className="learning-label">Undertema</p><h1>{data.subtopics[0].name}</h1></header>
    {sections.length > 1 && <nav className="subtopic-sections-nav" aria-label="På denne siden">
      <span>På denne siden</span>
      <ul>{sections.map(section => <li key={section.id}><a href={`#subtopic-${section.id}`} onClick={event => {
        event.preventDefault();
        const target = document.getElementById(`subtopic-${section.id}`);
        target?.focus({ preventScroll: true });
        target?.scrollIntoView({ block: "start" });
      }}>{section.title}</a></li>)}</ul>
    </nav>}
    {data.concepts.length === 0 && sections.length === 0 && <p className="learning-section">Ingen begreper er koblet til dette undertemaet ennå.</p>}
    {sections.map(section => {
      const conceptIds = new Set(section.content.map(block => block.conceptId));
      const related = data.concepts.filter(concept => conceptIds.has(concept.id));
      return <section className="learning-section subtopic-content-section" key={section.id}
        id={`subtopic-${section.id}`} tabIndex={-1} aria-labelledby={`subtopic-${section.id}-title`}>
        <header className="subtopic-section-heading"><h2 id={`subtopic-${section.id}-title`}>{section.title}</h2>
          <span aria-label={`${section.content.length} kildebokser`}>{section.content.length}</span>
        </header>
        <StructuredConceptContent sources={false} content={section.content} />
        {related.length > 0 && <nav className="subtopic-concept-links" aria-label={`Begrepssider: ${section.title}`}>
          <span>Utforsk begrepene</span><ul>{related.map(concept => <li key={concept.id}><Link to={`/concepts/${concept.slug}`}>{concept.name}</Link></li>)}</ul>
        </nav>}
      </section>;
    })}
    <div>
      {fallback.length > 0 && <details className="learning-fallback" open={sourced.length === 0 && data.sourceContent.length === 0}>
        <summary>Flere begreper · korte forklaringer ({fallback.length})</summary>
        {fallback.map(concept => <article key={concept.id}>
          <h3><Link to={`/concepts/${concept.slug}`}>{concept.name}</Link></h3>
          <p><MathText>{concept.shortDefinition || concept.explanation || "Ingen forklaring ennå."}</MathText></p>
        </article>)}
      </details>}
    </div>
    {data.notes.length > 0 && <section className="learning-section subtopic-sources"><h2>Kilder og videre lesing</h2>
      <ul className="learning-source-list">{data.notes.map(note => <li key={note.id}><Link to={`/fag/${note.subjectId}/notater/${note.slug}`}>{note.title} →</Link></li>)}</ul>
    </section>}
  </main>;
}
