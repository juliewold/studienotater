import { supabase } from "../../lib/supabase";
import { getSubtopicIdsByNote } from "./noteSubtopicsService";
import { getTopicsBySubject, getAllSubtopicsBySubject, type DatabaseTopic, type DatabaseSubtopic } from "../subjects/subjectStructureService";
import { getConceptSuggestionsByNote } from "../concepts/conceptSuggestionsService";

/** Owned by one note view. Content/title updates do not invalidate classification. */
export function createNoteEditorData(noteId: string, subjectId: string) {
  function cached<T>(read: () => Promise<T>) {
    let pending: Promise<T> | undefined;
    return (refresh = false) => {
      if (refresh) pending = undefined;
      if (!pending) {
        const request = read().catch(error => { if (pending === request) pending = undefined; throw error; });
        pending = request;
      }
      return pending;
    };
  }
  const links = cached(() => getSubtopicIdsByNote(noteId));
  return {
    reading: cached(async () => {
      const ids = await links();
      if (!ids.length) return { topics: [] as DatabaseTopic[], subtopics: [] as DatabaseSubtopic[], ids };
      const { data: rows, error } = await supabase.from("subtopics").select("id, topic_id, name, sort_order").in("id", ids).order("sort_order").order("name");
      if (error) throw error;
      const subtopics: DatabaseSubtopic[] = (rows ?? []).map(row => ({ id: row.id, topicId: row.topic_id, name: row.name, sortOrder: row.sort_order }));
      const topicIds = [...new Set(subtopics.map(row => row.topicId))];
      if (!topicIds.length) return { topics: [] as DatabaseTopic[], subtopics, ids };
      const { data: topics, error: topicError } = await supabase.from("topics").select("id, subject_id, name, sort_order")
        .in("id", topicIds).eq("subject_id", subjectId).order("sort_order").order("name");
      if (topicError) throw topicError;
      return { topics: (topics ?? []).map(row => ({ id: row.id, subjectId: row.subject_id, name: row.name, sortOrder: row.sort_order })), subtopics, ids };
    }),
    editing: cached(async () => {
      const [topics, subtopics, ids] = await Promise.all([getTopicsBySubject(subjectId), getAllSubtopicsBySubject(subjectId), links()]);
      return { topics, subtopics, ids };
    }),
    suggestions: cached(() => getConceptSuggestionsByNote(noteId)),
  };
}
