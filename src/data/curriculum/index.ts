import { tdt4120Curriculum } from "./tdt4120";
import type { CurriculumConfig } from "./types";

// Subjects without a configuration use their Supabase topics as pensum units.
const configs: Record<string, CurriculumConfig> = {
  [tdt4120Curriculum.subjectId]: tdt4120Curriculum,
};

export const getCurriculumConfig = (subjectId: string): CurriculumConfig | undefined => configs[subjectId];
