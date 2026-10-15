import { StructuredConceptContent } from "../../../components/concepts/StructuredConceptContent/StructuredConceptContent";
import "./TopicPage.css";
import "../../../components/notes/NoteEditor/NoteEditor.css";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { ReadOnlyNote } from "../../../components/notes/ReadOnlyNote/ReadOnlyNote";
import { loadTopicLearning, saveTopicIntroduction } from "../../../services/subjects/topicLearningService";

import { exampleTitle, selectTopicRules } from "./topicPresentation";

type LearningData = Awaited<ReturnType<typeof loadTopicLearning>>;
export const TopicPage = () => {
  const { subjectId, topicId } = useParams();
  return <TopicDetails key={`${subjectId}-${topicId}`} subjectId={subjectId} topicId={topicId} />;
};

function TopicDetails({ subjectId, topicId }: { subjectId?: string; topicId?: string }) {
  const { isAdmin } = useContext(AuthContext);
  const [data, setData] = useState<LearningData | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  useEffect(() => {
    let cancelled = false;
    if (!subjectId || !topicId) return;
    loadTopicLearning(subjectId, topicId).then(result => {
      if (!cancelled) { setData(result); setDraft(result.introduction); }
    }).catch(error => { console.error("Kunne ikke hente temasiden:", error instanceof Error ? error.message : JSON.stringify(error)); if (!cancelled) setError("Kunne ikke hente temaet. Prøv å laste siden på nytt."); });
    return () => { cancelled = true; };
  }, [subjectId, topicId]);

  async function save() {
    if (!isAdmin || !topicId || !data) return;
    setSaving(true); setSaveMessage("");
    try {
      const introduction = await saveTopicIntroduction(topicId, draft);
      setData({ ...data, introduction }); setEditing(false); setSaveMessage("Introduksjonen er lagret.");
    } catch { setSaveMessage("Kunne ikke lagre introduksjonen. Prøv igjen."); }
    finally { setSaving(false); }
  }
  const rules = data ? selectTopicRules(data.blocks, data.concepts) : [];
  const examples = data?.blocks.filter(block => block.kind === "example") ?? [];
  const orderedConcepts = data ? [...data.concepts].sort((a, b) =>
    Number(data.content.some(block => block.conceptId === b.id)) - Number(data.content.some(block => block.conceptId === a.id))) : [];
  const conceptLinks = (concepts: LearningData["concepts"]) => <ul className="topic-concept-list">{concepts.map(concept => <li key={concept.id}>
    <Link to={`/concepts/${concept.slug}`}>{concept.name}<span aria-hidden="true"> →</span></Link>
  </li>)}</ul>;
  return <main className="topic-page topic-learning learning-page site-container">
    <Link to={`/fag/${subjectId}`} className="back-link">← Tilbake til faget</Link>
    {error ? <p role="alert">{error}</p> : !data ? <p>Laster tema...</p> : <>
      <header><p className="learning-label">Tema</p><h1>{data.topic.name}</h1>
        {data.introductionError && <p role="alert">{data.introductionError}</p>}
        {editing && isAdmin ? <form className="topic-introduction-editor" onSubmit={event => { event.preventDefault(); void save(); }}>
          <label htmlFor="topic-introduction">Kort introduksjon</label>
          <textarea id="topic-introduction" value={draft} maxLength={3000} rows={5} disabled={saving} onChange={event => setDraft(event.target.value)} />
          <div><button disabled={saving} type="submit">{saving ? "Lagrer…" : "Lagre"}</button>{" "}<button type="button" disabled={saving} onClick={() => { setDraft(data.introduction); setEditing(false); }}>Avbryt</button></div>
        </form> : <>
          {data.introduction && <p className="topic-introduction"><MathText>{data.introduction}</MathText></p>}
          {isAdmin && !data.introductionError && <button className="topic-introduction-control" type="button" onClick={() => { setDraft(data.introduction); setSaveMessage(""); setEditing(true); }}>{data.introduction ? "Rediger introduksjon" : "Legg til introduksjon"}</button>}
        </>}
        {saveMessage && <p role="status">{saveMessage}</p>}
      </header>
      <Section title="Sentrale begreper" empty={data.concepts.length === 0 && !data.sourceContent.some(block => block.type === "definition")}>
        {conceptLinks(orderedConcepts.slice(0, 10))}
        {orderedConcepts.length > 10 && <details className="topic-more"><summary>Alle begreper ({orderedConcepts.length})</summary>{conceptLinks(orderedConcepts.slice(10))}</details>}
        {[...data.content, ...data.sourceContent].some(block => block.type === "definition") && <details className="topic-more">
          <summary>Les definisjonene fra notatene</summary>
          <StructuredConceptContent sources={false} content={[...data.content, ...data.sourceContent].filter(block => block.type === "definition")} />
        </details>}
      </Section>
      <Section title="Formler og regneregler" empty={rules.length === 0 && !data.concepts.some(concept => ["formula", "theorem", "method"].includes(concept.type))}>
        <CompactCollection count={rules.length} limit={3} label="Flere formler og regneregler">
          {rules.map((block, index) => <article className="topic-rule" key={`${block.note.id}-${index}`}>
            {block.latex !== undefined && block.name && <h3>{block.name}</h3>}
            <ReadOnlyNote content={(block.contextHtml ?? "") + block.html} />
          </article>)}
        </CompactCollection>
        {rules.length === 0 && <p className="topic-learning-empty">Se begrepssidene for korte forklaringer.</p>}
      </Section>
      <Section title="Eksempler" empty={examples.length === 0}>
        <CompactCollection count={examples.length} limit={2} label="Flere eksempler">
          {examples.map((block, index) => <details className="topic-example" key={`${block.note.id}-${index}`}><summary><MathText>{exampleTitle(block, index)}</MathText></summary><ReadOnlyNote content={(block.contextHtml ?? "") + block.html} /></details>)}
        </CompactCollection>
      </Section>
      <Section title="Kilder og videre lesing" empty={data.notes.length === 0}>
        <ul className="learning-source-list">{data.notes.map(note => <li key={note.id}><Link to={`/fag/${note.subjectId}/notater/${note.slug}`}>{note.title}</Link></li>)}</ul>
      </Section>
    </>}
  </main>;
}
function Section({ title, empty, children }: { title: string; empty: boolean; children: ReactNode }) {
  if (empty) return null;
  return <section className="topic-page-section learning-section"><div className="topic-page-section-header"><h2>{title}</h2></div>{children}</section>;
}
function CompactCollection({ children, count, limit, label }: { children: ReactNode[]; count: number; limit: number; label: string }) {
  return <>{children.slice(0, limit)}{count > limit && <details className="topic-more"><summary>{label} ({count - limit})</summary>{children.slice(limit)}</details>}</>;
}
