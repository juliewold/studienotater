import { supabase } from "../lib/supabase";

export type DatabaseExam = {
  id: string;
  subjectId: string;
  title: string;
  semester: string;
  year: number;
  relevantTasks: string[];
  examFilePath: string | null;
  solutionFilePath: string | null;
  mySolutionFilePath: string | null;
  createdAt: string;
};

function mapDatabaseExam(exam: {
  id: string;
  subject_id: string;
  title: string;
  semester: string;
  year: number;
  relevant_tasks: string[] | null;
  exam_file_path: string | null;
  solution_file_path: string | null;
  my_solution_file_path: string | null;
  created_at: string;
}): DatabaseExam {
  return {
    id: exam.id,
    subjectId: exam.subject_id,
    title: exam.title,
    semester: exam.semester,
    year: exam.year,
    relevantTasks: exam.relevant_tasks ?? [],
    examFilePath: exam.exam_file_path,
    solutionFilePath: exam.solution_file_path,
    mySolutionFilePath: exam.my_solution_file_path,
    createdAt: exam.created_at,
  };
}

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

  return (data ?? []).map(mapDatabaseExam);
}

export async function getAllExams(): Promise<DatabaseExam[]> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapDatabaseExam);
}

export async function createExam(
  subjectId: string,
  title: string,
  semester: string,
  year: number,
  relevantTasks: string[],
  examFilePath: string | null,
  solutionFilePath: string | null,
  mySolutionFilePath: string | null,
): Promise<void> {
  const { error } = await supabase.from("exams").insert({
    subject_id: subjectId,
    title,
    semester,
    year,
    relevant_tasks: relevantTasks,
    exam_file_path: examFilePath,
    solution_file_path: solutionFilePath,
    my_solution_file_path: mySolutionFilePath,
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
  relevantTasks: string[],
  examFilePath: string | null,
  solutionFilePath: string | null,
  mySolutionFilePath: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("exams")
    .update({
      title,
      semester,
      year,
      relevant_tasks: relevantTasks,
      exam_file_path: examFilePath,
      solution_file_path: solutionFilePath,
      my_solution_file_path: mySolutionFilePath,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase.from("exams").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
