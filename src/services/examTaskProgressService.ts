import { supabase } from "../lib/supabase";

export type ExamTaskProgress = {
  taskLabel: string;
  completed: boolean;
};

type ExamTaskProgressRow = {
  task_label: string;
  completed: boolean;
};

async function getAuthenticatedUserId(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error(
      "Du må være logget inn for å lagre eksamensfremdrift.",
    );
  }

  return user.id;
}

export async function getExamTaskProgress(
  examId: string,
): Promise<ExamTaskProgress[]> {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("exam_task_progress")
    .select("task_label, completed")
    .eq("user_id", userId)
    .eq("exam_id", examId);

  if (error) {
    throw error;
  }

  return ((data ?? []) as ExamTaskProgressRow[]).map(
    (progress) => ({
      taskLabel: progress.task_label,
      completed: progress.completed,
    }),
  );
}

export async function setExamTaskCompleted(
  examId: string,
  taskLabel: string,
  completed: boolean,
): Promise<void> {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("exam_task_progress")
    .upsert(
      {
        user_id: userId,
        exam_id: examId,
        task_label: taskLabel,
        completed,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,exam_id,task_label",
      },
    );

  if (error) {
    throw error;
  }
}

export async function removeExamTaskProgress(
  examId: string,
  taskLabel: string,
): Promise<void> {
  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("exam_task_progress")
    .delete()
    .eq("user_id", userId)
    .eq("exam_id", examId)
    .eq("task_label", taskLabel);

  if (error) {
    throw error;
  }
}