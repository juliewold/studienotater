import "./SyllabusTracker.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import {
  getCompletedSyllabusTopics,
  saveSyllabusTopic,
} from "../../../services/progressService";

type Topic = {
  id: string;
  title: string;
};

type SyllabusTrackerProps = {
  subjectId: string;
  topics: Topic[];
};

export const SyllabusTracker = ({
  subjectId,
  topics,
}: SyllabusTrackerProps) => {
  const { user } = useContext(AuthContext);

  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompletedTopics = async () => {
      if (!user) {
        setCompletedTopics([]);
        setIsLoading(false);
        return;
      }

      try {
        const completed = await getCompletedSyllabusTopics(
          user.id,
          subjectId,
        );

        setCompletedTopics(completed);
      } catch (error) {
        console.error("Kunne ikke hente pensumfremdrift:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedTopics();
  }, [user, subjectId]);

  const toggleTopic = async (topicId: string) => {
    if (!user) {
      return;
    }

    const isCompleted = completedTopics.includes(topicId);
    const updatedTopics = isCompleted
      ? completedTopics.filter((id) => id !== topicId)
      : [...completedTopics, topicId];

    setCompletedTopics(updatedTopics);

    try {
      await saveSyllabusTopic(
        user.id,
        subjectId,
        topicId,
        !isCompleted,
      );
    } catch (error) {
      console.error("Kunne ikke lagre pensumfremdrift:", error);
      setCompletedTopics(completedTopics);
    }
  };

  const completedCount = completedTopics.length;

  const progress =
    topics.length === 0
      ? 0
      : Math.round((completedCount / topics.length) * 100);

  if (isLoading) {
    return (
      <section className="syllabus-tracker">
        <p>Laster pensumfremdrift...</p>
      </section>
    );
  }

  return (
    <section className="syllabus-tracker">
      <h2>Pensumtracker</h2>

      <div className="progress-info">
        <span>
          {completedCount} / {topics.length} temaer fullført
        </span>

        <span>{progress}%</span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="syllabus-list">
        {topics.map((topic) => (
          <label key={topic.id} className="syllabus-item">
            <input
              type="checkbox"
              checked={completedTopics.includes(topic.id)}
              onChange={() => toggleTopic(topic.id)}
            />

            <span>{topic.title}</span>
          </label>
        ))}
      </div>
    </section>
  );
};