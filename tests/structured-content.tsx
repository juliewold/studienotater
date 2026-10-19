import { groupSubtopicContent } from "../src/pages/subjects/SubtopicPage/subtopicPresentation";
import { getLegacyLearningContent } from "../src/services/subjects/legacyLearningContent";
import type { DatabaseNote } from "../src/services/notes/notesService";
import { resolveSourceConcepts } from "../src/services/concepts/sourceConceptResolver";
import type { Concept } from "../src/data/concepts/types";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import { getConceptContentFromNote } from "../src/services/concepts/conceptContentService";
import { loadTopicLearning } from "../src/services/subjects/topicLearningService";
import { ConceptPage } from "../src/pages/concepts/ConceptPage/ConceptPage";
import { SubtopicPage } from "../src/pages/subjects/SubtopicPage/SubtopicPage";
import { TopicPage } from "../src/pages/subjects/TopicPage/TopicPage";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/theme.css";
import "../src/styles/containers.css";
const box = (id: string, type: string, body: string) => `<div data-type="callout" data-callout-type="${type}" data-concept-id="${id}"><div class="note-callout-body">${body}</div></div>`;
const formula = '<div data-type="block-math" data-formula-concept-id="a" data-latex="f(n)=n^2"></div>';
const body = '<p>Full forklaring med <span data-type="inline-math" data-latex="n^2"></span>.</p><table><tbody><tr><td>Tabellverdi</td></tr></tbody></table><ul><li>Første steg</li></ul>';
const source = box("a", "definition", body) + box("a", "theorem", '<p>Teorem med forutsetninger.</p>') + formula + box("a", "method", '<p>Metodens fremgangsmåte.</p>') + box("a", "example", '<p>Utregnet eksempel.</p>' + formula);
const extracted = getConceptContentFromNote(source, "a");
const results: string[] = [];
function check(value: unknown, name: string) { if (!value) throw new Error(name); results.push(`✓ ${name}`); }
check(extracted.length === 5, "Alle fem bokstyper, nøstet formel vises én gang");
check(extracted[0].documentHtml.includes('<table>') && extracted[0].documentHtml.includes('data-latex="n^2"') && extracted[0].documentHtml.includes('<ul>'), "Tabeller, lister og inline-LaTeX bevares");
check(extracted[4].documentHtml.includes('data-latex="f(n)=n^2"'), "Eksempel beholder blokkmatematikk");
check(getConceptContentFromNote(source, "unrelated").length === 0, "Ingen treff basert på navn eller notatplassering");
const nested = box("a", "definition", '<p>Riktig innhold</p>' + box("b", "example", '<p>Uvedkommende</p>'));
check(!getConceptContentFromNote(nested, "a")[0].documentHtml.includes("Uvedkommende"), "Fjerner nøstet boks med annen begrepskobling");
check(getConceptContentFromNote(nested, "b").length === 1, "Nøstet boks finnes fortsatt på sitt eget begrep");
const algorithm: Concept = { id: "algorithm", name: "Algoritme", slug: "algoritme", type: "definition", shortDefinition: "Fallback", subjectIds: [], relatedConceptIds: [] };
// Shape from the existing Forelesning 1 HTML: no concept metadata or JSON callouts.
const legacy = '<div data-callout-type="definition" data-type="callout" class="note-callout"><div class="note-callout-body"><p>En <strong>algoritme</strong> er en presis og endelig beskrivelse av en fremgangsmåte for å løse et problem.</p><p>En algoritme:</p><ul><li><p>mottar en <strong>input</strong></p></li><li><p>produserer en <strong>output</strong></p></li></ul></div></div>';
const resolved = resolveSourceConcepts(legacy, [algorithm]);
check(getConceptContentFromNote(resolved, algorithm.id)[0]?.documentHtml.includes('<ul>'), "Ekte HTML-only definisjonsformat kobles og beholder hele boksen");
check(!legacy.includes('data-concept-id'), "Originalt kildeinnhold endres ikke");
check(getConceptContentFromNote(resolveSourceConcepts(legacy, [algorithm, { ...algorithm, id: "duplicate" }]), algorithm.id).length === 0, "Tvetydige navn kobles ikke");
check(getConceptContentFromNote(resolveSourceConcepts(legacy.replace('En <strong>', 'Vi bruker en <strong>'), [algorithm]), algorithm.id).length === 0, "Vanlig omtale kobles ikke som definisjon");
check(getConceptContentFromNote(resolveSourceConcepts(legacy.replace('data-type="callout"', 'data-type="callout" data-concept-id="other"'), [algorithm]), algorithm.id).length === 0, "Eksisterende eksplisitt kobling overstyres aldri");
check(getConceptContentFromNote(resolveSourceConcepts(legacy.replace('definition', 'example'), [algorithm]), algorithm.id).length === 0, "Eksempelomtale brukes ikke til å gjette eierskap");
const inlineLink = box("a", "definition", '<p>Innhold med <span data-concept-id="b">annet begrep</span>.</p>');
check(getConceptContentFromNote(inlineLink, "a")[0].documentHtml.includes('annet begrep'), "Inline-lenker til andre begreper fjerner ikke kildetekst");
const namedConcepts: Concept[] = ["Big-O", "De Morgans lover", "Fremgangsmåte"].map((name, index) => ({ ...algorithm, id: `source-${index}`, name, slug: `source-${index}` }));
const unlinkedBox = (type: string, body: string) => box("", type, body);
const headingSource = '<h1>8. Big-O – asymptotisk øvre grense</h1>'
  + unlinkedBox("definition", '<p>Vi skriver:</p><div data-type="block-math" data-latex="f(n)=O(g(n))"></div><p>dersom det finnes positive konstanter.</p>')
  + '<h3>Intuisjon</h3>' + unlinkedBox("example", '<p><span data-type="inline-math" data-latex="3n^2=O(n^2)"></span></p>')
  + '<h1>Neste emne</h1>' + unlinkedBox("example", '<p>Skal ikke følge Big-O</p>')
  + '<h1>De Morgans lover</h1>' + unlinkedBox("theorem", '<p>Begge lovene med forutsetninger.</p>')
  + '<h1>Fremgangsmåte</h1>' + unlinkedBox("method", '<ol><li>Trinn én</li><li>Trinn to</li></ol>')
  + '<p>Resultatet av metoden er:</p><div data-type="block-math" data-latex="x=2"></div>';
