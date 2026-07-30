import { supabase } from "../lib/supabase";

export type DatabasePdf = {
  id: string;
  subjectId: string;
  title: string;
  category: string;
  filePath: string;
  fileUrl: string;
  createdAt: string;

  subtopicId: string | null;
  subtopicName: string | null;
  topicId: string | null;
  topicName: string | null;
};

type TopicRelation = {
  id: string;
  name: string;
  subject_id: string;
};

type SubtopicRelation = {
  id: string;
  name: string;
  topic_id: string;
  topics: TopicRelation | TopicRelation[] | null;
};

type PdfRow = {
  id: string;
  subject_id: string;
  title: string;
  category: string;
  file_path: string;
  created_at: string;
  subtopic_id: string | null;
  subtopics: SubtopicRelation | SubtopicRelation[] | null;
};

const pdfSelect = `
  id,
  subject_id,
  title,
  category,
  file_path,
  created_at,
  subtopic_id,
  subtopics (
    id,
    name,
    topic_id,
    topics (
      id,
      name,
      subject_id
    )
  )
`;

const getFirstRelation = <T>(relation: T | T[] | null): T | null => {
  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
};

const mapPdf = (pdf: PdfRow): DatabasePdf => {
  const subtopic = getFirstRelation(pdf.subtopics);

  const topic = subtopic ? getFirstRelation(subtopic.topics) : null;

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
    createdAt: pdf.created_at,

    subtopicId: subtopic?.id ?? null,
    subtopicName: subtopic?.name ?? null,
    topicId: topic?.id ?? null,
    topicName: topic?.name ?? null,
  };
};

export async function getPdfsBySubject(
  subjectId: string,
): Promise<DatabasePdf[]> {
  const { data, error } = await supabase
    .from("pdfs")
    .select(pdfSelect)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PdfRow[]).map(mapPdf);
}

export async function getAllPdfs(): Promise<DatabasePdf[]> {
  const { data, error } = await supabase
    .from("pdfs")
    .select(pdfSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PdfRow[]).map(mapPdf);
}

export async function getPdfById(pdfId: string): Promise<DatabasePdf | null> {
  const { data, error } = await supabase
    .from("pdfs")
    .select(pdfSelect)
    .eq("id", pdfId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapPdf(data as PdfRow);
}

export async function updatePdfSubtopic(
  pdfId: string,
  subtopicId: string | null,
) {
  const { error } = await supabase
    .from("pdfs")
    .update({
      subtopic_id: subtopicId,
    })
    .eq("id", pdfId);

  if (error) {
    throw error;
  }
}

export async function deletePdf(pdfId: string, filePath: string) {
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
