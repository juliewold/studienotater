import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import { CurriculumLayout } from "../src/components/subjects/CurriculumLayout/CurriculumLayout";
import { CurriculumOverviewPage } from "../src/pages/subjects/curriculum/CurriculumOverviewPage";
import { CurriculumUnitPage } from "../src/pages/subjects/curriculum/CurriculumUnitPage";
import { FormulaCollectionPage } from "../src/pages/subjects/curriculum/FormulaCollectionPage";
import { SymbolsPage } from "../src/pages/subjects/curriculum/SymbolsPage";
import { ConceptGlossaryPage } from "../src/pages/subjects/curriculum/ConceptGlossaryPage";
import { tdt4120Curriculum } from "../src/data/curriculum/tdt4120";
import {
  buildCurriculumUnits, exercisesForUnit, extractFormulas, extractLearningBlocks, findSymbols, lectureNotesForUnit,
  matchesSearch, notesForUnit, OTHER_UNIT_ID, type CurriculumTopic,
} from "../src/services/subjects/curriculumContent";
import { loadCurriculumWorkspace, loadNoteSources } from "../src/services/subjects/curriculumWorkspaceService";
import type { DatabasePdf } from "../src/services/media/pdfsService";
import type { NoteMetadata } from "../src/services/notes/notesService";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";

