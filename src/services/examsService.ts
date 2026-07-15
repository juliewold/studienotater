import { supabase } from "../lib/supabase";

export type DatabaseExam = {
  id: string;
  subjectId: string;
  title: string;
  semester: string;
  year: number;
  examFilePath: string | null;
  solutionFilePath: string | null;
};

export async function getExamsBySubject(
  subjectId: string,
): Promise<DatabaseExam[]> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("subject_id", subjectId)
    .order("year", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((exam) => ({
    id: exam.id,
    subjectId: exam.subject_id,
    title: exam.title,
    semester: exam.semester,
    year: exam.year,
    examFilePath: exam.exam_file_path,
    solutionFilePath: exam.solution_file_path,
  }));
}

export async function createExam(
  subjectId: string,
  title: string,
  semester: string,
  year: number,
  examFilePath: string | null,
  solutionFilePath: string | null,
) {
  const { error } = await supabase.from("exams").insert({
    subject_id: subjectId,
    title,
    semester,
    year,
    exam_file_path: examFilePath,
    solution_file_path: solutionFilePath,
  });

  if (error) {
    throw error;
  }
}

export async function updateExam(
  id: string,
  title: string,
  semester: string,
  year: number,
  examFilePath: string | null,
  solutionFilePath: string | null,
) {
  const { error } = await supabase
    .from("exams")
    .update({
      title,
      semester,
      year,
      exam_file_path: examFilePath,
      solution_file_path: solutionFilePath,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteExam(id: string) {
  const { error } = await supabase
    .from("exams")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}