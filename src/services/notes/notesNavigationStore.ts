import type { DatabaseNote, NoteMetadata } from "./notesService";
import type { NoteFolder } from "./noteFoldersService";
import type { NotesChange } from "./notesNavigationEvents";
import { orderNotesForNavigation } from "./noteOrder";

export type NotesNavigationData = { folders: NoteFolder[]; notes: NoteMetadata[] };
export type NotesNavigationSnapshot = NotesNavigationData & { loading: boolean; error: string };
export type NotesNavigationContext = NotesNavigationSnapshot & {
  loadNote: (slug: string) => Promise<DatabaseNote | null>;
};

/** Deduplicate overlapping reads only; revisiting a note still reads fresh content. */
export function createPendingNoteLoader(load: (slug: string) => Promise<DatabaseNote | null>) {
  const pending = new Map<string, Promise<DatabaseNote | null>>();
  return (slug: string) => {
    const existing = pending.get(slug);
    if (existing) return existing;
    const request = load(slug).finally(() => { pending.delete(slug); });
    pending.set(slug, request);
    return request;
  };
}

/** Owned by one mounted subject/user layout; never shared between accounts. */
export function createNotesNavigationStore(subjectId: string, load: () => Promise<NotesNavigationData>) {
  let snapshot: NotesNavigationSnapshot = { folders: [], notes: [], loading: true, error: "" };
  let loaded = false;
  let pending: Promise<void> | undefined;
  let revision = 0;
  const patches = new Map<string, NoteMetadata>();
  const listeners = new Set<() => void>();
  const publish = (next: NotesNavigationSnapshot) => {
    snapshot = next;
    listeners.forEach(listener => listener());
  };
  const start = (): Promise<void> => {
    if (pending) return pending;
    pending = (async () => {
      // Changes during a request require one subsequent load, never a parallel one.
      for (;;) {
        const current = revision;
        try {
          const data = await load();
          if (current !== revision) continue;
          const notes = data.notes.map(note => patches.get(note.id) ?? note);
          patches.clear();
          loaded = true;
          publish({ folders: data.folders, notes: orderNotesForNavigation(notes, data.folders), loading: false, error: "" });
        } catch {
          if (current !== revision) continue;
          publish({ ...snapshot, loading: false, error: "Kunne ikke hente notatoversikten." });
        }
        return;
      }
    })().finally(() => { pending = undefined; });
    return pending;
  };
  const refresh = () => {
    revision++;
    return start();
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    ensureLoaded: () => pending ?? (loaded ? Promise.resolve() : start()),
    refresh,
    applyChange(change?: NotesChange) {
      if (change?.navigation === false) return;
      if (!change?.note) { void refresh(); return; }
      const note = change.note;
      if (note.subjectId !== subjectId) return;
      if (pending) patches.set(note.id, note);
      const existing = snapshot.notes.find(item => item.id === note.id);
      if (!existing) return;
      const keys = Object.keys({ ...existing, ...note }) as (keyof NoteMetadata)[];
      if (keys.every(key => existing[key] === note[key])) return;
      const notes = snapshot.notes.map(item => item.id === note.id ? note : item);
      publish({ ...snapshot, notes: orderNotesForNavigation(notes, snapshot.folders) });
    },
  };
}
