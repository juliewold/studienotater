import "./SubtopicPage.css";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { getConceptsFromDatabase } from "../../../services/concepts/conceptService";
import { getConceptIdsBySubtopic } from "../../../services/concepts/conceptSubtopicsService";
import type { Concept } from "../../../data/concepts/types";

import {
  getSubtopicsByTopic,
  getTopicsBySubject,
  type DatabaseSubtopic,
  type DatabaseTopic,
} from "../../../services/subjects/subjectStructureService";

export const SubtopicPage = () => {
  const { subjectId, topicId, subtopicId } = useParams();

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [topic, setTopic] = useState<DatabaseTopic | null>(null);
  const [subtopic, setSubtopic] = useState<DatabaseSubtopic | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSubtopic = async () => {
      if (!subjectId || !topicId || !subtopicId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const [topics, subtopics, conceptIds, allConcepts] = await Promise.all([
          getTopicsBySubject(subjectId),
          getSubtopicsByTopic(topicId),
          getConceptIdsBySubtopic(subtopicId),
          getConceptsFromDatabase(),
        ]);

        const conceptIdSet = new Set(conceptIds);

        const loadedConcepts = allConcepts.filter((concept) =>
          conceptIdSet.has(concept.id),
        );

        setConcepts(loadedConcepts);

        setTopic(topics.find((item) => item.id === topicId) ?? null);

        setSubtopic(subtopics.find((item) => item.id === subtopicId) ?? null);
      } catch (error) {
        console.error("Kunne ikke hente undertema:", error);

        setConcepts([]);
        setTopic(null);
        setSubtopic(null);
        setErrorMessage("Kunne ikke hente undertemaet.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSubtopic();
  }, [subjectId, topicId, subtopicId]);

  if (isLoading) {
    return (
      <main className="subtopic-page">
        <p>Laster undertema...</p>
      </main>
    );
  }

  if (errorMessage || !topic || !subtopic || !subjectId) {
    return (
      <main className="subtopic-page">
        <p>{errorMessage || "Fant ikke undertemaet."}</p>
      </main>
    );
  }

  return (
    <main className="subtopic-page">
      <Link to={`/fag/${subjectId}/tema/${topic.id}`} className="back-link">
        ← Tilbake til {topic.name}
      </Link>

      <p className="subtopic-page-label">Undertema</p>

      <h1>{subtopic.name}</h1>

      <section className="subtopic-page-section">
        <div className="subtopic-page-section-header">
          <div>
            <p className="subtopic-page-label">Lær dette</p>
            <h2>Konsepter</h2>
          </div>
        </div>

        {concepts.length === 0 ? (
          <div className="subtopic-page-empty">
            <p>Ingen konsepter er koblet til dette undertemaet ennå.</p>
          </div>
        ) : (
          <div className="subtopic-page-concepts">
            {concepts.map((concept) => (
              <Link
                key={concept.id}
                to={`/concepts/${concept.slug}`}
                className="subtopic-page-concept"
              >
                <div>
                  <span className="subtopic-page-concept-type">
                    {concept.type}
                  </span>

                  <h3>{concept.name}</h3>

                  <p>{concept.shortDefinition}</p>
                </div>

                <ChevronRight size={20} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
