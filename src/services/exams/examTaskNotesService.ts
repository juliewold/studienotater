import { supabase } from "../../lib/supabase";
import { createNote, deleteNote, type DatabaseNote } from "../notes/notesService";

// Stabil kobling mellom eksamen + deloppgave og skrevet løsning (notes.id).
// Tabellen eier bare koblingen. Notatene, innholdet og mappene endres ikke her.
export type ExamTaskNoteLink = {
  examId: string;
  taskLabel: string;
  noteId: string;
};

type ExamTaskNoteRow = {
  exam_id: string;
  task_label: string;
  note_id: string;
};

// Alle koblinger er små, og RLS gir innloggede brukere lesetilgang. Filtrering skjer hos kallere.
export async function getExamTaskNoteLinks(): Promise<ExamTaskNoteLink[]> {
  const { data, error } = await supabase
    .from("exam_task_notes")
    .select("exam_id, task_label, note_id");

  if (error) {
    throw error;
  }

  return ((data ?? []) as ExamTaskNoteRow[]).map((row) => ({
    examId: row.exam_id,
    taskLabel: row.task_label,
    noteId: row.note_id,
  }));
}

function mapLinkError(error: { code?: string; message: string }): Error {
  if (error.code === "23505") {
    return new Error("Notatet er allerede koblet til en annen deloppgave.");
  }

  if (error.code === "23514") {
    return new Error("Notatet tilhører et annet fag enn eksamenen.");
  }

  return new Error("Kunne ikke lagre koblingen.");
}

// Lagrer koblingen. Oppgaven kan få et annet notat, og det gamle beholdes i Notater.
export async function linkExamTaskNote(
  examId: string,
  taskLabel: string,
  noteId: string,
): Promise<void> {
  const { error } = await supabase.from("exam_task_notes").upsert(
    {
      exam_id: examId,
      task_label: taskLabel,
      note_id: noteId,
    },
    { onConflict: "exam_id,task_label" },
  );

  if (error) {
    throw mapLinkError(error);
  }
}

// Fjerner bare koblingen. Notatet slettes ikke.
export async function unlinkExamTaskNote(
  examId: string,
  taskLabel: string,
): Promise<void> {
  const { error } = await supabase
    .from("exam_task_notes")
    .delete()
    .eq("exam_id", examId)
    .eq("task_label", taskLabel);

  if (error) {
    throw error;
  }
}

function createNoteSlug(examTitle: string, taskLabel: string): string {
  const base = `${examTitle} oppgave ${taskLabel}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Tilfeldig suffiks gjør at adressen ikke kolliderer med et eksisterende notat.
  const suffix = Math.random().toString(36).slice(2, 8);

  return `${base || "eksamen"}-${suffix}`;
}

// Oppretter et tomt notat og kobler det til oppgaven. Hvis koblingen feiler, slettes det nye tomme
// notatet igjen, så det ikke blir liggende et løsrevet notat.
export async function createLinkedExamTaskNote(input: {
  examId: string;
  subjectId: string;
  examTitle: string;
  taskLabel: string;
}): Promise<DatabaseNote> {
  const title = `${input.examTitle} – oppgave ${input.taskLabel}`;

  const note = await createNote({
    subjectId: input.subjectId,
    folderId: null,
    slug: createNoteSlug(input.examTitle, input.taskLabel),
    title,
    description: "",
    content: "",
    contentJson: null,
  });

  try {
    await linkExamTaskNote(input.examId, input.taskLabel, note.id);
  } catch (error) {
    await deleteNote(note.id).catch((cleanupError) => {
      console.error("Kunne ikke fjerne tomt notat etter mislykket kobling:", cleanupError);
    });

    throw error;
  }

  return note;
}
