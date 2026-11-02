export type CurriculumLink = { label: string; url: string };

/** One pensum unit (typically a lecture). Content comes from the existing
 * Supabase topics, subtopics, notes and concepts mapped to it, never from here. */
export type CurriculumUnitConfig = {
  id: string;
  number?: string;
  title: string;
  part?: string;
  /** Textbook/pensum references, copied as references only. */
  readings?: string[];
  /** Marked as supporting literature in the official pensum. */
  supporting?: boolean;
  topicIds: string[];
  /** External material, e.g. the course's Google Drive folders. */
  lectureSlides?: CurriculumLink;
  exercises?: CurriculumLink[];
  /** Number used to recognise "Forelesning N" / "Øving N" titles in Studienotater. */
  resourceNumber?: string;
};

export type CurriculumConfig = {
  subjectId: string;
  source: CurriculumLink;
  units: CurriculumUnitConfig[];
  /** Subtopics whose topic spans several units. */
  subtopicUnits?: Record<string, string>;
};
