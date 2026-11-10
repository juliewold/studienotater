import { createRoot } from "react-dom/client";
import type { User } from "@supabase/supabase-js";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";

// Local fixtures only: nothing reaches a backend. Nested folders are kept in memory.
type Row = Record<string, unknown>;
const folders: Row[] = [
  { id: "a", subject_id: "tma4240", parent_id: null, name: "Uke 1 – Sannsynlighet", topic_id: null, topics: null, created_at: "2026-01-01", sort_order: 0, color_index: 0 },
  { id: "a1", subject_id: "tma4240", parent_id: "a", name: "Øvinger", topic_id: null, topics: null, created_at: "2026-01-02", sort_order: null, color_index: 0 },
  { id: "a1x", subject_id: "tma4240", parent_id: "a1", name: "Løsninger", topic_id: null, topics: null, created_at: "2026-01-03", sort_order: null, color_index: 0 },
  { id: "b", subject_id: "tma4240", parent_id: null, name: "Uke 2 – Fordelinger", topic_id: null, topics: null, created_at: "2026-01-04", sort_order: 1, color_index: 1 },
  { id: "c", subject_id: "tma4240", parent_id: null, name: "Repetisjon", topic_id: null, topics: null, created_at: "2026-01-05", sort_order: 2, color_index: 2 },
];
const notes: Row[] = [
  { id: "n1", slug: "sannsynlighet", title: "Sannsynlighet", folder_id: "a" },
  { id: "n2", slug: "oving-1", title: "Øving 1 – oppgave", folder_id: "a1" },
  { id: "n3", slug: "fordelinger", title: "Fordelinger", folder_id: "b" },
  { id: "n4", slug: "huskeliste", title: "Huskeliste", folder_id: null },
].map((note) => ({
  ...note,
  subject_id: "tma4240",
  subtopic_id: null,
  subtopics: null,
  description: "Notat for undermappe-testen.",
  content: "<h2>Definisjon</h2><p>Et eksempel på notatinnhold.</p>",
  content_json: null,
  created_at: "2026-01-01",
  sort_order: 0,
}));

window.fetch = async (input, init) => {
  const url = new URL(String(input));
  const table = url.pathname.split("/").pop() ?? "";
  const method = init?.method ?? "GET";

  if (table === "delete_note_folder") {
    const { p_folder_id } = JSON.parse(String(init?.body)) as { p_folder_id: string };
    const target = folders.find((folder) => folder.id === p_folder_id);
    if (target) {
      folders.forEach((folder) => { if (folder.parent_id === target.id) folder.parent_id = target.parent_id; });
      notes.forEach((note) => { if (note.folder_id === target.id) note.folder_id = target.parent_id; });
      folders.splice(folders.indexOf(target), 1);
    }
    return new Response(null, { status: 204 });
  }
  if (table === "reorder_note_folders") {
    const body = JSON.parse(String(init?.body)) as { p_folder_ids: string[] };
    body.p_folder_ids.forEach((id, index) => {
      const folder = folders.find((row) => row.id === id);
      if (folder) folder.sort_order = index;
    });
    return new Response(null, { status: 204 });
  }
  if (table === "profiles") return Response.json({ username: "Teststudent" });
  if (table === "semester_subjects") return Response.json([{ id: "selected", subject_id: "tma4240", custom_code: null, custom_name: null }]);

  if (table === "note_folders" && method === "POST") {
    const body = JSON.parse(String(init?.body)) as Row;
    const row: Row = { id: `new-${folders.length + 1}`, topic_id: null, topics: null, sort_order: null, color_index: 0, created_at: new Date().toISOString(), ...body };
    folders.push(row);
    return Response.json(row);
  }
  if (table === "note_folders" && method === "PATCH") {
    const update = JSON.parse(String(init?.body)) as Row;
    folders.forEach((row) => { if (url.searchParams.get("id") === `eq.${row.id}`) Object.assign(row, update); });
    return new Response(null, { status: 204 });
  }

  // Filters: eq.<value> and the count query's not.is.null (folder_id only).
  let rows: Row[] = table === "notes" ? notes : table === "note_folders" ? folders : [];
  for (const [key, value] of url.searchParams) {
    if (value.startsWith("eq.")) rows = rows.filter((row) => String(row[key]) === value.slice(3));
    if (value === "not.is.null") rows = rows.filter((row) => row[key] !== null);
  }
  const single = new Headers(init?.headers).get("accept")?.includes("vnd.pgrst.object");
  const shaped = url.searchParams.get("select") === "folder_id"
    ? rows.map((row) => ({ folder_id: row.folder_id }))
    : rows;
  return Response.json(single ? shaped[0] ?? null : shaped);
};

const user = { id: "sub-test", email: "student@example.test", user_metadata: {} } as User;
if (!location.hash) location.hash = "#/fag/tma4240/notater";
// Load the app only after the mock is installed: the Supabase client captures fetch when it is created.
const [{ default: App }, { AuthContext }] = await Promise.all([
  import("../src/App"),
  import("../src/context/AuthContext/AuthContext"),
]);
createRoot(document.getElementById("root")!).render(
  <AuthContext.Provider value={{ user, role: "admin", isAdmin: true, isLoading: false, signOut: async () => {} }}>
    <App />
  </AuthContext.Provider>,
);
