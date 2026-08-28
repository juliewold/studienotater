import { getAllNotes, type DatabaseNote } from "./../notes/notesService";
import { getAllFlashcards, type DatabaseFlashcard } from "./../study/flashcardsService";
import { getAllVideos, type DatabaseVideo } from "./../media/videosService";
import { getAllPdfs, type DatabasePdf } from "./../media/pdfsService";

export type GlobalSearchResultType = "note" | "flashcard" | "video" | "pdf";

export type GlobalSearchResult = {
  id: string;
  type: GlobalSearchResultType;
  title: string;
  description: string;
  snippet: string;
  path: string;
  subjectId: string;
  searchableText: string;
};

const removeHtml = (value: string): string => {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeText = (value: string): string => {
  return removeHtml(value)
    .toLocaleLowerCase("nb")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const createSnippet = (text: string, query: string): string => {
  if (!text) {
    return "";
  }

  const cleanText = removeHtml(text);

  const normalizedText = normalizeText(cleanText);
  const normalizedQuery = normalizeText(query);

  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) {
    return cleanText.slice(0, 120);
  }

  const start = Math.max(0, index - 45);
  const end = Math.min(cleanText.length, index + query.length + 45);

  let snippet = cleanText.slice(start, end);

  if (start > 0) {
    snippet = "…" + snippet;
  }

  if (end < cleanText.length) {
    snippet += "…";
  }

  return snippet;
};

const joinSearchableText = (
  values: Array<string | null | undefined>,
): string => {
  return values.filter(Boolean).join(" ");
};

const mapNoteToSearchResult = (note: DatabaseNote): GlobalSearchResult => {
  return {
    id: note.id,
    type: "note",
    title: note.title,
    description:
      note.description || note.subtopicName || note.topicName || "Notat",
    snippet: "",
    path: `/fag/${note.subjectId}/notater/${note.slug}`,
    subjectId: note.subjectId,
    searchableText: joinSearchableText([
      note.title,
      note.description,
      note.content,
      note.topicName,
      note.subtopicName,
    ]),
  };
};

const mapFlashcardToSearchResult = (
  flashcard: DatabaseFlashcard,
): GlobalSearchResult => {
  return {
    id: flashcard.id,
    type: "flashcard",
    title: flashcard.question,
    description: flashcard.subtopicName || flashcard.topicName || "Flashcard",
    snippet: "",
    path: `/fag/${flashcard.subjectId}/flashcards`,
    subjectId: flashcard.subjectId,
    searchableText: joinSearchableText([
      flashcard.question,
      flashcard.answer,
      flashcard.topicName,
      flashcard.subtopicName,
    ]),
  };
};

const mapVideoToSearchResult = (video: DatabaseVideo): GlobalSearchResult => {
  return {
    id: video.id,
    type: "video",
    title: video.title,
    description: video.subtopic || video.topic || "Video",
    snippet: "",
    path: `/fag/${video.subjectId}/videoer`,
    subjectId: video.subjectId,
    searchableText: joinSearchableText([
      video.title,
      video.topic,
      video.subtopic,
    ]),
  };
};

const mapPdfToSearchResult = (pdf: DatabasePdf): GlobalSearchResult => {
  return {
    id: pdf.id,
    type: "pdf",
    title: pdf.title,
    description:
      pdf.subtopicName || pdf.topicName || pdf.category || "Forelesningsnotat",
    snippet: "",
    path: `/fag/${pdf.subjectId}/pdfs/${pdf.id}`,
    subjectId: pdf.subjectId,
    searchableText: joinSearchableText([
      pdf.title,
      pdf.category,
      pdf.topicName,
      pdf.subtopicName,
    ]),
  };
};

export async function getGlobalSearchItems(): Promise<GlobalSearchResult[]> {
  const [notes, flashcards, videos, pdfs] = await Promise.all([
    getAllNotes(),
    getAllFlashcards(),
    getAllVideos(),
    getAllPdfs(),
  ]);

  return [
    ...notes.map(mapNoteToSearchResult),
    ...flashcards.map(mapFlashcardToSearchResult),
    ...videos.map(mapVideoToSearchResult),
    ...pdfs.map(mapPdfToSearchResult),
  ];
}

const getResultScore = (
  result: GlobalSearchResult,
  normalizedQuery: string,
): number => {
  const normalizedTitle = normalizeText(result.title);
  const normalizedDescription = normalizeText(result.description);
  const normalizedSearchableText = normalizeText(result.searchableText);

  if (normalizedTitle === normalizedQuery) {
    return 100;
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedTitle.includes(normalizedQuery)) {
    return 60;
  }

  if (normalizedDescription.includes(normalizedQuery)) {
    return 40;
  }

  if (normalizedSearchableText.includes(normalizedQuery)) {
    return 20;
  }

  return 0;
};

export function searchGlobalItems(
  items: GlobalSearchResult[],
  query: string,
): GlobalSearchResult[] {
  const normalizedQuery = normalizeText(query);

  if (normalizedQuery.length < 2) {
    return [];
  }

  return items
    .map((result) => ({
      result,
      score: getResultScore(result, normalizedQuery),
    }))
    .filter(({ score }) => score > 0)
    .sort((firstResult, secondResult) => {
      if (firstResult.score !== secondResult.score) {
        return secondResult.score - firstResult.score;
      }

      return firstResult.result.title.localeCompare(
        secondResult.result.title,
        "nb",
      );
    })
    .slice(0, 12)
    .map(({ result }) => ({
      ...result,
      snippet: createSnippet(result.searchableText, query),
    }));
}
