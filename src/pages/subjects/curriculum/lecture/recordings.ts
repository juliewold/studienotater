import { narrationKey } from "./speechText";

// Pre-generated lecture audio. A manifest per lecture maps the key of each narration text to
// an audio file. Because the key is a hash of the exact text, a part whose text changes simply
// has no file until the audio is regenerated, and the browser voice reads it meanwhile.
// Manifests are bundled (no request when a lecture has none); the audio files are static and
// never come from Supabase. Generate with `node scripts/lecture-audio.mjs`.

export type LectureRecording = {
  provider: string;
  /** Provider voice id, for example nb-NO-PernilleNeural. */
  voice: string;
  /** Name shown in the voice picker. */
  label: string;
  generated: string;
  files: Record<string, string>;
};

const manifests = import.meta.glob<{ default: LectureRecording }>("../../../../data/curriculum/lectureAudio/*/*.json");
const path = (subjectId: string, unitId: string) => `../../../../data/curriculum/lectureAudio/${subjectId}/${unitId}.json`;

export const hasRecording = (subjectId: string, unitId: string) => path(subjectId, unitId) in manifests;

export async function loadRecording(subjectId: string, unitId: string): Promise<LectureRecording | undefined> {
  const load = manifests[path(subjectId, unitId)];
  return load ? (await load()).default : undefined;
}

const audioBase = ((import.meta.env.VITE_LECTURE_AUDIO_URL as string | undefined) ?? `${import.meta.env.BASE_URL}lecture-audio`).replace(/\/$/, "");

/** URL of the recorded audio for exactly this narration text, if it has been generated. */
export function recordingUrl(recording: LectureRecording | undefined, subjectId: string, unitId: string, text: string) {
  const file = recording?.files[narrationKey(text)];
  return file ? `${audioBase}/${subjectId}/${unitId}/${file}` : undefined;
}
