import "./TopicPage.css";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import {
  getSubtopicsByTopic,
  getTopicsBySubject,
  type DatabaseSubtopic,
  type DatabaseTopic,
} from "../../../services/subjects/subjectStructureService";

export const TopicPage = () => {
  const { subjectId, topicId } = useParams();

  const [topic, setTopic] = useState<DatabaseTopic | null>(null);
  const [subtopics, setSubtopics] = useState<DatabaseSubtopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadTopic = async () => {
      if (!subjectId || !topicId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const [topics, loadedSubtopics] = await Promise.all([
          getTopicsBySubject(subjectId),
          getSubtopicsByTopic(topicId),
        ]);

        const currentTopic = topics.find((item) => item.id === topicId) ?? null;

        setTopic(currentTopic);
        setSubtopics(loadedSubtopics);
      } catch (error) {
        console.error("Kunne ikke hente tema:", error);

        setTopic(null);
        setSubtopics([]);
        setErrorMessage("Kunne ikke hente temaet.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTopic();
  }, [subjectId, topicId]);

  if (isLoading) {
    return (
      <main className="topic-page">
        <p>Laster tema...</p>
      </main>
    );
  }

  if (errorMessage || !topic || !subjectId) {
    return (
      <main className="topic-page">
        <Link to={`/fag/${subjectId}`} className="back-link">
          ← Tilbake til faget
        </Link>

        <p>{errorMessage || "Fant ikke temaet."}</p>
      </main>
    );
  }

  return (
    <main className="topic-page">
      <Link to={`/fag/${subjectId}`} className="back-link">
        ← Tilbake til faget
      </Link>

      <p className="topic-page-label">Tema</p>

      <h1>{topic.name}</h1>

      <section className="topic-page-section">
        <div className="topic-page-section-header">
          <div>
            <p className="topic-page-label">Pensum</p>
            <h2>Undertemaer</h2>
          </div>

          <span>{subtopics.length} undertema</span>
        </div>

        <div className="topic-page-subtopics">
          {subtopics.map((subtopic, index) => (
            <Link
              key={subtopic.id}
              to={`/fag/${subjectId}/tema/${topic.id}/undertema/${subtopic.id}`}
              className="topic-page-subtopic"
            >
              <span className="topic-page-subtopic-number">{index + 1}</span>

              <span className="topic-page-subtopic-name">{subtopic.name}</span>

              <ChevronRight size={20} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
