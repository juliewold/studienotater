import { supabase } from "../lib/supabase";

export type UpcomingExam = {
  id: string;
  subjectId: string;
  examDate: string;
  startTime: string | null;
  location: string | null;
  note: string | null;
};

export async function getUpcomingExams(): Promise<UpcomingExam[]> {
  const { data, error } = await supabase
    .from("upcoming_exams")
    .select("*")
    .order("exam_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((exam) => ({
    id: exam.id,
    subjectId: exam.subject_id,
    examDate: exam.exam_date,
    startTime: exam.start_time,
    location: exam.location,
    note: exam.note,
  }));
}

export async function createUpcomingExam(
  subjectId: string,
  examDate: string,
  startTime: string | null,
  location: string | null,
  note: string | null,
) {
  const { error } = await supabase.from("upcoming_exams").insert({
    subject_id: subjectId,
    exam_date: examDate,
    start_time: startTime,
    location,
    note,
  });

  if (error) {
    throw error;
  }
}

export async function updateUpcomingExam(
  id: string,
  examDate: string,
  startTime: string | null,
  location: string | null,
  note: string | null,
) {
  const { error } = await supabase
    .from("upcoming_exams")
    .update({
      exam_date: examDate,
      start_time: startTime,
      location,
      note,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deleteUpcomingExam(id: string) {
  const { error } = await supabase
    .from("upcoming_exams")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}