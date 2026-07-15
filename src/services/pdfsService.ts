import { supabase } from "../lib/supabase";

export type DatabasePdf = {
  id: string;
  subjectId: string;
  title: string;
  category: string;
  filePath: string;
  fileUrl: string;
};

export async function getPdfsBySubject(
  subjectId: string,
): Promise<DatabasePdf[]> {
  const { data, error } = await supabase
    .from("pdfs")
    .select("id, subject_id, title, category, file_path")
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((pdf) => {
    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(pdf.file_path);

    return {
      id: pdf.id,
      subjectId: pdf.subject_id,
      title: pdf.title,
      category: pdf.category,
      filePath: pdf.file_path,
      fileUrl: publicUrlData.publicUrl,
    };
  });
}

export async function getPdfById(
  pdfId: string,
): Promise<DatabasePdf | null> {
  const { data, error } = await supabase
    .from("pdfs")
    .select("id, subject_id, title, category, file_path")
    .eq("id", pdfId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("pdfs")
    .getPublicUrl(data.file_path);

  return {
    id: data.id,
    subjectId: data.subject_id,
    title: data.title,
    category: data.category,
    filePath: data.file_path,
    fileUrl: publicUrlData.publicUrl,
  };
}

export async function deletePdf(
  pdfId: string,
  filePath: string,
) {
  const { error: storageError } = await supabase.storage
    .from("pdfs")
    .remove([filePath]);

  if (storageError) {
    throw storageError;
  }

  const { error: databaseError } = await supabase
    .from("pdfs")
    .delete()
    .eq("id", pdfId);

  if (databaseError) {
    throw databaseError;
  }
}