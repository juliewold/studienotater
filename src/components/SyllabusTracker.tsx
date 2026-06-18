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

  return (
    <section className="syllabus-tracker">
      <h2>Pensumtracker</h2>

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