const scopedSource = resolveSourceConcepts(headingSource, namedConcepts);
const bigOBlocks = getConceptContentFromNote(scopedSource, "source-0");
check(bigOBlocks.length === 2 && bigOBlocks[1].type === "example", "Nummerert begrepsoverskrift kobler definisjon og eksempel gjennom underoverskrift");
check(!bigOBlocks.some(block => block.documentHtml.includes("Skal ikke")), "Neste hovedoverskrift avslutter kildeavgrensingen");
check(bigOBlocks[0].documentHtml.includes('data-latex="f(n)=O(g(n))"'), "Nøstet formel beholdes i norsk definisjon, uten egen duplikat");
check(getConceptContentFromNote(scopedSource, "source-1")[0]?.type === "theorem", "Teorem kobles generelt fra overskrift");
const methodBlocks = getConceptContentFromNote(scopedSource, "source-2");
check(methodBlocks.map(block => block.type).join() === "method,formula", "Metode og frittstående formel følger sin egen seksjon");
check(methodBlocks[1].contextHtml?.includes("Resultatet av metoden"), "Frittstående formel beholder forklarende kontekst fra kilden");
const named = unlinkedBox("method", '<h3>Fremgangsmåte</h3><p>Navngitt metode</p>');
check(getConceptContentFromNote(resolveSourceConcepts(named, namedConcepts), "source-2").length === 1, "Navngitte bokser virker uten overskrift utenfor boksen");
const explicit = '<h1>Big-O</h1>' + box("source-1", "theorem", '<p>Manuell kobling</p>');
check(getConceptContentFromNote(resolveSourceConcepts(explicit, namedConcepts), "source-0").length === 0, "Overskrift overstyrer aldri manuell kobling");
const unknownName = '<h1>Big-O</h1>' + named.replace('data-type="callout"', 'data-type="callout" data-concept-name="Ukjent"');
check(getConceptContentFromNote(resolveSourceConcepts(unknownName, namedConcepts), "source-0").length === 0, "Ukjent eksplisitt boksnavn arver ikke feil overskrift");
check(getConceptContentFromNote(resolveSourceConcepts('<h1>Vi omtaler Big-O her</h1>' + unlinkedBox("example", '<p>Omtale</p>'), namedConcepts), "source-0").length === 0, "Delstreng i overskrift regnes ikke som entydig begrepsnavn");
const legacyNote: DatabaseNote = { id: "legacy", subjectId: "subject", folderId: null, subtopicId: "s1", subtopicName: null, topicId: null, topicName: null, title: "Et eldre notat", slug: "legacy", description: "", createdAt: "", contentJson: null,
  content: source.replace(/ data-concept-id="a"| data-formula-concept-id="a"/g, "") };