const results: string[] = [];
function check(condition: unknown, name: string) { if (!condition) throw new Error(name); results.push(`✓ ${name}`); }
const report = () => { document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`; };

// --- Structure ---------------------------------------------------------------
const DC = "c28ad5f0-8c77-4832-9a34-501fc067b844"; // Divide and conquer → 03
const SORT = "9db9ef2f-8680-4b49-a75c-6086fc782e5e"; // Sorting algorithms → 01
const QUICK = "b5407397-6077-4c03-94fc-76833ff96fb8"; // override → 03
const topics: CurriculumTopic[] = [
  { id: SORT, subjectId: "tdt4120", name: "Sorting algorithms", sortOrder: 0, subtopics: [
    { id: "ins", topicId: SORT, name: "Insertion sort", sortOrder: 0 }, { id: QUICK, topicId: SORT, name: "Quick sort", sortOrder: 1 }] },
  { id: DC, subjectId: "tdt4120", name: "Divide and conquer", sortOrder: 1, subtopics: [{ id: "merge", topicId: DC, name: "Merge Sort", sortOrder: 0 }] },
  { id: "new", subjectId: "tdt4120", name: "Graphs", sortOrder: 2, subtopics: [{ id: "bfs", topicId: "new", name: "BFS", sortOrder: 0 }] },
];
const units = buildCurriculumUnits(tdt4120Curriculum, topics);
const unit = (id: string) => units.find(item => item.id === id)!;
check(units.length === tdt4120Curriculum.units.length + 1, "Alle 15 forelesninger fra pensumheftet, pluss gruppe for ukjente temaer");
check(unit("01").subtopicIds.join() === "ins" && unit("03").subtopicIds.join() === `${QUICK},merge`, "Undertema kan flyttes til riktig forelesning uten å endre databasen");
check(unit(OTHER_UNIT_ID).subtopicIds.join() === "bfs", "Temaer som ikke er i konfigurasjonen skjules ikke");
check(unit("08").topics.length === 0 && unit("08").exercises?.length === 1, "Forelesning uten notater beholder øving og lysark");
const fallback = buildCurriculumUnits(undefined, topics);
check(fallback.length === 3 && fallback[1].id === DC && fallback[1].number === "02", "Fag uten konfigurasjon bruker Supabase-temaene direkte");

const meta = (id: string, title: string, subtopicId: string | null): NoteMetadata => ({ id, title, subtopicId, subjectId: "tdt4120", slug: id,
  folderId: null, subtopicName: null, topicId: null, topicName: null, description: "", createdAt: "" });
const notes = [meta("n1", "Insertion sort", "ins"), meta("n2", "Forelesning 3", null), meta("n3", "Øving 3", null), meta("n4", "Annet", "bfs")];
check(notesForUnit(unit("03"), notes, [{ noteId: "n2", subtopicId: "merge" }]).map(note => note.id).join() === "n2", "Notater via primær- og ekstrakobling");
const pdf = (id: string, title: string, subtopicId: string | null = null) => ({ id, title, subtopicId, category: "forelesninger" }) as DatabasePdf;
const pdfs = [pdf("p1", "forelesn01_kort"), pdf("p10", "Forelesning 10"), pdf("p3", "Øving 1"), pdf("px", "Lysark", "merge")];
check(lectureNotesForUnit(unit("01"), pdfs).map(item => item.id).join() === "p1", "Forelesning 1 matcher ikke forelesning 10 eller øvinger");
check(lectureNotesForUnit(unit("03"), pdfs).map(item => item.id).join() === "px", "Forelesningsnotat via undertema");
check(exercisesForUnit(unit("01"), pdfs, notes).map(item => item.id).join() === "p3" && exercisesForUnit(unit("03"), pdfs, notes)[0]?.id === "n3", "Øvinger fra PDF-er og notater");

// --- Content -----------------------------------------------------------------
const math = (latex: string, extra = "") => `<div data-type="block-math" data-latex="${latex}"${extra}></div>`;
const callout = (type: string, body: string, extra = "") => `<div data-type="callout" data-callout-type="${type}"${extra}><div class="note-callout-body">${body}</div></div>`;
const html = [
  callout("definition", "<p>En algoritme er en prosedyre.</p>", ' data-concept-name="Algoritme"'),
  callout("theorem", `<p>Masterteoremet</p>${math("T(n)=aT(n/b)+f(n)")}`),
  `<p>Antall flyttinger <span data-type="inline-math" data-latex="k">k</span>:</p>`, math("\\sum_{k=1}^{n-1} k = \\Theta(n^2)", ' data-formula-concept-id="c1"'),
  "<h3>Insertion-Sort</h3><p>Tekst</p><pre><code>for j = 2 to n</code></pre>",
  '<p><img src="supabase-storage:notes/a.png" alt="Rekursjonstre"></p>',
  callout("example", "<p>Sett n = 3.</p>"), callout("tip", "<p>Husk</p>"),
  math("\\sum_{k=1}^{n-1} k = \\Theta(n^2)"),
].join("");
const sources = [{ id: "n1", title: "Notat", slug: "notat", subjectId: "tdt4120", content: html }];
const blocks = extractLearningBlocks(sources);
const kinds = (kind: string) => blocks.filter(block => block.kind === kind);
check(kinds("theory").length === 1 && kinds("theory")[0].title === "Algoritme", "Definisjoner blir kort teori");
check(kinds("formula").length === 2 && kinds("formula")[0].html.includes("T(n)=aT"), "Formel inne i teorem holdes samlet med boksen, duplikat fjernes");
check(kinds("formula")[1].html.startsWith("<p>Antall flyttinger"), "Løs formel tar med forklaringen foran");
check(kinds("algorithm")[0]?.title === "Insertion-Sort", "Pseudokode får nærmeste overskrift");
check(kinds("figure")[0]?.title === "Rekursjonstre" && kinds("example").length === 1 && blocks.length === 6, "Figurer og eksempler, tips utelates");
const formulas = extractFormulas(sources, [{ id: "c1", name: "Trekanttall" }]);
check(formulas.length === 2 && formulas[1].title === "Trekanttall" && formulas[1].description === "Antall flyttinger $k$:", "Formelsamling med begrepsnavn og matematikk i forklaringen");
check(formulas[0].description === "Masterteoremet", "Formel i boks får boksens tekst som forklaring");
const symbols = findSymbols([{ latex: "O(n) + \\Omega(n) + \\lg n" }, { latex: "\\Theta(n)" }]).map(entry => entry.definition.id);
check(symbols.join() === "O,Omega,Theta,lg", "Symboler finnes uten falske treff (Ω er ikke O)");
check(matchesSearch("grad", "Grådighet") && matchesSearch("merge sort", "Merge Sort algoritme") && !matchesSearch("heap", "Merge"), "Søk tåler diakritiske tegn og flere ord");

// --- Data loading and egress ------------------------------------------------
type Call = { table: string; select: string; method: string; body?: unknown };
const calls: Call[] = [];
const rows: Record<string, unknown[]> = {
  topics: topics.map(topic => ({ id: topic.id, subject_id: "tdt4120", name: topic.name, sort_order: topic.sortOrder })),
  subtopics: topics.flatMap(topic => topic.subtopics.map(subtopic => ({ id: subtopic.id, topic_id: topic.id, name: subtopic.name, sort_order: subtopic.sortOrder }))),
  notes: [{ id: "n1", subject_id: "tdt4120", folder_id: null, subtopic_id: "merge", slug: "notat", title: "Notat", description: "", created_at: "", sort_order: 0, subtopics: null, content: html }],
  pdfs: [], note_subtopics: [],
  concept_subtopics: [{ concept_id: "c1", subtopic_id: "merge" }, { concept_id: "c1", subtopic_id: "ins" }, { concept_id: "c2", subtopic_id: "merge" }],
  concepts: [
    { id: "c1", name: "Trekanttall", slug: "trekanttall", type: "formula", short_definition: "Summen $1+\\dots+n$." },
    { id: "c2", name: "Splitt og hersk", slug: "splitt-og-hersk", type: "method", short_definition: "Del, løs og kombiner." }],
  topic_introductions: [{ topic_id: DC, introduction: "Rekursiv dekomponering." }],
  progress: [],
};
window.fetch = async (input, init) => {
  const url = new URL(String(input));
  const table = url.pathname.split("/").at(-1)!;
  const select = url.searchParams.get("select") ?? "";
  calls.push({ table, select, method: init?.method ?? "GET", body: init?.body ? JSON.parse(String(init.body)) : undefined });
  if (!(table in rows)) throw new Error(`Uventet forespørsel: ${table}`);
  if (init?.method === "POST") return Response.json([]);
  // Project top-level columns so payloads look like PostgREST.
  const columns = select.split(",").map(part => part.trim().split(/[!(\s]/)[0]).filter(Boolean);
  return Response.json(select.includes("(") || !select ? rows[table] : rows[table].map(row => Object.fromEntries(columns.map(key => [key, (row as Record<string, unknown>)[key]]))));
};
const workspace = await loadCurriculumWorkspace("tdt4120");
const firstCalls = calls.length;
check(workspace.units.find(item => item.id === "03")!.subtopicIds.includes("merge") && workspace.concepts.length === 2, "Arbeidsflaten bygges fra eksisterende Supabase-data");
check(calls.filter(call => call.table === "subtopics").length === 1, "Ett kall for alle undertemaer");
check(!calls.some(call => call.table === "notes" && /content/.test(call.select)), "Oversikten henter ikke notatinnhold");
check(!calls.some(call => call.table === "concepts" && call.select.includes("explanation")), "Begreper hentes uten lange forklaringer");
check(calls.every(call => call.method === "GET" || call.method === "HEAD"), "Lasting skriver ingenting");
await loadCurriculumWorkspace("tdt4120");
check(calls.length === firstCalls, "Arbeidsflaten gjenbrukes uten nye kall");
const loaded = await loadNoteSources(workspace.notes);
const contentCall = calls.at(-1)!;
check(contentCall.table === "notes" && contentCall.select.replace(/\s/g, "") === "id,content" && loaded[0].content === html, "Notatinnhold hentes uten editor-JSON");
await loadNoteSources(workspace.notes);
check(calls.at(-1) === contentCall, "Notatinnhold gjenbrukes i økten");
report();

// --- Rendering ---------------------------------------------------------------
const router = { navigate: (to: string) => void to };
export function Navigator() {
  const navigateTo = useNavigate();
  useEffect(() => { router.navigate = navigateTo; }, [navigateTo]);
  return null;
}
const navigate = (to: string) => router.navigate(to);
const user = { id: "u1" } as User;
createRoot(document.getElementById("root")!).render(
  <AuthContext.Provider value={{ user, isAdmin: false, role: "user", isLoading: false, signOut: async () => {} }}>
    <MemoryRouter initialEntries={["/fag/tdt4120/tema"]}><Navigator /><Routes>
      <Route path="/fag/:subjectId/tema" element={<CurriculumLayout />}>
        <Route index element={<CurriculumOverviewPage />} />
        <Route path="pensum/:unitId" element={<CurriculumUnitPage />} />
        <Route path="formler" element={<FormulaCollectionPage />} />
        <Route path="symboler" element={<SymbolsPage />} />
        <Route path="begreper" element={<ConceptGlossaryPage />} />
      </Route>
    </Routes></MemoryRouter>
  </AuthContext.Provider>);

const waitFor = (predicate: () => boolean) => new Promise<void>((resolve, reject) => {
  const started = performance.now();
  const tick = () => predicate() ? resolve() : performance.now() - started > 5000 ? reject(new Error("Tidsavbrudd")) : requestAnimationFrame(tick);
  tick();
});
const text = (selector: string) => document.querySelector(selector)?.textContent ?? "";

await waitFor(() => document.querySelectorAll(".curriculum-unit-card").length > 0);
check(document.querySelectorAll(".curriculum-unit-card").length === 16 && text(".curriculum-sidebar").includes("Formelsamling"), "Oversikt og sidemeny med verktøy og alle temaer");
check([...document.querySelectorAll(".curriculum-nav-heading")].map(node => node.textContent).includes("Grafalgoritmer"), "Sidemenyen grupperer i hoveddeler");

navigate("/fag/tdt4120/tema/pensum/03");
await waitFor(() => text(".curriculum-unit-page").includes("Fra Notat"));
check(text("h1") === "Splitt og hersk" && text(".curriculum-label") === "Forelesning 03", "Læringsside for valgt forelesning");
const headings = [...document.querySelectorAll(".curriculum-unit-page .curriculum-section > h2")].map(node => node.textContent);
check(["Kort teori", "Algoritmer og pseudokode", "Kjøretider og formler", "Figurer", "Eksempler", "Begreper", "Undertemaer", "Forelesninger og øvinger"].every(heading => headings.includes(heading)), "Teori, algoritmer, formler, figurer, eksempler, begreper og ressurser");
check(text(".curriculum-unit-page").includes("Rekursiv dekomponering.") && text(".curriculum-unit-page").includes("Øving 3: Splitt og hersk"), "Temaintroduksjon og øving vises");
check(document.querySelectorAll(".curriculum-subtopics a").length === 2, "Aktivt tema viser undertemaer i sidemenyen");
const before = calls.length;
document.querySelector<HTMLButtonElement>(".curriculum-mark")!.click();
await waitFor(() => calls.length > before);
const save = calls.at(-1)!;
check(save.table === "progress" && save.method === "POST" && JSON.stringify(save.body).includes('"item_type":"syllabus"') && JSON.stringify(save.body).includes("tdt4120-03"), "Gjennomgått lagres som eksisterende pensumfremdrift");
await waitFor(() => text(".curriculum-progress-count") === "1/16");
check(document.querySelector(".curriculum-mark")!.getAttribute("aria-pressed") === "true", "Markering vises i siden og sidemenyen");

navigate("/fag/tdt4120/tema/formler");
await waitFor(() => document.querySelectorAll(".curriculum-formula-card").length === 2);
const search = document.querySelector<HTMLInputElement>(".curriculum-search input")!;
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
setter.call(search, "trekanttall"); search.dispatchEvent(new Event("input", { bubbles: true }));
await waitFor(() => document.querySelectorAll(".curriculum-formula-card").length === 1);
check(text(".curriculum-formula-card").includes("Trekanttall"), "Formelsamlingen er søkbar");

navigate("/fag/tdt4120/tema/symboler");
await waitFor(() => document.querySelectorAll(".curriculum-symbol-card").length > 0);
check(text(".curriculum-symbols").includes("Stor theta") && text(".curriculum-symbols").includes("Sum"), "Symboloversikt fra formlene");

navigate("/fag/tdt4120/tema/begreper");
await waitFor(() => document.querySelectorAll(".curriculum-concept-card").length === 2);
check(text(".curriculum-glossary").includes("Del, løs og kombiner."), "Begrepsoversikt med korte definisjoner");
check(calls.filter(call => call.method !== "GET").length === 1, "Eneste skriving er brukerens egen markering");
navigate("/fag/tdt4120/tema/pensum/03");
report();
