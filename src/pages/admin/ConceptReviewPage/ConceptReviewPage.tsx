import { subjects } from "../../../data/subjects";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadConceptReviews, type ConceptReview } from "../../../services/concepts/conceptReviewService";
import { MathText } from "../../../components/common/MathText/MathText";
import { StructuredConceptContent } from "../../../components/concepts/StructuredConceptContent/StructuredConceptContent";
import "../../../components/concepts/LearningPage/LearningPage.css";
import "./ConceptReviewPage.css";

export function ConceptReviewPage() {
  const [reviews, setReviews] = useState<ConceptReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("review");
  useEffect(() => {
    let cancelled = false;
    loadConceptReviews().then(result => { if (!cancelled) setReviews(result); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  const visible = reviews.filter(item => (filter === "all" || item.status === filter) &&
    `${item.concept.name} ${item.sources.map(source => source.subjectId).join(" ")} ${(item.contexts ?? []).map(context => `${context.subjectId} ${subjects.find(subject => subject.id === context.subjectId)?.name ?? ""}`).join(" ")}`.toLocaleLowerCase("nb").includes(query.toLocaleLowerCase("nb")));
  return <main className="concept-review learning-page site-container">
    <Link to="/admin/concepts">← Begrepsadministrasjon</Link>
    <h1>Gjennomgå begreper</h1>
    <p>Kun forhåndsvisning. Ingen data lagres eller endres. Forslag er ordrette kildeutdrag, ikke oversettelser. Engelske fagtermer i kilden beholdes.</p>
    <p>Tekstavvik er kandidater for manuell vurdering, ikke bevis på feil eller AI-opphav. Kilder uten entydig kobling brukes ikke til forslag.</p>
    {loading ? <p role="status">Sammenligner begreper med tilgjengelige kildenotater…</p> : error ? <p role="alert">Kunne ikke hente hele grunnlaget. Last siden på nytt.</p> : <>
      <div className="concept-review-filters"><label>Søk etter begrep eller fag<input value={query} onChange={event => setQuery(event.target.value)} /></label>
        <label>Vis<select value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="review">Avvik til vurdering</option><option value="all">Alle begreper</option><option value="missing">Mangler kildebokser</option><option value="consistent">Ingen påviste avvik</option>
        </select></label></div>
      <p role="status">{visible.length} av {reviews.length} begreper</p>
      {visible.map(item => <details className="concept-review-item" key={item.concept.id}>
        <summary><MathText>{item.concept.name}</MathText> · {item.sources.length === 0 ? <span className="concept-review-missing">Ingen kilde funnet</span> : `${item.sources.length} kildebokser`}</summary>
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
        <h2>Eksisterende innhold</h2>
        <p><strong>Navn:</strong> <MathText>{item.concept.name}</MathText></p>
        <p><strong>Definisjon:</strong> <MathText>{item.concept.shortDefinition || "Ingen definisjon"}</MathText></p>
        <p><strong>Forklaring:</strong> <MathText>{item.concept.explanation || "Ingen forklaring"}</MathText></p>
        <h2>Forslag til vurdering</h2>
        <p><strong>Navn:</strong> <MathText>{item.proposedName || "Ingen navneendring foreslått"}</MathText></p>
        <p><strong>Kildetekst for definisjon/forklaring:</strong> <MathText>{item.proposedText || "Ingen entydig tekstanbefaling. Se kildene nedenfor."}</MathText></p>
        <ul>{item.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul>
        {item.sources.length > 0 && <><h2>Kildegrunnlag</h2><StructuredConceptContent content={item.sources} /></>}
      </details>)}
    </>}
  </main>;
}
