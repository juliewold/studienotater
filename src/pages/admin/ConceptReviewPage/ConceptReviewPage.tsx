import { ConceptReviewActions } from "./ConceptReviewActions";
import { subjects } from "../../../data/subjects";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { loadConceptReviewIndex, createConceptReviewSession, type ConceptReview, type ConceptReviewIndex } from "../../../services/concepts/conceptReviewService";
import { MathText } from "../../../components/common/MathText/MathText";
import { StructuredConceptContent } from "../../../components/concepts/StructuredConceptContent/StructuredConceptContent";
import "../../../components/concepts/LearningPage/LearningPage.css";
import "./ConceptReviewPage.css";

type Session = ReturnType<typeof createConceptReviewSession>;
export function ConceptReviewPage() {
  const [revision, setRevision] = useState(0);
  const generation = useRef(0);
  const [index, setIndex] = useState<ConceptReviewIndex[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [known, setKnown] = useState<Record<string, ConceptReview>>({});
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    let cancelled = false;
    loadConceptReviewIndex().then(result => {
      if (!cancelled) { setSession(createConceptReviewSession(result.map(item => item.concept))); setIndex(result); }
    }).catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [revision]);
  const searched = index.filter(item => `${item.concept.name} ${(known[item.concept.id]?.sources ?? []).map(source => source.subjectId).join(" ")} ${item.contexts.map(context => `${context.subjectId} ${subjects.find(subject => subject.id === context.subjectId)?.name ?? ""}`).join(" ")}`.toLocaleLowerCase("nb").includes(query.toLocaleLowerCase("nb")));
  const visible = searched.filter(item => filter === "all" || expanded.has(item.concept.id) || !known[item.concept.id] || known[item.concept.id].status === filter);
  const unknown = visible.filter(item => !known[item.concept.id]);
  const analyzed = visible.filter(item => known[item.concept.id]);
  const changed = () => { generation.current++; setLoading(true); setError(false); setKnown({}); setExpanded(new Set()); setRevision(value => value + 1); };
  function rows(items: ConceptReviewIndex[]) {
    return items.map(({ concept }) => <ReviewRow key={concept.id} concept={concept} item={known[concept.id]}
      open={expanded.has(concept.id)} onExpand={open => setExpanded(current => { const next = new Set(current); if (open) next.add(concept.id); else next.delete(concept.id); return next; })}
      session={session!} onLoaded={item => { if (generation.current === revision) setKnown(current => ({ ...current, [concept.id]: item })); }} onChange={changed} />);
  }
  return <main className="concept-review learning-page site-container">
    <Link to="/admin/concepts">← Begrepsadministrasjon</Link><h1>Gjennomgå begreper</h1>
    <p>Manuell gjennomgang. Endringer lagres bare når du velger å lagre eller bekrefter sletting. Forslag er ordrette kildeutdrag, ikke oversettelser. Engelske fagtermer i kilden beholdes.</p>
    <p>Tekstavvik er kandidater for manuell vurdering, ikke bevis på feil eller AI-opphav. Kilder uten entydig kobling brukes ikke til forslag.</p>
    {loading ? <p role="status">Henter begrepslisten…</p> : error ? <p role="alert">Kunne ikke hente begrepslisten. Last siden på nytt.</p> : <>
      <div className="concept-review-filters"><label>Søk etter begrep eller fag<input value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label>Vis<select value={filter} onChange={event => { setFilter(event.target.value); setExpanded(new Set()); }}>
          <option value="review">Avvik til vurdering</option><option value="all">Alle begreper</option><option value="missing">Ingen kilde funnet i faget</option><option value="text">Finnes i tilknyttet notat</option><option value="subject-text">Finnes i annet notat i faget</option><option value="consistent">Ingen påviste avvik</option>
        </select></label></div>
      <p role="status">{visible.length} av {index.length} begreper · {Object.keys(known).length} undersøkt</p>
      <p>Kildestatus beregnes når du åpner et begrep. Statusfilteret gjelder undersøkte begreper; uundersøkte vises separat.</p>
      {filter === "all" ? rows(visible) : <>{rows(analyzed)}{unknown.length > 0 && <><h2>Ikke undersøkt ennå ({unknown.length})</h2>{rows(unknown)}</>}</>}
    </>}
  </main>;
}

