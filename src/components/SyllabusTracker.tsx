import { useEffect, useState } from "react";

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
  const storageKey = `syllabus-${subjectId}`;

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const savedTopics = localStorage.getItem(storageKey);

    if (savedTopics) {
      return JSON.parse(savedTopics);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedTopics));
  }, [completedTopics, storageKey]);

  const toggleTopic = (topicId: string) => {
    if (completedTopics.includes(topicId)) {
      setCompletedTopics(completedTopics.filter((id) => id !== topicId));
    } else {
      setCompletedTopics([...completedTopics, topicId]);
    }
  };
  const completedCount = completedTopics.length;

  const progress =
    topics.length === 0
      ? 0
      : Math.round((completedCount / topics.length) * 100);
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
        <div className="progress-fill" style={{ width: `${progress}%` }} />
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
