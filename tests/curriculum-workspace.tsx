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
  buildCurriculumUnits, currentNotesForUnit, declaredNumber, exercisesForUnit, extractFormulas, findSymbols, lectureNotesForUnit,
  matchesSearch, notesForUnit, OTHER_UNIT_ID, type CurriculumTopic,
} from "../src/services/subjects/curriculumContent";
import { loadCurriculumWorkspace, loadNoteSources } from "../src/services/subjects/curriculumWorkspaceService";
import type { DatabasePdf } from "../src/services/media/pdfsService";
import type { NoteMetadata } from "../src/services/notes/notesService";
import katex from "katex";
import { hasLesson, lessonFormulas, loadLesson } from "../src/data/curriculum/lessons";
import type { LessonBlock } from "../src/data/curriculum/lessons/types";
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
check(unit("08").topics.length === 0 && unit("08").exercises?.length === 2 && Boolean(unit("08").lectureSlides), "Forelesning uten notater beholder øving, løsningsforslag og lysark");
const fallback = buildCurriculumUnits(undefined, topics);
check(fallback.length === 3 && fallback[1].id === DC && fallback[1].number === "02", "Fag uten konfigurasjon bruker Supabase-temaene direkte");

const meta = (id: string, title: string, subtopicId: string | null): NoteMetadata => ({ id, title, subtopicId, subjectId: "tdt4120", slug: id,
  folderId: null, subtopicName: null, topicId: null, topicName: null, description: "", createdAt: "" });
const notes = [meta("n1", "Insertion sort", "ins"), meta("n2", "Forelesning 3", null), meta("n3", "Øving 3", null), meta("n4", "Annet", "bfs")];
check(notesForUnit(unit("03"), notes, [{ noteId: "n2", subtopicId: "merge" }]).map(note => note.id).join() === "n2", "Notater via primær- og ekstrakobling");
const versions = [meta("a", "Forelesning 3 - Splitt og hersk", "merge"), meta("b", "Forelesning 3 - Splitt og hersk (sikkerhetskopi 2026-10-30)", "merge"),
  meta("c", "Øving 2b - Problemer og reduksjoner (løsningsforslag)", "merge"), meta("d", "3. Splitt og hersk", "merge"), meta("e", "Rekurrenser", "merge")];
check(currentNotesForUnit(unit("03"), versions, []).map(note => note.id).join() === "a,d,e", "Skjuler sikkerhetskopier og notater fra andre forelesninger");
check(declaredNumber("Øving 2a - Datastrukturer") === "2a" && declaredNumber("Forelesning 10 - X") === "10" && declaredNumber("4. Rangering") === "4" && !declaredNumber("Rekurrenser"), "Kjenner igjen forelesnings- og øvingsnummer i titler");
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
const formulas = extractFormulas(sources, [{ id: "c1", name: "Trekanttall" }]);
check(formulas.length === 2 && formulas[1].title === "Trekanttall" && formulas[1].description === "Antall flyttinger $k$:", "Formelsamling med begrepsnavn og matematikk i forklaringen");
check(formulas[0].description === "Masterteoremet", "Formel i boks får boksens tekst som forklaring");
const symbols = findSymbols([{ latex: "O(n) + \\Omega(n) + \\lg n" }, { latex: "\\Theta(n)" }]).map(entry => entry.definition.id);
check(symbols.join() === "O,Omega,Theta,lg", "Symboler finnes uten falske treff (Ω er ikke O)");
// --- Reviewed lesson ---------------------------------------------------------
check(["01", "02a", "02b", "03", "04", "05", "06", "07", "08", "09", "10"].every(id => hasLesson("tdt4120", id)) && !hasLesson("tdt4120", "11"), "Bare temaer med kvalitetssikret læringsnotat får læringsinnhold");
const allBlocks = (blocks: LessonBlock[]): LessonBlock[] => blocks.flatMap(block =>
  block.type === "box" || block.type === "example" ? [block, ...allBlocks(block.blocks)] : [block]);
