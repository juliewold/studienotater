import { getCurriculumConfig } from "../../data/curriculum";
import { getLectureTitles } from "../../data/curriculum/lectureTitles";
import { getPdfsBySubject, type DatabasePdf } from "../media/pdfsService";
import { lectureSequence, titledLectureSequence } from "./curriculumContent";
import { loadCurriculumWorkspace } from "./curriculumWorkspaceService";

/** A forelesningsnotat with the number and topic of its lecture. */
export type LectureItem = { pdf: DatabasePdf; number: string; title: string };

/** Lecture PDFs of a subject in lecture order: from pensum units when the subject has them, else from numbered lecture titles. */
export async function loadLectureSequence(subjectId: string): Promise<LectureItem[]> {
  const titles = getLectureTitles(subjectId);
  if (titles) return titledLectureSequence(await getPdfsBySubject(subjectId), titles);
  if (!getCurriculumConfig(subjectId)) return [];

  const workspace = await loadCurriculumWorkspace(subjectId);
  return lectureSequence(workspace.units, workspace.pdfs).map(({ pdf, unit }) => ({
    pdf,
    number: unit.number ?? "",
    title: unit.title,
  }));
}
