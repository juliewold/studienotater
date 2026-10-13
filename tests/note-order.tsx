import { createRoot } from "react-dom/client";
import type { User } from "@supabase/supabase-js";
import App from "../src/App";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";

// Local fixtures only: requests, including saves, never reach a backend.
const originalFolders = [
  { id: "week-1", subject_id: "tma4240", name: "Uke 1 – Sannsynlighet", topic_id: null, topics: null, created_at: "2026-01-01" },
  { id: "week-2", subject_id: "tma4240", name: "Uke 2 – Fordelinger", topic_id: null, topics: null, created_at: "2026-01-02" },
  { id: "empty", subject_id: "tma4240", name: "Repetisjon", topic_id: null, topics: null, created_at: "2026-01-03" },
];
const savedOrder: string[] = JSON.parse(sessionStorage.getItem("folder-order-fixture") ?? "[]");
const folders = originalFolders.map((folder, index) => ({ ...folder, color_index: index, sort_order: savedOrder.includes(folder.id) ? savedOrder.indexOf(folder.id) : null }));
const savedNotes: Record<string, number> = JSON.parse(sessionStorage.getItem("note-order-fixture") ?? "{}");
const notes = [
  { id: "one", slug: "sannsynlighet", title: "Sannsynlighet", folder_id: "week-1" },
  { id: "two", slug: "betinget", title: "Betinget sannsynlighet", folder_id: "week-1" },
  { id: "three", slug: "fordelinger", title: "Fordelinger", folder_id: "week-2" },
  { id: "five", slug: "formler", title: "Formler", folder_id: null },
  { id: "four", slug: "huskeliste", title: "Huskeliste", folder_id: null },
].map((note, index) => ({ ...note, sort_order: savedNotes[note.id] ?? index, subject_id: "tma4240", subtopic_id: null, subtopics: null, description: "Notat for navigasjonstesten.", content: "<h2>Definisjon</h2><p>Et eksempel på notatinnhold.</p><h2>Eksempel</h2><p>Bruk sidebaren til å bytte notat.</p>", content_json: null, created_at: "2026-01-01" }));
window.fetch = async (input, init) => {
  const url = new URL(String(input));
  const table = url.pathname.split("/").pop();
  if (table === "reorder_notes") {
    if (!isAdmin || new URLSearchParams(location.search).has("fail")) return Response.json({message:"Denied"},{status:403});
    const body = JSON.parse(String(init?.body));
    const group = notes.filter(note => note.folder_id === body.p_folder_id);
    if (body.p_subject_id !== "tma4240" || group.length !== body.p_note_ids.length || group.some(note => !body.p_note_ids.includes(note.id))) throw Error("Wrong reorder scope");
    group.forEach(note => { note.sort_order = body.p_note_ids.indexOf(note.id); savedNotes[note.id] = note.sort_order; });
    sessionStorage.setItem("note-order-fixture", JSON.stringify(savedNotes));
    return new Response(null, {status:204});
  }
  if (table === "reorder_note_folders") {
    const body = JSON.parse(String(init?.body));
    if (body.p_subject_id !== "tma4240") throw Error("Wrong subject");
    folders.forEach(folder => { folder.sort_order = body.p_folder_ids.indexOf(folder.id); });
    sessionStorage.setItem("folder-order-fixture", JSON.stringify(body.p_folder_ids));
    return new Response(null, { status: 204 });
  }
  if (table === "profiles") return Response.json({ username: "Teststudent" });
  if (table === "semester_subjects") return Response.json([{ id: "selected", subject_id: "tma4240", custom_code: null, custom_name: null }]);
  let rows = table === "notes" ? notes : table === "note_folders" ? folders : [];
  for (const [key, value] of url.searchParams) {
    if (value === "is.null") rows = rows.filter(row => (row as Record<string, unknown>)[key] === null);
    if (value.startsWith("eq.")) rows = rows.filter(row => String((row as Record<string, unknown>)[key]) === value.slice(3));
  }
  if (init?.method === "PATCH") {
    const update = JSON.parse(String(init.body));
    rows.forEach(row => Object.assign(row, update));
  }
  const single = new Headers(init?.headers).get("accept")?.includes("vnd.pgrst.object");
  return Response.json(single ? rows[0] ?? null : rows);
};
const isAdmin = new URLSearchParams(location.search).get("role") !== "user";
const user = { id: "sidebar-test", email: "student@example.test", user_metadata: {} } as User;
if (!location.hash) location.hash = "#/fag/tma4240/notater";
createRoot(document.getElementById("root")!).render(<AuthContext.Provider value={{ user, role: isAdmin ? "admin" : "user", isAdmin, isLoading: false, signOut: async () => {} }}><App /></AuthContext.Provider>);
