import "./ConceptPage.css";

import { Link, useParams } from "react-router-dom";

import {
  getConceptBySlug,
  getRelatedConcepts,
} from "../../../services/concepts/conceptService";

const conceptTypeLabels = {
  definition: "Definisjon",
  theorem: "Teorem",
  formula: "Formel",
  method: "Metode",
};

export const ConceptPage = () => {
  const { slug } = useParams();

  const concept = slug ? getConceptBySlug(slug) : undefined;

  if (!concept) {
    return (
      <main className="concept-page">
        <h1>Fant ikke konseptet</h1>

        <p>Konseptet du prøver å åpne finnes ikke.</p>
      </main>
    );
  }

  const relatedConcepts = getRelatedConcepts(concept);

  return (
    <main className="concept-page">
      <Link to="/" className="concept-page-back">
        ← Tilbake
      </Link>

      <header className="concept-page-header">
        <span className="concept-page-type">
          {conceptTypeLabels[concept.type]}
        </span>

        <h1>{concept.name}</h1>

        <p className="concept-page-definition">{concept.shortDefinition}</p>
      </header>

      {concept.explanation && (
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
    </main>
  );
};
