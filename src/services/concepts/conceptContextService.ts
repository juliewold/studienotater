import { supabase } from "../../lib/supabase";

export type ConceptContext = {
  subjectId: string;
  topicId: string;
  topicName: string;
  subtopicId: string;
  subtopicName: string;
};

export async function getConceptSubtopicIds(conceptId: string): Promise<string[]> {
  const { data, error } = await supabase.from("concept_subtopics")
    .select("subtopic_id").eq("concept_id", conceptId);
  if (error) throw error;
  return [...new Set((data ?? []).map(link => link.subtopic_id as string))];
}

export async function getConceptContexts(
  conceptId: string,
  knownSubtopicIds?: string[],
): Promise<ConceptContext[]> {
  const subtopicIds = knownSubtopicIds ?? await getConceptSubtopicIds(conceptId);
  if (subtopicIds.length === 0) return [];

  const { data: subtopics, error: subtopicsError } = await supabase
    .from("subtopics")
    .select("id, topic_id, name")
    .in("id", subtopicIds);

  if (subtopicsError) {
    throw subtopicsError;
  }

  const topicIds = Array.from(
    new Set((subtopics ?? []).map((subtopic) => subtopic.topic_id)),
  );

  if (topicIds.length === 0) {
    return [];
  }

  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id, subject_id, name")
    .in("id", topicIds);

  if (topicsError) {
    throw topicsError;
  }

  const topicsById = new Map((topics ?? []).map((topic) => [topic.id, topic]));

  return (subtopics ?? []).flatMap((subtopic) => {
    const topic = topicsById.get(subtopic.topic_id);

    if (!topic) {
      return [];
    }

    return [
      {
        subjectId: topic.subject_id,
        topicId: topic.id,
        topicName: topic.name,
        subtopicId: subtopic.id,
        subtopicName: subtopic.name,
      },
    ];
  });
}
