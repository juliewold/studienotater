import "./ConceptPage.css";
import "katex/dist/katex.min.css";

import katex from "katex";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, Sigma } from "lucide-react";

import { getConceptBySlugFromDatabase } from "../../../services/concepts/conceptService";
import type { Concept } from "../../../data/concepts/types";

import {
  getConceptContent,
  type ConceptContentSource,
} from "../../../services/concepts/conceptContentService";

export const ConceptPage = () => {
  const { slug } = useParams();

  const [concept, setConcept] = useState<Concept | undefined>();
  const [isConceptLoading, setIsConceptLoading] = useState(true);

  const [conceptContent, setConceptContent] = useState<ConceptContentSource[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadConcept = async () => {
      if (!slug) {
        setConcept(undefined);
        setIsConceptLoading(false);
        return;
      }

      setIsConceptLoading(true);

      try {
        const loadedConcept = await getConceptBySlugFromDatabase(slug);

        if (!isCancelled) {
          setConcept(loadedConcept);
        }
      } catch (error) {
        console.error("Kunne ikke hente konsept:", error);

        if (!isCancelled) {
          setConcept(undefined);
        }
      } finally {
        if (!isCancelled) {
          setIsConceptLoading(false);
        }
      }
    };

    void loadConcept();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!concept) {
      setConceptContent([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const loadConceptContent = async () => {
      setIsLoading(true);
      setConceptContent([]);

      try {
        const content = await getConceptContent(concept.id);

        if (!isCancelled) {
          setConceptContent(content);
        }
      } catch (error) {
        console.error("Kunne ikke hente konseptinnhold:", error);

        if (!isCancelled) {
          setConceptContent([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadConceptContent();

    return () => {
      isCancelled = true;
    };
  }, [concept?.id]);

  if (isConceptLoading) {
    return (
      <main className="concept-page">
        <p>Henter konsept...</p>
      </main>
    );
  }

  if (!concept) {
    return (
      <main className="concept-page">
        <h1>Fant ikke konseptet</h1>

        <p>Konseptet du prøver å åpne finnes ikke.</p>
      </main>
    );
  }

  const relatedConcepts: Concept[] = [];

  const definitions = conceptContent.filter(
    (item) => item.type === "definition",
  );

  const formulas = conceptContent.filter((item) => item.type === "formula");

  const theorems = conceptContent.filter((item) => item.type === "theorem");

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
    <main className="concept-page">
      <Link to="/" className="concept-page-back">
        ← Tilbake
      </Link>

      <header className="concept-page-header">
        <h1>{concept.name}</h1>

        {!isLoading && conceptContent.length === 0 && (
          <p className="concept-page-definition">{concept.shortDefinition}</p>
        )}
      </header>

      {isLoading && (
        <section className="concept-page-section">
          <p>Henter innhold...</p>
        </section>
      )}

      {!isLoading && definitions.length > 0 && (
        <section className="concept-page-section">
          {definitions.map((definition, index) => (
            <div
              key={`${definition.noteId}-definition-${index}`}
              className="concept-page-callout concept-page-callout-definition"
            >
              <div className="concept-page-callout-header">
                <div className="concept-page-callout-heading">
                  <BookOpen size={18} />
                  <span>Definisjon</span>
                </div>
              </div>

              <div className="concept-page-callout-body">
                {definition.type !== "formula" && (
                  <div
                    className="concept-page-content-html"
                    dangerouslySetInnerHTML={{
                      __html: definition.html,
                    }}
                  />
                )}

                <Link
                  to={`/fag/${definition.subjectId}/notater/${definition.noteSlug}`}
                  className="concept-page-source"
                >
                  Fra {definition.noteTitle} →
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {!isLoading && formulas.length > 0 && (
        <section className="concept-page-section concept-page-formulas">
          <h2>Formler</h2>

          {formulas.map((formula, index) => {
            if (formula.type !== "formula") {
              return null;
            }

            const renderedFormula = katex.renderToString(formula.latex, {
              throwOnError: false,
              displayMode: true,
            });

            return (
              <div
                key={`${formula.noteId}-formula-${index}`}
                className="concept-page-formula"
              >
                <div
                  className="concept-page-formula-math"
                  dangerouslySetInnerHTML={{
                    __html: renderedFormula,
                  }}
                />

                <Link
                  to={`/fag/${formula.subjectId}/notater/${formula.noteSlug}`}
                  className="concept-page-source"
                >
                  Fra {formula.noteTitle} →
                </Link>
              </div>
            );
          })}
        </section>
      )}

      {!isLoading && theorems.length > 0 && (
        <section className="concept-page-section">
          {theorems.map((theorem, index) => (
            <div
              key={`${theorem.noteId}-theorem-${index}`}
              className="concept-page-callout concept-page-callout-theorem"
            >
              <div className="concept-page-callout-header">
                <div className="concept-page-callout-heading">
                  <Sigma size={18} />
                  <span>Teorem</span>
                </div>
              </div>

              <div className="concept-page-callout-body">
                {theorem.type !== "formula" && (
                  <div
                    className="concept-page-content-html"
                    dangerouslySetInnerHTML={{
                      __html: theorem.html,
                    }}
                  />
                )}

                <Link
                  to={`/fag/${theorem.subjectId}/notater/${theorem.noteSlug}`}
                  className="concept-page-source"
                >
                  Fra {theorem.noteTitle} →
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}

      {!isLoading && conceptContent.length === 0 && concept.explanation && (
        <section className="concept-page-section">
          <h2>Forklaring</h2>
          <p>{concept.explanation}</p>
        </section>
      )}

      {relatedConcepts.length > 0 && (
        <section className="concept-page-section">
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

      {!isLoading && sourceNotes.length > 0 && (
        <section className="concept-page-section">
          <h2>Finnes i notater</h2>

          <div className="concept-page-notes">
            {sourceNotes.map((note) => (
              <Link
                key={note.noteId}
                to={`/fag/${note.subjectId}/notater/${note.noteSlug}`}
                className="concept-page-note-link"
              >
                {note.noteTitle}
                <span>→</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
