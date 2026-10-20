import { reviewConcept, buildConceptReviews, readReviewPages } from "../src/services/concepts/conceptReviewService";
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
window.fetch = async (input, init) => {
  if (init?.method && init.method !== "GET") throw Error("Write attempted");
  networkReads++;
  const url = new URL(String(input));
  const table = url.pathname.split("/").at(-1);
  if (Number(url.searchParams.get("offset") ?? 0) > 0) return Response.json([]);
  if (table === "concepts") return Response.json([{ ...concept, short_definition: concept.shortDefinition }]);
  if (table === "notes") return Response.json([{ ...note, subject_id: note.subjectId }]);
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
check(!document.querySelector(".concept-review button, .concept-review form"), "Forhåndsvisningen har ingen lagre-, slette- eller sammenslåingskontroller");
document.querySelector<HTMLElement>(".concept-review-item summary")!.click();
check(document.querySelector(".structured-source-link")?.getAttribute("href")?.includes("note"), "Kildeforslaget viser original boks og lenke til notatet");
document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`;
