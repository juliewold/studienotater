import { reviewConcept, buildConceptReviews, readReviewPages, loadConceptReviews, createConceptReviewSession, loadConceptReviewIndex, findConceptTextMatches, findConceptTextWithFallback } from "../src/services/concepts/conceptReviewService";
import type { Concept } from "../src/data/concepts/types";
import type { ConceptContentSource } from "../src/services/concepts/conceptContentService";
import type { DatabaseNote } from "../src/services/notes/notesService";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import { AdminRoute } from "../src/components/auth/AdminRoute/AdminRoute";
import type { User } from "@supabase/supabase-js";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ConceptReviewPage } from "../src/pages/admin/ConceptReviewPage/ConceptReviewPage";
import "../src/index.css";
import "../src/styles/theme.css";
const results: string[] = [];
function check(ok: unknown, name: string) { if (!ok) throw Error(name); results.push(name); }
const concept: Concept = { id: "c", name: "A priori probability", slug: "prior", type: "definition", shortDefinition: "Before observing.", explanation: "A probability before observing.", subjectIds: [], relatedConceptIds: [] };
const html = '<div data-type="callout" data-callout-type="definition" data-concept-id="c" data-concept-name="A priori sannsynlighet"><div class="note-callout-body"><p>Sannsynlighet før observasjonen.</p></div></div>';
const source: ConceptContentSource = { type: "definition", documentHtml: html, html, noteId: "n", noteSlug: "note", noteTitle: "Sannsynlighet", subjectId: "tma4240" };
const snapshot = JSON.stringify({ concept, source });
const review = reviewConcept(concept, [source]);
check(review.proposedName === "A priori sannsynlighet" && review.proposedText === "Sannsynlighet før observasjonen.", "Forslag kommer ordrett fra tilknyttet kilde");
check(JSON.stringify({ concept, source }) === snapshot, "Originale begreper og kilder muteres ikke");
check(!reviewConcept(concept, [{ ...source, documentHtml: html.replace("Sannsynlighet før observasjonen.", "A priori probability brukes før observasjonen.") }]).proposedName, "Engelsk fagterm som faktisk brukes i kilden beholdes");
check(!reviewConcept(concept, [source, { ...source, documentHtml: html.replaceAll("A priori sannsynlighet", "Annet navn").replace("før observasjonen", "med annen betydning") }]).proposedName, "Motstridende kildenavn gir ingen navneanbefaling");
check(reviewConcept(concept, []).status === "missing", "Manglende kilde gir ingen oversettelse");
const note = { id: "n", subjectId: "tma4240", title: "Sannsynlighet", slug: "note", content: html } as DatabaseNote;
check(buildConceptReviews([concept], [note])[0].sources[0].noteId === "n", "Eksisterende eksplisitt kobling bevares");
check(buildConceptReviews([concept], [{ ...note, content: html.replace('data-concept-id="c"', 'data-concept-id="other"') }])[0].sources.length === 0, "Andre begrepers eksplisitte koblinger overtas ikke");
let reads = 0;
check((await readReviewPages(async () => ++reads < 3 ? [reads] : [])).join() === "1,2", "Alle sider leses selv om serveren returnerer korte sider");
let networkReads = 0;
let noteReads = 0;
window.fetch = async (input, init) => {
  if (init?.method && init.method !== "GET") throw Error("Write attempted");
  networkReads++;
  const url = new URL(String(input));
  const table = url.pathname.split("/").at(-1);
  if (Number(url.searchParams.get("offset") ?? 0) > 0) return Response.json([]);
  if (table === "concepts") return Response.json([{ ...concept, short_definition: concept.shortDefinition }, ...["missing", "unlinked", "failed", "textname", "fallbackname"].map(id => ({ ...concept, id, name: id, slug: id, short_definition: concept.shortDefinition }))]);
  if (table === "notes") noteReads++;
  if (table === "concept_subtopics") {
    if (!url.searchParams.get("concept_id")) return Response.json(["missing", "textname", "fallbackname"].flatMap(id => [{ concept_id: id, subtopic_id: "s" }, { concept_id: id, subtopic_id: "s2" }]));
    const id = url.searchParams.get("concept_id");
    if (id === "eq.failed") return Response.json({ message: "Unavailable" }, { status: 500 });
    return Response.json((id === "eq.missing" || id === "eq.textname" || id === "eq.fallbackname") ? [{ subtopic_id: "s" }, { subtopic_id: "s2" }] : []);
  }
  if (table === "subtopics") return Response.json([{ id: "s", topic_id: "t", name: "Sannsynlighet" }, { id: "s2", topic_id: "t2", name: "Mengder" }]);
  if (table === "topics") return Response.json([{ id: "t", subject_id: "tma4240", name: "Statistikk" }, { id: "t2", subject_id: "tma4412", name: "Mengder og relasjoner" }]);
  if (table === "note_subtopics") return Response.json([]);
  if (table === "notes") return Response.json([{ ...note, subject_id: note.subjectId }, { ...note, id: "text-note", slug: "text-note", content: "<p>Her forklares TEXTNAME i et relevant notat.</p>", subject_id: note.subjectId, subtopic_id: "s" }, { ...note, id: "fallback-note", slug: "fallback-note", content: "<p>FALLBACKNAME står i et annet notat i faget.</p>", subject_id: note.subjectId, subtopic_id: "outside" }]);
  throw Error(`Unexpected read ${table}`);
};
const root = createRoot(document.getElementById("root")!);
function renderAccess(user: User | null, isAdmin: boolean, key: string) {
  flushSync(() => root.render(<AuthContext.Provider value={{ user, isAdmin, role: isAdmin ? "admin" : "user", isLoading: false, signOut: async () => {} }}>
    <MemoryRouter key={key} initialEntries={["/review"]}><Routes>
      <Route path="/review" element={<AdminRoute><ConceptReviewPage /></AdminRoute>} />
      <Route path="*" element={<p>Ingen tilgang</p>} />
    </Routes></MemoryRouter></AuthContext.Provider>));
}
renderAccess(null, false, "guest");
await new Promise(resolve => setTimeout(resolve, 0));
check(networkReads === 0 && document.body.textContent?.includes("Ingen tilgang"), "Utlogget bruker starter ingen analyselesing");
renderAccess({ id: "reader" } as User, false, "reader");
await new Promise(resolve => setTimeout(resolve, 0));
check(networkReads === 0, "Vanlig bruker får ingen tilgang eller analyselesing");
renderAccess({ id: "admin" } as User, true, "admin");
await new Promise<void>(resolve => {
  const observer = new MutationObserver(() => {
    if (document.querySelector(".concept-review-item")) { observer.disconnect(); resolve(); }
  });
  observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
});
async function until(predicate: () => unknown) {
  for (let attempt = 0; attempt < 200; attempt++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 10)); }
  throw Error("Timed out waiting for UI");
}
check(noteReads === 0 && !document.querySelector(".concept-review-actions"), "Begrepslisten henter ikke notater eller monterer detaljer før åpning");
const firstRow = document.querySelector<HTMLDetailsElement>(".concept-review-item")!;
firstRow.querySelector<HTMLElement>("summary")!.click();
await until(() => document.querySelector(".structured-source-link"));
check(document.querySelector(".concept-review-actions button"), "Admin får handlinger etter åpning");
check(document.querySelector(".structured-source-link")?.getAttribute("href")?.includes("note"), "Kildeforslaget viser original boks og lenke til notatet");
const readsAfterOpening = noteReads;
firstRow.querySelector<HTMLElement>("summary")!.click();
await until(() => !firstRow.open);
await new Promise(resolve => setTimeout(resolve, 10));
firstRow.querySelector<HTMLElement>("summary")!.click();
await until(() => firstRow.querySelector(".structured-source-link"));
check(noteReads === readsAfterOpening, "Gjenåpning bruker cache uten nye lesinger");
for (const row of document.querySelectorAll<HTMLDetailsElement>(".concept-review-item")) if (!row.open) row.querySelector<HTMLElement>("summary")!.click();
await until(() => document.querySelectorAll(".concept-review-actions").length === 5 && document.querySelector('[role="alert"]'));
const loadedReviews = await loadConceptReviews();
check(loadedReviews.find(item => item.concept.id === "missing")?.contexts?.length === 2, "Manglende kilde beholder koblinger på tvers av fag");
check(loadedReviews.find(item => item.concept.id === "unlinked")?.contexts?.length === 0, "Ingen koblinger rapporteres som tom liste");
check(loadedReviews.find(item => item.concept.id === "failed")?.contextError, "Lesefeil skilles fra foreldreløse begreper");
const filter = document.querySelector<HTMLSelectElement>(".concept-review select")!;
flushSync(() => { filter.value = "missing"; filter.dispatchEvent(new Event("change", { bubbles: true })); });
check(document.querySelectorAll(".concept-review-missing").length === 2, "Undersøkte begreper uten kilde har tydelig merking");
await until(() => document.querySelectorAll(".concept-review-missing").length >= 2);
const missingItem = [...document.querySelectorAll<HTMLDetailsElement>(".concept-review-item")].find(item => item.querySelector("summary")?.textContent?.startsWith("missing"))!;
missingItem.querySelector<HTMLElement>("summary")!.click();
await until(() => missingItem.querySelector("section"));
check(missingItem.textContent?.includes("TMA4240") && missingItem.textContent?.includes("Mengder og relasjoner") && missingItem.querySelectorAll('section a').length === 6, "Viser fag, tema og undertema med navigerbare lenker");
check(loadedReviews.find(item => item.concept.id === "failed")?.contextError, "Feilet lesing klassifiseres ikke som manglende kilde");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

