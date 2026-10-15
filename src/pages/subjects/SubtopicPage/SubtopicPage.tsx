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
  const sourced = data.concepts.filter(concept => data.content.some(block => block.conceptId === concept.id));
  const fallback = data.concepts.filter(concept => !sourced.some(item => item.id === concept.id));
  return <main className="subtopic-page learning-page site-container">
    <Link to={`/fag/${subjectId}/tema/${topicId}`} className="back-link">← {data.topic.name}</Link>
    <header><p className="learning-label">Undertema</p><h1>{data.subtopics[0].name}</h1></header>
    <section className="learning-section" aria-label="Innhold fra notatene">
      {data.concepts.length === 0 && data.sourceContent.length === 0 && <p>Ingen begreper er koblet til dette undertemaet ennå.</p>}
      {sourced.map(concept => <article className="learning-entry" key={concept.id}>
        <h2><Link to={`/concepts/${concept.slug}`}>{concept.name}</Link></h2>
        <StructuredConceptContent sources={false} content={data.content.filter(block => block.conceptId === concept.id)} />
      </article>)}
      {Array.from(new Set(data.sourceContent.map(block => block.noteId)), noteId => {
        const content = data.sourceContent.filter(block => block.noteId === noteId);
        return <article className="learning-entry" key={noteId}><h2>{content[0].noteTitle}</h2>
          <StructuredConceptContent sources={false} content={content} />
        </article>;
      })}
      {fallback.length > 0 && <details className="learning-fallback" open={sourced.length === 0 && data.sourceContent.length === 0}>
        <summary>Flere begreper · korte forklaringer ({fallback.length})</summary>
        {fallback.map(concept => <article key={concept.id}>
          <h3><Link to={`/concepts/${concept.slug}`}>{concept.name}</Link></h3>
          <p><MathText>{concept.shortDefinition || concept.explanation || "Ingen forklaring ennå."}</MathText></p>
        </article>)}
      </details>}
    </section>
    {data.notes.length > 0 && <section className="learning-section"><h2>Kilder og videre lesing</h2>
      <ul className="learning-source-list">{data.notes.map(note => <li key={note.id}><Link to={`/fag/${note.subjectId}/notater/${note.slug}`}>{note.title} →</Link></li>)}</ul>
    </section>}
  </main>;
}