function ReviewRow({ concept, item, session, onLoaded, onChange, open, onExpand }: {
  concept: ConceptReview["concept"]; item?: ConceptReview; session: Session;
  onLoaded: (item: ConceptReview) => void; onChange: () => void; open: boolean; onExpand: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef(false);
  async function load() {
    if (item || pending.current) return;
    pending.current = true; setLoading(true); setFailed(false);
    try { onLoaded(await session.load(concept)); }
    catch { setFailed(true); }
    finally { pending.current = false; setLoading(false); }
  }
  return <details className="concept-review-item" open={open} onToggle={event => {
    const expanded = event.currentTarget.open; onExpand(expanded); if (expanded) void load();
  }}>
    <summary><MathText>{concept.name}</MathText> · {!item ? "Ikke undersøkt ennå" : item.sources.length ? `${item.sources.length} kildebokser` :
      <span className="concept-review-missing">{item.contextError || item.textSearchError ? "Kildesøk ufullstendig" : item.status === "text" ? "Finnes i tilknyttet notat" : item.status === "subject-text" ? "Finnes i annet notat i faget" : item.contexts?.length ? "Ingen kilde funnet i faget" : "Ingen fagkobling – kan ikke søke i faget"}</span>}</summary>
    {(open || item) && <>{loading && <p role="status">Henter kildegrunnlag…</p>}
      {failed && <p role="alert">Kunne ikke hente kildegrunnlaget. <button onClick={() => void load()}>Prøv igjen</button></p>}
      {item && <ReviewDetails item={item} onChange={onChange} />}
    </>}
  </details>;
}

function ReviewDetails({ item, onChange }: { item: ConceptReview; onChange: () => void }) {
  return <>
        {item.sources.length === 0 && <section aria-label="Pensumkoblinger">
          <h2>Koblet til pensum</h2>
          {item.contextError ? <p role="alert">Kunne ikke hente koblingene. Ikke vurder begrepet som foreldreløst før koblingene er kontrollert. Last siden på nytt.</p> : item.contexts?.length ? <ul>{item.contexts.map(context => {
            const subject = subjects.find(subject => subject.id === context.subjectId);
            return <li key={`${context.subjectId}-${context.topicId}-${context.subtopicId}`}>
              <Link to={`/fag/${context.subjectId}`}>{subject ? `${subject.code} – ${subject.name}` : context.subjectId.toUpperCase()}</Link>
              {" → "}<Link to={`/fag/${context.subjectId}/tema/${context.topicId}`}><MathText>{context.topicName}</MathText></Link>
              {" → "}<Link to={`/fag/${context.subjectId}/tema/${context.topicId}/undertema/${context.subtopicId}`}><MathText>{context.subtopicName}</MathText></Link>
            </li>;
          })}</ul> : <p>Ingen fag-, tema- eller undertemakoblinger funnet.</p>}
          <p>Manglende kildebokser er ikke i seg selv bevis på feil eller AI-opphav.</p>
        </section>}
        {item.sources.length === 0 && item.textSearchError && <p role="alert">Tekstsøket kunne ikke fullføres. Last siden på nytt før du vurderer om kilden mangler.</p>}
        {!!item.textMatches?.length && <section aria-label="Treff i notattekst"><h2>{item.status === "subject-text" ? "Finnes i annet notat i faget" : "Finnes i tilknyttet notat"}</h2>
          <p>Navnet er nevnt i et relevant notat. Dette bekrefter ikke en definisjon eller en kildebokskobling.</p>
          {item.textMatches.map(match => <article key={match.noteId}><blockquote>{match.excerpt}</blockquote>
            <Link to={`/fag/${match.subjectId}/notater/${match.noteSlug}`}>{match.noteTitle} →</Link></article>)}
        </section>}
        <h2>Eksisterende innhold</h2>
        <p><strong>Navn:</strong> <MathText>{item.concept.name}</MathText></p>
        <p><strong>Definisjon:</strong> <MathText>{item.concept.shortDefinition || "Ingen definisjon"}</MathText></p>
        <p><strong>Forklaring:</strong> <MathText>{item.concept.explanation || "Ingen forklaring"}</MathText></p>
        <h2>Forslag til vurdering</h2>
        <p><strong>Navn:</strong> <MathText>{item.proposedName || "Ingen navneendring foreslått"}</MathText></p>
        <p><strong>Kildetekst for definisjon/forklaring:</strong> <MathText>{item.proposedText || "Ingen entydig tekstanbefaling. Se kildene nedenfor."}</MathText></p>
        <ul>{item.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
        {item.sources.length > 0 && <><h2>Kildegrunnlag</h2><StructuredConceptContent content={item.sources} /></>}
        <ConceptReviewActions concept={item.concept} onChange={onChange} />
  </>;
}
