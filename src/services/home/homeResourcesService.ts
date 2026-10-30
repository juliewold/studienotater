import { supabase } from "../../lib/supabase";
import { getVideosBySubject, type DatabaseVideo } from "../media/videosService";

export type HomeNoteMetadata = { id: string; subjectId: string; slug: string; createdAt: string };
export type HomePdfMetadata = { id: string; subjectId: string; createdAt: string };
export type HomeResources = {
  notes: HomeNoteMetadata[];
  pdfs: HomePdfMetadata[];
  videos: DatabaseVideo[];
  flashcardCounts: Record<string, number>;
  weekStart: string;
  progressError: boolean;
  weeklyError: boolean;
};
export type HomeResourcesSnapshot = HomeResources & { loading: boolean };

/** Preserve the existing local Monday-at-midnight boundary, including DST. */
export function getHomeWeekStart(now = new Date()): string {
  const monday = new Date(now);
  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

async function getHomeNotes(subjectId: string): Promise<HomeNoteMetadata[]> {
  const { data, error } = await supabase.from("notes")
    .select("id, slug, created_at").eq("subject_id", subjectId)
    .order("sort_order", { ascending: true }).order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, subjectId, slug: row.slug, createdAt: row.created_at }));
}

async function getHomePdfs(subjectId: string): Promise<HomePdfMetadata[]> {
  const { data, error } = await supabase.from("pdfs")
    .select("id, created_at").eq("subject_id", subjectId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, subjectId, createdAt: row.created_at }));
}

async function countWeeklyFlashcards(subjectId: string, weekStart: string): Promise<number> {
  const { count, error } = await supabase.from("flashcards")
    .select("id", { count: "exact", head: true })
    .eq("subject_id", subjectId).gte("created_at", weekStart);
  if (error) throw error;
  return count ?? 0;
}

async function result<T>(request: Promise<T>, fallback: T) {
  try { return { data: await request, error: false }; }
  catch { return { data: fallback, error: true }; }
}

export async function loadHomeResources(subjectIds: string[], weekStart: string): Promise<HomeResources> {
  const ids = [...new Set(subjectIds)];
  const [notes, pdfs, videos, counts] = await Promise.all([
    result(Promise.all(ids.map(getHomeNotes)), []),
    result(Promise.all(ids.map(getHomePdfs)), []),
    result(Promise.all(ids.map(getVideosBySubject)), []),
    result(Promise.all(ids.map(async id => [id, await countWeeklyFlashcards(id, weekStart)] as const)), []),
  ]);
  return {
    notes: notes.data.flat(), pdfs: pdfs.data.flat(), videos: videos.data.flat(),
    flashcardCounts: Object.fromEntries(counts.data), weekStart,
    progressError: notes.error || pdfs.error || videos.error,
    weeklyError: notes.error || pdfs.error || counts.error,
  };
}

/** One dashboard owns this store; subscribers and StrictMode reuse the same load. */
export function createHomeResourcesStore(subjectIds: string[], weekStart: string) {
  let snapshot: HomeResourcesSnapshot = {
    notes: [], pdfs: [], videos: [], flashcardCounts: {}, weekStart,
    loading: subjectIds.length > 0, progressError: false, weeklyError: false,
  };
  let pending: Promise<void> | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    ensureLoaded() {
      if (!pending) pending = loadHomeResources(subjectIds, weekStart).then(data => {
        snapshot = { ...data, loading: false };
        listeners.forEach(listener => listener());
      });
      return pending;
    },
  };
}

export function getWeeklyResourceCounts(resources: HomeResources, subjectId: string) {
  const start = new Date(resources.weekStart).getTime();
  return {
    notes: resources.notes.filter(note => note.subjectId === subjectId && new Date(note.createdAt).getTime() >= start).length,
    pdfs: resources.pdfs.filter(pdf => pdf.subjectId === subjectId && new Date(pdf.createdAt).getTime() >= start).length,
    flashcards: resources.flashcardCounts[subjectId] ?? 0,
  };
}
