import { selectTopicRules } from "../src/pages/subjects/TopicPage/topicPresentation";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { TopicPage } from "../src/pages/subjects/TopicPage/TopicPage";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import { extractTopicBlocks, selectTopicNotes, loadTopicLearning, saveTopicIntroduction } from "../src/services/subjects/topicLearningService";
import type { DatabaseNote } from "../src/services/notes/notesService";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/containers.css";
import "../src/styles/theme.css";
const example = '<div data-type="callout" data-callout-type="example"><div class="note-callout-body"><p>Sett n = 3.</p><div data-type="block-math" data-latex="3^2=9"></div></div></div>';
const formula = '<div data-type="block-math" data-latex="f(n)=n^2"></div>';
const theorem = '<div data-type="callout" data-callout-type="theorem"><div class="note-callout-body"><p>En regel</p></div></div>';
const notes = [
  { id: "a", subtopicId: "s", content: example + formula + theorem },
  { id: "b", subtopicId: null, content: example },
  { id: "c", subtopicId: "outside", content: example },
].map(note => ({ ...note, subjectId: "tdt4120", title: `Notat ${note.id}`, slug: note.id })) as DatabaseNote[];
const links = [{ noteId: "a", subtopicId: "s" }, { noteId: "b", subtopicId: "s" }];
const results: string[] = [];
function check(condition: unknown, name: string) { if (!condition) throw new Error(name); results.push(`✓ ${name}`); }
check(selectTopicNotes(notes, links, ["s"]).map(n => n.id).join() === "a,b", "Primær- og ekstrakoblinger, ingen duplikater eller andre temaer");
check(selectTopicNotes(notes, links, []).length === 0, "Tomt tema tar ikke med andre notater");
const blocks = extractTopicBlocks(selectTopicNotes(notes, links, ["s"]));
check(blocks.length === 4 && blocks.filter(b => b.kind === "example").length === 2, "Eksempler, formler og regler med nøstet matematikk kun én gang");
check(blocks[0].note.id === "a" && blocks[0].html.includes("3^2=9"), "Kilde og original matematikk beholdes");
check(extractTopicBlocks([{ ...notes[0], content: `<div data-type="callout" data-callout-type="tip"><div class="note-callout-body">${example}</div></div>` }]).length === 1, "Eksempel inne i tips beholdes");
check(extractTopicBlocks([{ ...notes[0], content: `<div data-type="callout" data-callout-type="definition"><div class="note-callout-body">${formula}</div></div>` }]).length === 1, "Formel i definisjonsboks beholdes");
const ruleBlocks = extractTopicBlocks([{ ...notes[0], content: formula + theorem + '<div data-type="block-math" data-formula-concept-id="c" data-latex="T(n)=n^2"></div>' }]);
const ruleConcept = { id: "c", name: "Kjøretid", slug: "kjoretid", type: "formula" as const, shortDefinition: "Antall operasjoner for en kvadratisk algoritme.", subjectIds: [], relatedConceptIds: [] };
const rules = selectTopicRules([...ruleBlocks, ...ruleBlocks], [ruleConcept]);
check(rules.length === 2, "Viser navngitte formler og teoremer, utelater løse uttrykk og duplikater");
check(rules[1].name === "Kjøretid" && rules[1].description === ruleConcept.shortDefinition, "Formler får kontekst fra eksisterende begrep");
let introduction = "Kort introduksjon med $n^2$.";
let failIntroduction = false;
let writes = 0;
window.fetch = async (input, init) => {
  const url = new URL(String(input));
  const table = url.pathname.split("/").at(-1);
  if (table === "topics") return Response.json([{ id: "t", subject_id: "tdt4120", name: "Sorting algorithms", sort_order: 0 }]);
  if (table === "subtopics") return Response.json([{ id: "s", topic_id: "t", name: "Insertion sort", sort_order: 0 }]);
  if (table === "notes") return Response.json(notes.map(n => ({ ...n, subject_id: n.subjectId, subtopic_id: n.subtopicId })));
  if (table === "note_subtopics") return Response.json(links.map(l => ({ note_id: l.noteId, subtopic_id: l.subtopicId })));
  const concept = { id: "c", name: "Tidskompleksitet", slug: "tidskompleksitet", type: "definition", short_definition: "Antall operasjoner som funksjon av $n$." };
  if (table === "concept_subtopics") return Response.json([{ concept_id: concept.id }, { concept_id: concept.id }]);
  if (table === "concepts") return Response.json([concept]);
  if (table === "topic_introductions") {
    if (failIntroduction) return Response.json({ message: "missing table", code: "42P01" }, { status: 404 });
    if (init?.method === "POST") { introduction = JSON.parse(String(init.body)).introduction; writes++; }
    return Response.json({ introduction });
  }
  throw new Error(`Unexpected request: ${table}`);
};
const data = await loadTopicLearning("tdt4120", "t");
check(data.concepts.length === 1 && data.notes.length === 2, "Samlet lasting dedupliserer begreper og avgrenser notater");
check(data.introduction === introduction && writes === 0, "Lesing endrer ingen data");
check(await saveTopicIntroduction("t", "  Ny introduksjon  ") === "Ny introduksjon" && writes === 1, "Lagring av kun introduksjon");
failIntroduction = true;
const missing = await loadTopicLearning("tdt4120", "t");
check(missing.introductionError && missing.notes.length === 2, "Manglende migrering skjuler ikke eksisterende innhold");
failIntroduction = false;
introduction = "Kort introduksjon med $n^2$.";
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
export function Preview() {
  const [admin, setAdmin] = useState(false);
  const [dark, setDark] = useState(false);
  return <><button onClick={() => setAdmin(!admin)}>{admin ? "Vis som leser" : "Vis som admin"}</button><button onClick={() => { document.documentElement.dataset.theme = dark ? "light" : "dark"; setDark(!dark); }}>{dark ? "Lyst tema" : "Mørkt tema"}</button><AuthContext.Provider value={{ user: null, isAdmin: admin, role: admin ? "admin" : "user", isLoading: false, signOut: async () => {} }}><MemoryRouter initialEntries={["/fag/tdt4120/tema/t"]}><Routes><Route path="/fag/:subjectId/tema/:topicId" element={<TopicPage />} /></Routes></MemoryRouter></AuthContext.Provider></>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
