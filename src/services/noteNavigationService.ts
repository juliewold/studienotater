import {
  getTopicsBySubject,
  getAllSubtopicsBySubject,
  type DatabaseTopic,
  type DatabaseSubtopic,
} from "./subjectStructureService";

import { getNotesBySubject, type DatabaseNote } from "./notesService";

export const getOrderedNotes = async (
  subjectId: string,
): Promise<DatabaseNote[]> => {
  const [topics, subtopics, notes] = await Promise.all([
    getTopicsBySubject(subjectId),
    getAllSubtopicsBySubject(subjectId),
    getNotesBySubject(subjectId),
  ]);

  const topicOrder = new Map(
    topics.map((topic: DatabaseTopic) => [topic.id, topic.sortOrder]),
  );

  const subtopicMap = new Map(
    subtopics.map((subtopic: DatabaseSubtopic) => [subtopic.id, subtopic]),
  );

  return [...notes].sort((a, b) => {
    const subtopicA = a.subtopicId ? subtopicMap.get(a.subtopicId) : undefined;

    const subtopicB = b.subtopicId ? subtopicMap.get(b.subtopicId) : undefined;

    const topicOrderA = subtopicA
      ? (topicOrder.get(subtopicA.topicId) ?? Number.MAX_SAFE_INTEGER)
      : Number.MAX_SAFE_INTEGER;

    const topicOrderB = subtopicB
      ? (topicOrder.get(subtopicB.topicId) ?? Number.MAX_SAFE_INTEGER)
      : Number.MAX_SAFE_INTEGER;

    if (topicOrderA !== topicOrderB) {
      return topicOrderA - topicOrderB;
    }

    const subtopicOrderA = subtopicA?.sortOrder ?? Number.MAX_SAFE_INTEGER;

    const subtopicOrderB = subtopicB?.sortOrder ?? Number.MAX_SAFE_INTEGER;

    if (subtopicOrderA !== subtopicOrderB) {
      return subtopicOrderA - subtopicOrderB;
    }

    return a.title.localeCompare(b.title, "nb");
  });
};
