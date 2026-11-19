import { getCurriculumConfig } from "../../data/curriculum";
import { getPdfsBySubject, type DatabasePdf } from "../media/pdfsService";
import { lectureSequence, numberedLectureSequence } from "./curriculumContent";
import { loadCurriculumWorkspace } from "./curriculumWorkspaceService";

/** A forelesningsnotat with its lecture number and, when known, its topic. */
export type LectureItem = { pdf: DatabasePdf; number: string; title?: string };

/**
 * Lecture PDFs of a subject in lecture order. Subjects with pensum units use the unit's
 * number and topic; every other subject uses the number in the PDF title, and the topic
 * when the title names one after the number.
 */
export async function loadLectureSequence(subjectId: string): Promise<LectureItem[]> {
  if (getCurriculumConfig(subjectId)) {
    const workspace = await loadCurriculumWorkspace(subjectId);
    return lectureSequence(workspace.units, workspace.pdfs).map(({ pdf, unit }) => ({
      pdf,
      number: unit.number ?? "",
      title: unit.title,
    }));
  }

  return numberedLectureSequence(await getPdfsBySubject(subjectId));
}