for (const unitId of ["01", "02a", "02b", "03", "04", "05", "06", "07", "08", "09", "10"]) {
  const lesson = (await loadLesson("tdt4120", unitId))!;
  const lessonBlocks = lesson.sections.flatMap(section => allBlocks(section.blocks));
  const texts = [lesson.summary, ...lesson.goals, ...lesson.overview, ...lesson.keyFormulas.map(formula => formula.label), ...lessonBlocks.flatMap(block =>
    block.type === "text" ? [block.text] : block.type === "list" ? block.items : block.type === "table" ? [...block.head, ...block.rows.flat(), block.caption ?? ""]
    : block.type === "quiz" ? block.items.flatMap(item => [item.question, item.answer]) : block.type === "figure" ? [block.caption]
    : block.type === "example" || block.type === "box" ? [block.title ?? ""] : block.type === "formula" || block.type === "pseudocode" ? [block.caption ?? ""] : [])];
  const latex = [...texts.flatMap(text => [...text.matchAll(/\$([^$]+)\$/g)].map(match => match[1])),
    ...lessonBlocks.flatMap(block => block.type === "formula" ? [block.latex] : []), ...lesson.keyFormulas.map(formula => formula.latex)];
  const broken = latex.filter(expression => { try { katex.renderToString(expression, { throwOnError: true }); return false; } catch { return true; } });
  check(latex.length > 50 && broken.length === 0, `${unitId}: all matematikk er gyldig LaTeX (${latex.length} uttrykk)`);
  check(texts.every(text => (text.match(/\*\*/g)?.length ?? 0) % 2 === 0 && (text.match(/\$/g)?.length ?? 0) % 2 === 0 && (text.match(/`/g)?.length ?? 0) % 2 === 0), `${unitId}: ingen ulukkede markeringer`);
  const figureSections = lesson.sections.filter(section => allBlocks(section.blocks).some(block => block.type === "figure"));
  check(lessonBlocks.filter(block => block.type === "figure").length >= 5 && figureSections.length >= 4, `${unitId}: figurene står ved teorien, fordelt på ${figureSections.length} avsnitt`);
  const named = lessonFormulas(lesson);
  check(named.length >= 3 && new Set(named.map(formula => formula.key)).size === named.length, `${unitId}: navngitte formler uten duplikater`);
  check(lesson.overview.length >= 5 && lesson.keyFormulas.length >= 3 && lesson.concepts.length >= 10 && lesson.notes.length === 1, `${unitId}: oversikt, nøkkelformler, utvalgte begreper og gjeldende notat`);
  check(lesson.sources.some(source => source.kind === "drive") && lesson.sources.some(source => source.kind === "note"), `${unitId}: kilder fra Google Drive og de forbedrede notatene`);
}
const lesson01 = (await loadLesson("tdt4120", "01"))!;
const allNamed = (await Promise.all(["01", "02a", "02b", "03", "04", "05", "06", "07", "08", "09", "10"].map(async id => lessonFormulas((await loadLesson("tdt4120", id))!)))).flat();
check(lesson01.concepts.length > 10 && !lesson01.concepts.some(slug => /heap|huffman|knapsack|ryggsekk|tree|quicksort|merge/.test(slug)), "Bare begreper fra forelesning 1");
check(lesson01.notes.every(note => !/sikkerhetskopi/i.test(note.label)), "Læringsnotatet lenker til gjeldende notater");
check(matchesSearch("grad", "Grådighet") && matchesSearch("merge sort", "Merge Sort algoritme") && !matchesSearch("heap", "Merge"), "Søk tåler diakritiske tegn og flere ord");

// --- Data loading and egress ------------------------------------------------
type Call = { table: string; select: string; method: string; body?: unknown };
const calls: Call[] = [];
const rows: Record<string, unknown[]> = {
  topics: topics.map(topic => ({ id: topic.id, subject_id: "tdt4120", name: topic.name, sort_order: topic.sortOrder })),
  subtopics: topics.flatMap(topic => topic.subtopics.map(subtopic => ({ id: subtopic.id, topic_id: topic.id, name: subtopic.name, sort_order: subtopic.sortOrder }))),
  notes: [{ id: "n1", subject_id: "tdt4120", folder_id: null, subtopic_id: "bfs", slug: "notat", title: "Notat", description: "", created_at: "", sort_order: 0, subtopics: null, content: html }],
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
check(document.querySelectorAll(".curriculum-unit-card").length === 16 && text(".curriculum-overview").includes("Læringsnotat klart") && text(".curriculum-sidebar").includes("Formelsamling"), "Oversikt og sidemeny med verktøy og alle temaer");
check([...document.querySelectorAll(".curriculum-nav-heading")].map(node => node.textContent).includes("Grafalgoritmer"), "Sidemenyen grupperer i hoveddeler");

const contentCalls = () => calls.filter(call => call.table === "notes" && /content/.test(call.select)).length;
const contentBefore = contentCalls();
navigate("/fag/tdt4120/tema/pensum/01");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 6);
check(text("h1") === "Algoritmer og kompleksitet" && text(".lesson-summary").includes("Insertion-Sort"), "Forelesning 01 viser det kvalitetssikrede læringsnotatet");
const order = [...document.querySelectorAll(".lesson-part")].map(section => section.querySelector("summary h3")!.textContent);
check(text(".lesson-overview").includes("Det viktigste") && document.querySelectorAll(".lesson-key-formulas .katex").length >= 3, "Det viktigste står øverst");
const firstSection = document.querySelector<HTMLDetailsElement>("details.lesson-part")!;
check(!firstSection.open, "Detaljerte avsnitt er lukket til de åpnes");
[...document.querySelectorAll<HTMLButtonElement>(".lesson-toolbar button")].find(button => button.textContent === "Åpne alle")!.click();
check([...document.querySelectorAll<HTMLDetailsElement>("details.lesson-part")].every(section => section.open), "«Åpne alle» åpner alle avsnitt");
await new Promise(resolve => setTimeout(resolve, 50)); // let passive effects attach their listeners
window.dispatchEvent(new Event("beforeprint"));
check([...document.querySelectorAll<HTMLDetailsElement>(".lesson-parts details")].every(section => section.open), "Utskrift viser alt innhold");
window.dispatchEvent(new Event("afterprint"));
check(order[0] === "Problem, instans og algoritme" && document.querySelector("#tema-insertion-sort .lesson-figure") && document.querySelector("#tema-asymptotisk .lesson-figure"), "Figurer vises inne i avsnittene, ikke samlet nederst");
check(text(".lesson-code").includes("while j > 0 and A[j] > key") && document.querySelectorAll(".lesson-code-line").length === 7, "Pseudokode med linjenumre");
check(text("#tema-ressurser").includes("Løsningsforslag øving 1") && text("#tema-ressurser").includes("Forelesning 1 (lysark)"), "Lenker til forelesning, øving og løsningsforslag beholdes");
check(contentCalls() === contentBefore, "Læringssiden henter ikke notatinnhold fra Supabase");
check([...document.querySelectorAll("#tema-begreper .curriculum-chip-list a")].some(link => link.textContent === "Trekanttall") === false, "Begreper fra kunnskapsbasen som ikke er valgt for forelesningen, vises ikke");
const callsBeforeLecture = calls.length;
document.querySelector<HTMLButtonElement>(".curriculum-play")!.click();
await waitFor(() => Boolean(document.querySelector(".lp-dialog .lp-scene-title")));
check(text(".lp-dialog h2") === "Algoritmer og kompleksitet" && calls.length === callsBeforeLecture, "«Spill av forelesning» åpner avspilleren uten nye Supabase-kall");
window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
await waitFor(() => !document.querySelector(".lp-dialog"));
check(document.activeElement?.classList.contains("curriculum-play"), "Lukking gir fokus tilbake til knappen på temasiden");

navigate("/fag/tdt4120/tema/pensum/03");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 7);
check(text("h1") === "Splitt og hersk" && text(".lesson-overview").includes("Masterteoremet") && document.querySelector("#tema-binaersok .lesson-figure") && document.querySelector("#tema-masterteoremet .lesson-figure"), "Forelesning 03 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Øving 3, del 1") && !/sikkerhetskopi/i.test(text(".curriculum-unit-page")), "Lenker til de forbedrede øvingsnotatene, uten sikkerhetskopier");
check(!document.querySelector(".curriculum-navigation a[href*='/undertema/']") && !document.querySelector(".curriculum-unit-page a[href*='/undertema/']"), "Gamle undertemaer vises verken i sidemenyen eller i læringsnotatet");

navigate("/fag/tdt4120/tema/pensum/04");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 10);
check(text("h1") === "Rangering i lineær tid" && text(".lesson-overview").includes("Sorteringsgrensen") && document.querySelector("#tema-sorteringsgrensen .lesson-figure") && document.querySelector("#tema-radix-sort .lesson-figure"), "Forelesning 04 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Øving 4, del 1") && !/sikkerhetskopi/i.test(text(".curriculum-unit-page")), "Forelesning 04 lenker til de forbedrede øvingsnotatene");

navigate("/fag/tdt4120/tema/pensum/05");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 12);
check(text("h1") === "Rotfaste trestrukturer" && text(".lesson-overview").includes("Build-Max-Heap") && document.querySelector("#tema-hauger .lesson-figure") && document.querySelector("#tema-soketrer .lesson-figure"), "Forelesning 05 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen desember 2025") && text("#tema-ressurser").includes("Løsningsforslag øving 5"), "Forelesning 05 lenker til øving, løsningsforslag og eksamener");

navigate("/fag/tdt4120/tema/pensum/06");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 6);
check(text("h1") === "Dynamisk programmering" && text(".lesson-overview").includes("Optimal delstruktur") && document.querySelector("#tema-lcs .lesson-figure") && document.querySelector("#tema-ryggsekk .lesson-figure"), "Forelesning 06 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen august 2026") && text("#tema-ressurser").includes("Løsningsforslag øving 6"), "Forelesning 06 lenker til øving, løsningsforslag og eksamener");

navigate("/fag/tdt4120/tema/pensum/07");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 8);
check(text("h1") === "Grådighet" && text(".lesson-overview").includes("Grådighetsegenskapen") && document.querySelector("#tema-aktivitetsutvelgelse .lesson-figure") && document.querySelector("#tema-huffman .lesson-figure"), "Forelesning 07 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen desember 2023") && text("#tema-ressurser").includes("Løsningsforslag øving 7"), "Forelesning 07 lenker til øving, løsningsforslag og eksamener");

navigate("/fag/tdt4120/tema/pensum/08");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 9);
check(text("h1") === "Traversering av grafer" && text(".lesson-overview").includes("Topologisk sortering") && document.querySelector("#tema-bfs .lesson-figure") && document.querySelector("#tema-sterke-komponenter .lesson-figure"), "Forelesning 08 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen desember 2025") && text("#tema-ressurser").includes("Løsningsforslag øving 8"), "Forelesning 08 lenker til øving, løsningsforslag og eksamener");

navigate("/fag/tdt4120/tema/pensum/09");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 5);
check(text("h1") === "Minimale spenntrær" && text(".lesson-overview").includes("Kruskal") && document.querySelector("#tema-disjunkte .lesson-figure") && document.querySelector("#tema-kruskal .lesson-figure"), "Forelesning 09 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen desember 2025") && text("#tema-ressurser").includes("Løsningsforslag øving 9"), "Forelesning 09 lenker til øving, løsningsforslag og eksamener");

navigate("/fag/tdt4120/tema/pensum/10");
await waitFor(() => document.querySelectorAll(".lesson-figure svg").length === 6);
check(text("h1") === "Korteste vei fra én til alle" && text(".lesson-overview").includes("Relax") && document.querySelector("#tema-relax .lesson-figure") && document.querySelector("#tema-dijkstra .lesson-figure"), "Forelesning 10 viser læringsnotatet med figurer ved teorien");
check(text("#tema-ressurser").includes("Eksamen desember 2025") && text("#tema-ressurser").includes("Øving 10: Korteste vei"), "Forelesning 10 lenker til øving og eksamener");

navigate("/fag/tdt4120/tema/pensum/11");
await waitFor(() => text(".curriculum-unit-page").includes("Læringsnotatet for dette temaet er ikke skrevet ennå"));
check(text("h1") === "Korteste vei fra alle til alle" && text(".curriculum-label") === "Forelesning 11", "Temaside for forelesning uten læringsnotat");
check(!document.querySelector(".lesson-part"), "Uten læringsnotat vises ikke læringsinnhold");
check(!document.querySelector("#tema-begreper .curriculum-chip-list a[href*='concepts']") && text("#tema-begreper").includes("Begrepene for dette temaet velges ut"), "Uten læringsnotat vises ingen ufiltrert begrepsliste");
check(contentCalls() === contentBefore, "Heller ikke temaer uten læringsnotat henter notatinnhold");
const before = calls.length;
document.querySelector<HTMLButtonElement>(".curriculum-mark")!.click();
await waitFor(() => calls.length > before);
const save = calls.at(-1)!;
check(save.table === "progress" && save.method === "POST" && JSON.stringify(save.body).includes('"item_type":"syllabus"') && JSON.stringify(save.body).includes("tdt4120-11"), "Gjennomgått lagres som eksisterende pensumfremdrift");
await waitFor(() => text(".curriculum-progress-count") === "1/16");
check(document.querySelector(".curriculum-mark")!.getAttribute("aria-pressed") === "true", "Markering vises i siden og sidemenyen");

navigate("/fag/tdt4120/tema/formler");
await waitFor(() => document.querySelectorAll(".curriculum-formula-card").length === new Set(allNamed.map(formula => formula.key)).size);
check(!document.querySelector(".curriculum-formula-card.is-unreviewed") && contentCalls() === contentBefore, "Formelsamlingen viser kvalitetssikrede formler uten å hente notater");
const search = document.querySelector<HTMLInputElement>(".curriculum-search input")!;
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
setter.call(search, "lastfaktor"); search.dispatchEvent(new Event("input", { bubbles: true }));
await waitFor(() => document.querySelectorAll(".curriculum-formula-card").length === 1);
check(text(".curriculum-formula-card").includes("Lastfaktor"), "Formelsamlingen er søkbar");
setter.call(search, ""); search.dispatchEvent(new Event("input", { bubbles: true }));
document.querySelector<HTMLInputElement>(".curriculum-toggle-notes input")!.click();
await waitFor(() => document.querySelectorAll(".curriculum-formula-card.is-unreviewed").length === 2);
check(text(".curriculum-formulas").includes("fra notater, ikke kvalitetssikret") && contentCalls() <= contentBefore + 1, "Notatformler er valgfrie og tydelig merket");

navigate("/fag/tdt4120/tema/symboler");
await waitFor(() => document.querySelectorAll(".curriculum-symbol-card").length > 0);
check(text(".curriculum-symbols").includes("Stor theta") && text(".curriculum-symbols").includes("Stor omega"), "Symboloversikt fra læringsnotatenes formler");

navigate("/fag/tdt4120/tema/begreper");
await waitFor(() => document.querySelectorAll(".curriculum-concept-card").length === 2);
check(text(".curriculum-glossary").includes("Del, løs og kombiner."), "Begrepsoversikt med korte definisjoner");
check(calls.filter(call => call.method !== "GET").length === 1, "Eneste skriving er brukerens egen markering");
navigate("/fag/tdt4120/tema/pensum/01");
report();
