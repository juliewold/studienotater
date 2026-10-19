import "./TopicPage.css";
import "../../../components/notes/NoteEditor/NoteEditor.css";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { MathText } from "../../../components/common/MathText/MathText";
import { loadTopicLearning, saveTopicIntroduction } from "../../../services/subjects/topicLearningService";


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
  const orderedConcepts = data ? [...new Map(data.concepts.map(concept => [concept.id, concept])).values()] : [];
  const conceptLinks = (concepts: LearningData["concepts"]) => <ul className="topic-concept-list">{concepts.map(concept => <li key={concept.id}>
    <Link to={`/concepts/${concept.slug}`}><MathText>{concept.name}</MathText></Link>
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
      <Section title="Undertemaer" empty={false}>
        {data.subtopics.length === 0 ? <p className="topic-learning-empty">Ingen undertemaer ennå.</p> :
          <ol className="topic-subtopic-list">{data.subtopics.map((subtopic) => <li key={subtopic.id}>
            <Link to={`/fag/${subjectId}/tema/${topicId}/undertema/${subtopic.id}`}>
              <span><MathText>{subtopic.name}</MathText></span><span aria-hidden="true">→</span>
            </Link>
          </li>)}</ol>}
      </Section>
      <Section title="Sentrale begreper" empty={orderedConcepts.length === 0}>
        {conceptLinks(orderedConcepts.slice(0, 6))}
        {orderedConcepts.length > 6 && <details className="topic-more"><summary>Vis flere begreper ({orderedConcepts.length - 6})</summary>{conceptLinks(orderedConcepts.slice(6))}</details>}
      </Section>
      {data.notes.length > 0 && <details className="topic-sources learning-section">
        <summary><span className="topic-sources-closed">▶ Vis kilder ({data.notes.length})</span><span className="topic-sources-open">▼ Skjul kilder ({data.notes.length})</span></summary>
        <ul className="learning-source-list">{data.notes.map(note => <li key={note.id}><Link to={`/fag/${note.subjectId}/notater/${note.slug}`}>{note.title}</Link></li>)}</ul>
      </details>}
    </>}
  </main>;
}
function Section({ title, empty, children }: { title: string; empty: boolean; children: ReactNode }) {
  if (empty) return null;
  return <section className="topic-page-section learning-section"><div className="topic-page-section-header"><h2>{title}</h2></div>{children}</section>;
}
