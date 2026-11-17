import { supabase } from "../../lib/supabase";

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

// Egen funksjon for iPad-PDF-en, så den kan oppdateres uten å sende de andre filene på nytt.
export async function setExamMySolutionFilePath(
  id: string,
  mySolutionFilePath: string,
): Promise<void> {
  const { error } = await supabase
    .from("exams")
    .update({ my_solution_file_path: mySolutionFilePath })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

// Laster opp en ny iPad-PDF til samme bucket og mappe som eksamensfilene. Eksisterende filer slettes ikke.
export async function uploadExamMySolutionPdf(
  exam: { subjectId: string; year: number; semester: string },
  file: File,
): Promise<string> {
  const safeSemester = exam.semester
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  const safeFileName = file.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  const filePath =
    `${exam.subjectId}/eksamener/${exam.year}-${safeSemester}` +
    `/min-besvarelse-${Date.now()}-${safeFileName}`;

  const { error } = await supabase.storage.from("pdfs").upload(filePath, file, {
    contentType: "application/pdf",
  });

  if (error) {
    throw error;
  }

  return filePath;
}

// Laster opp ny iPad-PDF og lagrer stien på eksamen. Hvis lagringen feiler, fjernes bare den
// nyopplastede filen. Den gamle PDF-en røres ikke, slik at ingen løsning går tapt.
export async function replaceExamMySolutionPdf(
  exam: { id: string; subjectId: string; year: number; semester: string },
  file: File,
): Promise<string> {
  const filePath = await uploadExamMySolutionPdf(exam, file);

  try {
    await setExamMySolutionFilePath(exam.id, filePath);
  } catch (error) {
    await supabase.storage.from("pdfs").remove([filePath]);
    throw error;
  }

  return filePath;
}

export type RemoveExamPdfResult = {
  // Filen er slettet fra lagringen. False betyr at den er beholdt, og warning forklarer hvorfor.
  storageRemoved: boolean;
  warning: string | null;
};

// Filstier som er trygge å bruke i en PostgREST-filter-streng. Andre stier beholdes uten sletting.
const SAFE_STORAGE_PATH = /^[a-z0-9._/-]+$/;

// Fjerner iPad-PDF-en fra eksamenen. Bare my_solution_file_path endres. Oppgavesettet, løsningsforslaget,
// notatene og fremdriften berøres ikke. Lagringsfilen slettes bare hvis ingen andre rader bruker stien.
export async function removeExamMySolutionPdf(exam: {
  id: string;
  mySolutionFilePath: string;
}): Promise<RemoveExamPdfResult> {
  const path = exam.mySolutionFilePath;

  // Oppdateringen gjelder bare hvis stien fortsatt er den samme. Da slettes ikke en nyere opplasting ved et uhell.
  const { data, error } = await supabase
    .from("exams")
    .update({ my_solution_file_path: null })
    .eq("id", exam.id)
    .eq("my_solution_file_path", path)
    .select("id");

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Kunne ikke slette PDF-en. Kontroller at du er admin, og last siden på nytt.");
  }

  if (!SAFE_STORAGE_PATH.test(path)) {
    return {
      storageRemoved: false,
      warning: "PDF-en er fjernet fra eksamenen. Filen er beholdt i lagringen fordi stien ikke kunne kontrolleres.",
    };
  }

  const [examRefs, pdfRefs] = await Promise.all([
    supabase
      .from("exams")
      .select("id")
      .or(`exam_file_path.eq.${path},solution_file_path.eq.${path},my_solution_file_path.eq.${path}`),
    supabase.from("pdfs").select("id").eq("file_path", path),
  ]);

  if (examRefs.error || pdfRefs.error) {
    return {
      storageRemoved: false,
      warning: "PDF-en er fjernet fra eksamenen. Filen er beholdt fordi bruken ikke kunne kontrolleres.",
    };
  }

  if ((examRefs.data?.length ?? 0) > 0 || (pdfRefs.data?.length ?? 0) > 0) {
    return {
      storageRemoved: false,
      warning: "PDF-en er fjernet fra eksamenen. Filen er beholdt fordi den brukes andre steder.",
    };
  }

  const { error: removeError } = await supabase.storage.from("pdfs").remove([path]);

  if (removeError) {
    return {
      storageRemoved: false,
      warning: "PDF-en er fjernet fra eksamenen, men filen i lagringen kunne ikke slettes.",
    };
  }

  return { storageRemoved: true, warning: null };
}