const legacyBlocks = getLegacyLearningContent([legacyNote], [legacyNote], [{ noteId: "legacy", subtopicId: "s1" }], [{ id: "s1", name: "Et eldre notat" }], []);
check(legacyBlocks.length === 5 && legacyBlocks.map(block => block.type).join() === "definition,theorem,formula,method,example", "Entydig eldre notat viser alle fem bokstyper uten begrepsregister");
check(legacyBlocks[4].documentHtml.includes('data-latex="f(n)=n^2"'), "Eldre eksempel bevarer nøstet matematikk uten duplikat");
check(getLegacyLearningContent([legacyNote], [legacyNote], [{ noteId: "legacy", subtopicId: "s2" }], [{ id: "s1", name: "Et eldre notat" }, { id: "s2", name: "Et eldre notat" }], []).length === 0, "Flere forskjellige plasseringer er tvetydige også innen samme tema");
check(getLegacyLearningContent([legacyNote], [legacyNote], [], [{ id: "s2", name: "Et eldre notat" }], []).length === 0, "Kildene lekker ikke til naboundertema");
check(getLegacyLearningContent([{ ...legacyNote, subtopicId: null }], [legacyNote], [{ noteId: "legacy", subtopicId: "s1" }], [{ id: "s1", name: "Et eldre notat" }], []).length === 5, "Eldre kobling via kun note_subtopics støttes");
check(getLegacyLearningContent([{ ...legacyNote, content: source }], [{ ...legacyNote, content: source }], [], [{ id: "s1", name: "Et eldre notat" }], []).length === 0, "Eksplisitte begrepskoblinger omgås ikke av notatfallback");
check(getLegacyLearningContent([legacyNote], [{ ...legacyNote, content: source }], [], [{ id: "s1", name: "Et eldre notat" }], ["a"]).length === 0, "Allerede viste begrepsbokser dupliseres ikke");
check(getLegacyLearningContent([{ ...legacyNote, title: "Forelesning om mange undertemaer" }], [legacyNote], [], [{ id: "s1", name: "Et eldre notat" }], []).length === 0, "Enkel primærplassering alene gjør ikke en bred forelesning entydig");
const concepts = ["a", "b", "c"].map(id => ({ id, name: `Begrep ${id}`, slug: id, type: "definition", short_definition: `Kort tekst ${id}`, explanation: "Kort fallback" }));
const shared = { id: "note", subject_id: "subject", subtopic_id: "s1", title: "Blandet forelesning", slug: "blandet", content: source + box("b", "example", '<p>BARE UNDERTEMA TO</p>') + box("c", "theorem", '<p>BARE ANNET TEMA</p>') + '<div data-type="callout" data-callout-type="example"><div class="note-callout-body"><p>UKLAR TILHØRIGHET</p></div></div>' };
let legacyMode = false;
window.fetch = async input => {
  const url = new URL(String(input));
  const table = url.pathname.split('/').at(-1);
  if (table === "topics") return Response.json([{ id: "t1", subject_id: "subject", name: "Tema 1", sort_order: 0 }, { id: "t2", subject_id: "subject", name: "Tema 2", sort_order: 1 }]);
  if (table === "subtopics") return Response.json(url.searchParams.get("topic_id") === "eq.t2" ? [{ id: "s3", topic_id: "t2", name: "Undertema 3" }] : [{ id: "s1", topic_id: "t1", name: "Undertema 1" }, { id: "s2", topic_id: "t1", name: "Undertema 2" }]);
  if (table === "notes") return Response.json(legacyMode ? [{ ...shared, title: "Undertema 1", content: legacyNote.content }] : [shared]);
  if (table === "note_subtopics" && legacyMode) return Response.json([{ note_id: "note", subtopic_id: "s1" }]);
  if (table === "note_subtopics") return Response.json([{ note_id: "note", subtopic_id: "s1" }, { note_id: "note", subtopic_id: "s2" }]);
  if (table === "topic_introductions") return Response.json({ introduction: "Introduksjon" });
  if (table === "concept_subtopics") {
    if (legacyMode) return Response.json([]);
    if (url.searchParams.has("concept_id")) return Response.json([]);
    const filter = url.searchParams.get("subtopic_id") ?? "";
    return Response.json([...["s1", "s2", "s3"].flatMap((id, i) => filter.includes(id) ? [{ concept_id: ["a", "b", "c"][i] }] : [])]);
  }
  if (table === "concepts") {
    const slug = url.searchParams.get("slug");
    const id = url.searchParams.get("id");
    if (slug || id?.startsWith("eq.")) return Response.json(concepts.find(c => `eq.${c.slug}` === (slug ?? id)));
    return Response.json(id ? concepts.filter(c => id.includes(c.id)) : concepts);
  }
  throw new Error(`Unexpected request ${table}`);
};
const topic = await loadTopicLearning("subject", "t1");
check(topic.content.length === 6 && !topic.content.some(c => c.conceptId === "c"), "Tema inkluderer bare begreper fra egne undertemaer");
const subtopic = await loadTopicLearning("subject", "t1", "s1");
check(subtopic.content.length === 5 && subtopic.content.every(c => c.conceptId === "a"), "Undertema utelukker naboundertema selv i samme notat");
check(!topic.blocks.some(b => b.html.includes("UKLAR TILHØRIGHET")), "Ukoblede bokser arver ikke et helt notats plassering");
check(subtopic.content.every(c => c.noteId === "note" && c.noteSlug === "blandet"), "Kildelenker beholdes");
let rejected = false;
try { await loadTopicLearning("subject", "t1", "s3"); } catch { rejected = true; }
check(rejected, "Avviser undertema med feil foreldretema");
legacyMode = true;
const legacyLearning = await loadTopicLearning("subject", "t1", "s1");
check(legacyLearning.concepts.length === 0 && legacyLearning.sourceContent.length === 5, "Hele leseflyten henter innhold selv med tom concept_subtopics");
check((await loadTopicLearning("subject", "t1", "s2")).sourceContent.length === 0, "Manglende begrepsregister fyller ikke naboundertema");
legacyMode = false;
const presentationInput = structuredClone(legacyLearning.sourceContent);
const beforePresentation = JSON.stringify(presentationInput);
const sections = groupSubtopicContent([], presentationInput);
check(sections.map(section => section.id).join() === "definitions,formulas,methods,examples", "Presentasjon ordner bokstypene i fire læringsseksjoner");
check(sections.find(section => section.id === "methods")?.content.length === 2, "Metoder og teoremer samles uten å endre boksene");
check(JSON.stringify(presentationInput) === beforePresentation && sections[0].content[0] === presentationInput[0], "Presentasjonen endrer verken data eller opprinnelige kildebokser");
check(groupSubtopicContent([], []).length === 0, "Tomme seksjoner utelates");
check(groupSubtopicContent([presentationInput[0]], [presentationInput[0]]).flatMap(section => section.content).length === 1, "Samme kildeboks fra begge visningslister vises én gang");
check(groupSubtopicContent([presentationInput[0]], [{ ...presentationInput[0], contextHtml: '<p>Andre forutsetninger</p>' }])[0].content.length === 2, "Lik boks med annen forklarende kontekst beholdes");
check(groupSubtopicContent([presentationInput[0]], [{ ...presentationInput[0], noteId: "other-source" }])[0].content.length === 2, "Ulike kildenotater slås ikke sammen");
check(sections.at(-1)?.content[0].documentHtml.includes('data-latex="f(n)=n^2"'), "Eksempler beholder innebygde formler fremfor å kopiere dem til formelseksjonen");
document.getElementById('results')!.textContent = `${results.length} tester bestått\n${results.join('\n')}`;
createRoot(document.getElementById('root')!).render(<MemoryRouter initialEntries={["/concepts/a"]}><nav><Link to="/concepts/a">Begrepsside</Link>{" · "}<Link to="/fag/subject/tema/t1">Temaside</Link>{" · "}<Link to="/fag/subject/tema/t1/undertema/s1">Undertema 1</Link>{" · "}<Link to="/fag/subject/tema/t1/undertema/s2">Undertema 2</Link></nav><Routes><Route path="/concepts/:slug" element={<ConceptPage />} /><Route path="/fag/:subjectId/tema/:topicId" element={<TopicPage />} /><Route path="/fag/:subjectId/tema/:topicId/undertema/:subtopicId" element={<SubtopicPage />} /></Routes></MemoryRouter>);
