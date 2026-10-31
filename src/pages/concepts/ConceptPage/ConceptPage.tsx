import { useConceptContentSession } from "../../../hooks/useConceptContentSession";
import "./ConceptPage.css";
import "katex/dist/katex.min.css";

import { StructuredConceptContent } from "../../../components/concepts/StructuredConceptContent/StructuredConceptContent";
import { MathText } from "../../../components/common/MathText/MathText";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Concept } from "../../../data/concepts/types";

import {
  type ConceptContentSource,
} from "../../../services/concepts/conceptContentService";

import {
  type ConceptContext,
} from "../../../services/concepts/conceptContextService";

export const ConceptPage = () => {
  const { slug } = useParams();

  return <ConceptDetails key={slug} slug={slug} />;
};

const ConceptDetails = ({ slug }: { slug: string | undefined }) => {
  const session = useConceptContentSession();
  const [concept, setConcept] = useState<Concept | undefined>();
  const [isConceptLoading, setIsConceptLoading] = useState(true);
  const [conceptContent, setConceptContent] = useState<ConceptContentSource[]>([]);
  const [conceptContexts, setConceptContexts] = useState<ConceptContext[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceFailed, setSourceFailed] = useState(false);
  const [conceptError, setConceptError] = useState(false);
  const [dataErrors, setDataErrors] = useState<string[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      let loadedConcept: Concept | undefined;
      try {
        loadedConcept = slug ? await session.getConcept(slug) : undefined;
      } catch (error) {
        console.error("Kunne ikke hente konsept:", error);
        if (!isCancelled) setConceptError(true);
      }
      if (isCancelled) return;
      setConcept(loadedConcept);
      setIsConceptLoading(false);
      if (!loadedConcept) {
        setIsLoading(false);
        return;
      }

      const [content, contexts] = await Promise.allSettled([
        session.getContent(loadedConcept.id),
        session.getContexts(loadedConcept.id),
      ]);
      if (isCancelled) return;

      const errors: string[] = [];
      if (content.status === "fulfilled") {
        setConceptContent(content.value);
      } else {
        setSourceFailed(true);
        console.error("Kunne ikke hente kildeinnhold:", content.reason);
        errors.push("Kunne ikke hente innhold fra notatene. Prøv å laste siden på nytt.");
      }
      if (contexts.status === "fulfilled") {
        setConceptContexts(contexts.value);
      } else {
        console.error("Kunne ikke hente tilhørighet:", contexts.reason);
        errors.push("Kunne ikke hente tilhørighet til temaer. Prøv å laste siden på nytt.");
      }
      setDataErrors(errors);
      setIsLoading(false);
    };

    void load();
    return () => { isCancelled = true; };
  }, [slug, session]);

  if (isConceptLoading) {
    return (
      <main className="concept-page learning-page site-container">
        <p>Henter konsept...</p>
      </main>
    );
  }

  if (!concept) {
    return (
      <main className="concept-page learning-page site-container">
        <h1>{conceptError ? "Kunne ikke hente konseptet" : "Fant ikke konseptet"}</h1>

        <p>{conceptError ? "Prøv å laste siden på nytt." : "Konseptet du prøver å åpne finnes ikke."}</p>
      </main>
    );
  }

  const relatedConcepts: Concept[] = [];

  const sourceNotes = Array.from(
    new Map(
      conceptContent.map((item) => [
        item.noteId,
        {
          noteId: item.noteId,
          noteTitle: item.noteTitle,
          subjectId: item.subjectId,
          noteSlug: item.noteSlug,
        },
      ]),
    ).values(),
  );

  return (
    <main className="concept-page learning-page site-container">
      <Link to="/" className="back-link">
        ← Tilbake
      </Link>

      <header className="concept-page-header">
        <p className="learning-label">Begrep</p><h1>{concept.name}</h1>

        {!isLoading && !sourceFailed && conceptContent.length === 0 && (
          <p className="concept-page-definition"><MathText>{concept.shortDefinition}</MathText></p>
        )}
      </header>

      {isLoading && (
        <section className="concept-page-section learning-section">
          <p>Henter innhold...</p>
        </section>
      )}

      {dataErrors.map((message) => <p role="status" key={message}>{message}</p>)}

      {!isLoading && conceptContent.length > 0 && <section className="concept-page-section learning-section">
        <StructuredConceptContent content={conceptContent} sources={false} />
      </section>}

      {!isLoading && !sourceFailed && conceptContent.length === 0 && concept.explanation && (
        <section className="concept-page-section learning-section">
          <h2>Forklaring</h2>
          <p><MathText>{concept.explanation}</MathText></p>
        </section>
      )}

      {relatedConcepts.length > 0 && (
        <section className="concept-page-section learning-section">
          <h2>Relaterte begreper</h2>

          <div className="concept-page-related">
            {relatedConcepts.map((relatedConcept) => (
              <Link
                key={relatedConcept.id}
                to={`/concepts/${relatedConcept.slug}`}
                className="concept-page-related-link"
              >
                {relatedConcept.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isLoading && conceptContexts.length > 0 && (
        <section className="concept-page-section learning-section">
          <h2>Tilhører</h2>

          <div className="concept-page-contexts">
            {conceptContexts.map((context) => (
              <Link
                key={`${context.topicId}-${context.subtopicId}`}
                to={`/fag/${context.subjectId}/tema/${context.topicId}/undertema/${context.subtopicId}`}
                className="concept-page-context"
              >
                <span>{context.topicName}</span>
                <span>→</span>
                <strong>{context.subtopicName}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isLoading && sourceNotes.length > 0 && (
        <section className="concept-page-section learning-section">
          <h2>Finnes i notater</h2>

          <ul className="learning-source-list">
            {sourceNotes.map((note) => (
              <li key={note.noteId}><Link
                to={`/fag/${note.subjectId}/notater/${note.noteSlug}`}
                className="concept-page-note-link"
              >
                {note.noteTitle}
                <span> →</span>
              </Link></li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};