const textNote = { ...note, subtopicId: "s", content: "<p>Vi bruker <strong>A priori</strong> probability her.</p>" };
const scope = [{ subjectId: "tma4240", subtopicId: "s" }];
check(findConceptTextMatches(concept.name, [textNote], [], scope).length === 1, "Navn finnes på tvers av inline-formattering");
check(findConceptTextMatches("PRIOR", [{ ...textNote, content: "<p>prioritet</p>" }], [], scope).length === 0, "Delord regnes ikke som treff");
check(findConceptTextMatches(concept.name, [{ ...textNote, subtopicId: "other" }], [], scope).length === 0, "Notater utenfor temaet utelates");
check(findConceptTextMatches(concept.name, [{ ...textNote, subjectId: "other" }], [], scope).length === 0, "Andre fag utelates selv ved lik undertema-ID");
check(findConceptTextMatches(concept.name, [{ ...textNote, subtopicId: null }], [{ noteId: note.id, subtopicId: "s" }], scope).length === 1, "Ekstrakoblinger gir relevant notat");
check(findConceptTextMatches("A priori sannsynlighet", [textNote], [], scope).length === 0, "Søket finner ikke på oversettelser");
check(loadedReviews.find(item => item.concept.id === "textname")?.status === "text", "Treff klassifiseres separat fra ingen kilde");
flushSync(() => { filter.value = "text"; filter.dispatchEvent(new Event("change", { bubbles: true })); });
const textItem = document.querySelector<HTMLDetailsElement>(".concept-review-item")!;
textItem.querySelector<HTMLElement>("summary")!.click();
await until(() => textItem.querySelector("blockquote"));
check(textItem.textContent?.includes("Finnes i tilknyttet notat") && textItem.querySelector("blockquote")?.textContent?.includes("TEXTNAME") && textItem.querySelector('a[href*="text-note"]'), "UI viser kildeutdrag og lenke til notat");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

