import { supabase } from "../../lib/supabase";

export type StudyBucket = "pdfs" | "note-images";
export const STORAGE_URL_LIFETIME = 300;
export type StorageUrlState = { url: string | null; loading: boolean; error: string | null };

function validPath(path: string): boolean {
  return !!path && !path.startsWith("/") && !path.includes("\\")
    && !Array.from(path).some(character => character.charCodeAt(0) < 32)
    && path.split("/").every(part => part !== "" && part !== "." && part !== "..");
}

/** Permanent document reference, never an access credential. */
export function noteImageReference(path: string): string {
  if (!validPath(path)) throw new Error("Ugyldig bildebane.");
  return `supabase-storage://note-images/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** Only this project's Storage URLs are recognized; never sign arbitrary URLs. */
export function getNoteImagePath(reference: string): string | null {
  try {
    const url = new URL(reference);
    let encoded: string;
    if (url.protocol === "supabase-storage:" && url.hostname === "note-images") {
      if (url.search || url.hash) return null;
      encoded = url.pathname.slice(1);
    } else {
      const project = new URL(import.meta.env.VITE_SUPABASE_URL);
      if (url.origin !== project.origin || url.username || url.password) return null;
      const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|sign|authenticated)\/note-images\/(.+)$/);
      if (!match) return null;
      encoded = match[1];
    }
    const path = decodeURIComponent(encoded);
    return validPath(path) ? path : null;
  } catch { return null; }
}

export async function createPrivateStorageUrl(bucket: StudyBucket, path: string): Promise<string> {
  if (!validPath(path)) throw new Error("Ugyldig filbane.");
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session || sessionData.session.user.is_anonymous) {
    throw new Error("Logg inn for å åpne filen.");
  }
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, STORAGE_URL_LIFETIME);
  if (error || !data?.signedUrl) throw new Error("Kunne ikke åpne filen. Kontroller at du har tilgang.");
  return data.signedUrl;
}

/** No cross-user URL cache. Invalidate in-flight requests on auth changes/disposal. */
export function watchPrivateStorageUrl(bucket: StudyBucket, path: string, receive: (state: StorageUrlState) => void): () => void {
  let disposed = false;
  let generation = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const renew = async () => {
    if (disposed) return;
    const current = ++generation;
    clearTimeout(timer);
    try {
      const url = await createPrivateStorageUrl(bucket, path);
      if (disposed || current !== generation) return;
      receive({ url, loading: false, error: null });
      timer = setTimeout(renew, (STORAGE_URL_LIFETIME - 60) * 1000);
    } catch (error) {
      if (disposed || current !== generation) return;
      receive({ url: null, loading: false, error: error instanceof Error ? error.message : "Kunne ikke åpne filen." });
      timer = setTimeout(renew, 30000);
    }
  };
  receive({ url: null, loading: true, error: null });
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
    if (disposed || event === "INITIAL_SESSION") return;
    ++generation;
    clearTimeout(timer);
    receive({ url: null, loading: true, error: null });
    // Supabase auth callbacks must not await another auth method under its lock.
    timer = setTimeout(renew, 0);
  });
  void renew();
  return () => { disposed = true; ++generation; clearTimeout(timer); subscription.unsubscribe(); };
}

export function bindPrivateNoteImage(image: HTMLImageElement, reference: string): () => void {
  const path = getNoteImagePath(reference);
  image.removeAttribute("src");
  if (!path) return () => {};
  return watchPrivateStorageUrl("note-images", path, ({ url, error }) => {
    if (url) image.src = url;
    else image.removeAttribute("src");
    if (error) image.setAttribute("aria-label", error);
    else image.removeAttribute("aria-label");
  });
}
