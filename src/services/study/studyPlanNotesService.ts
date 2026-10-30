import { getNoteMetadataBySubject, type NoteMetadata } from "../notes/notesService";

/** Share only overlapping reads; later visits must see fresh titles and resources. */
export function createStudyPlanNoteMetadataLoader(scope: string) {
  const pending = new Map<string, Promise<NoteMetadata[]>>();
  return (subjectId: string): Promise<NoteMetadata[]> => {
    if (!subjectId) return Promise.resolve([]);
    const key = JSON.stringify([scope, subjectId]);
    const existing = pending.get(key);
    if (existing) return existing;
    const request = getNoteMetadataBySubject(subjectId).finally(() => { pending.delete(key); });
    pending.set(key, request);
    return request;
  };
}