const unrelatedPlacement = { ...textNote, id: "other-placement", subtopicId: "other", slug: "other-placement" };
check(findConceptTextWithFallback(concept.name, [unrelatedPlacement], [], scope, ["tma4240"]).status === "subject-text", "Søker i hele tilknyttet fag når lokalt søk ikke gir treff");
check(findConceptTextWithFallback(concept.name, [{ ...unrelatedPlacement, subtopicId: null }], [], scope, ["tma4240"]).textMatches.length === 1, "Reservesøk inkluderer notater uten mappe/undertema");
const preferred = findConceptTextWithFallback(concept.name, [textNote, unrelatedPlacement], [], scope, ["tma4240"]);
check(preferred.status === "text" && preferred.textMatches.length === 1 && preferred.textMatches[0].noteId === textNote.id, "Tilknyttede treff prioriteres uten ekstra fagtreff");
check(findConceptTextWithFallback(concept.name, [{ ...unrelatedPlacement, subjectId: "another" }], [], scope, ["tma4240"]).status === "missing", "Reservesøk lekker ikke til andre fag");
check(findConceptTextWithFallback(concept.name, [unrelatedPlacement], [], [], []).textMatches.length === 0, "Ingen fagkobling utløser ikke globalt søk");
check(findConceptTextWithFallback("Ikke nevnt", [textNote, unrelatedPlacement], [], scope, ["tma4240"]).status === "missing", "Ingen treff i hele faget gir manglende kilde");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

flushSync(() => { filter.value = "subject-text"; filter.dispatchEvent(new Event("change", { bubbles: true })); });
const fallbackItem = document.querySelector<HTMLDetailsElement>(".concept-review-item")!;
fallbackItem.querySelector<HTMLElement>("summary")!.click();
await until(() => fallbackItem.querySelector("blockquote"));
check(fallbackItem.textContent?.includes("Finnes i annet notat i faget") && fallbackItem.querySelector("blockquote")?.textContent?.includes("FALLBACKNAME") && fallbackItem.querySelector('a[href*="fallback-note"]'), "Reservesøk viser egen status, riktig utdrag og notatlenke i UI");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;

const beforeIndex = noteReads;
const lazyIndex = await loadConceptReviewIndex();
check(noteReads === beforeIndex && lazyIndex.find(item => item.concept.id === "missing")?.contexts.length === 2, "Lett indeks beholder fagsøk uten notatlesing");
const cacheSession = createConceptReviewSession(lazyIndex.map(item => item.concept));
const firstPromise = cacheSession.load(concept);
check(firstPromise === cacheSession.load(concept), "Parallelle åpninger deler samme forespørsel");
await firstPromise;
check(await cacheSession.load(concept) === await firstPromise, "Fullførte detaljer caches i samme sesjon");
const failedConcept = lazyIndex.find(item => item.concept.id === "failed")!.concept;
const failPromise = cacheSession.load(failedConcept);
await failPromise.catch(() => undefined);
const retryPromise = cacheSession.load(failedConcept);
check(failPromise !== retryPromise, "Feilede detaljer kan prøves på nytt");
await retryPromise.catch(() => undefined);
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
const editedConcept = { ...concept, name: "Manuelt endret" };
const refreshedSession = createConceptReviewSession(lazyIndex.map(item => item.concept.id === concept.id ? editedConcept : item.concept));
check((await refreshedSession.load(editedConcept)).concept.name === "Manuelt endret", "Ny sesjon etter endring bruker oppdatert begrep, ikke gammel cache");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
