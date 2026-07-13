import { supabase } from "../lib/supabase";

export type SemesterSubject = {
  id: string;
  subjectId: string;
  customCode: string | null;
  customName: string | null;
};

export async function getSemesterSubjects(userId: string) {
  const { data, error } = await supabase
    .from("semester_subjects")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    subjectId: item.subject_id,
    customCode: item.custom_code,
    customName: item.custom_name,
  }));
}

export async function addSemesterSubject(
  userId: string,
  subjectId: string,
  customCode?: string,
  customName?: string,
) {
  const { error } = await supabase
    .from("semester_subjects")
    .insert({
      user_id: userId,
      subject_id: subjectId,
      custom_code: customCode ?? null,
      custom_name: customName ?? null,
    });

  if (error) {
    throw error;
  }
}

export async function removeSemesterSubject(
  userId: string,
  subjectId: string,
) {
  const { error } = await supabase
    .from("semester_subjects")
    .delete()
    .eq("user_id", userId)
    .eq("subject_id", subjectId);

  if (error) {
    throw error;
  }
}