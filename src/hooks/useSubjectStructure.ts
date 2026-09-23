import { useEffect, useState } from "react";

import {
  getSubtopicsByTopic,
  getTopicsBySubject,
  type DatabaseSubtopic,
  type DatabaseTopic,
} from "../services/subjects/subjectStructureService";

export type SubjectTopic = DatabaseTopic & {
  subtopics: DatabaseSubtopic[];
};

export const useSubjectStructure = (subjectId: string | undefined) => {
  const [topics, setTopics] = useState<SubjectTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSubjectStructure = async () => {
      if (!subjectId) {
        setTopics([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedTopics = await getTopicsBySubject(subjectId);

        const topicsWithSubtopics = await Promise.all(
          loadedTopics.map(async (topic) => {
            const subtopics = await getSubtopicsByTopic(topic.id);

            return {
              ...topic,
              subtopics,
            };
          }),
        );

        setTopics(topicsWithSubtopics);
      } catch (error) {
        console.error("Kunne ikke hente fagstrukturen:", error);

        setTopics([]);
        setErrorMessage("Kunne ikke hente pensumstrukturen.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjectStructure();
  }, [subjectId]);

  return {
    topics,
    isLoading,
    errorMessage,
  };
};
