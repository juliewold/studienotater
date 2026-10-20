import { act } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AuthContext } from "../src/context/AuthContext/AuthContext";
import { ConceptReviewActions } from "../src/pages/admin/ConceptReviewPage/ConceptReviewActions";
import type { Concept } from "../src/data/concepts/types";
const concept: Concept = { id: "c", name: "Old", slug: "stable", type: "definition", shortDefinition: "Definition", explanation: "Explanation", subjectIds: [], relatedConceptIds: [] };
const results: string[] = [];
function check(ok: unknown, label: string) { if (!ok) throw Error(label); results.push(label); }
const root = createRoot(document.getElementById("root")!);
const writes: Record<string, unknown>[] = [];
let fail = false;
let changed: unknown;
window.fetch = async (_input, init) => {
  writes.push(JSON.parse(String(init?.body)));
  return fail ? Response.json({ message: "Begrepet refereres fra notatdata" }, { status: 400 }) : new Response(null, { status: 204 });
};
function render(admin: boolean, key: string) { flushSync(() => root.render(<AuthContext.Provider value={{ user: null, role: admin ? "admin" : "user", isAdmin: admin, isLoading: false, signOut: async () => {} }}><ConceptReviewActions key={key} concept={concept} onChange={value => { changed = value; }} /></AuthContext.Provider>)); }
function click(label: string) { const button = [...document.querySelectorAll('button')].find(item => item.textContent === label)!; flushSync(() => button.click()); }
function input(value: string) {
  const field = document.querySelector('input')!;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value);
  flushSync(() => field.dispatchEvent(new Event('input', { bubbles: true })));
}
async function settle() { await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); }); }
render(false, 'reader');
check(document.querySelectorAll('button').length === 0, 'Vanlig bruker får ingen handlinger');
render(true, 'admin');
click('Behold'); check(writes.length === 0 && document.body.textContent?.includes('Beholdt uten endringer'), 'Behold skriver ingen data');
click('Rediger'); input('New'); click('Lagre endringer'); await settle();
check(writes[0].p_action === 'edit' && (writes[0].p_values as { name: string }).name === 'New' && writes[0].p_id === 'c', 'Redigering sender felter for samme ID');
check((writes[0].p_expected as { name: string }).name === 'Old' && !('slug' in (writes[0].p_values as object)), 'Optimistisk konfliktkontroll og uendret slug');
render(true, 'cancel'); click('Slett');
check(document.querySelector<HTMLButtonElement>('form button')!.disabled, 'Sletting krever bekreftelse');
input('wrong'); check(document.querySelector<HTMLButtonElement>('form button')!.disabled, 'Feil navn kan ikke bekrefte');
click('Avbryt'); check(writes.length === 1, 'Avbrutt sletting skriver ikke');
click('Slett'); input('Old'); fail = true; click('Bekreft sletting'); await settle();
check(document.body.textContent?.includes('refereres fra notatdata'), 'Slettefeil vises og skjema beholdes');
check(document.querySelector('form'), 'Feil lukker ikke vurderingen');
fail = false; click('Bekreft sletting'); await settle();
check(changed === null && writes.at(-1)?.p_action === 'delete', 'Bekreftet sletting sendes enkeltvis');
render(true, 'edit-error'); click('Rediger'); fail = true; input('Draft'); click('Lagre endringer'); await settle();
check(document.querySelector<HTMLInputElement>('input')?.value === 'Draft', 'Redigeringsutkast bevares ved feil');
document.getElementById('results')!.textContent = `${results.length} tester bestått\n${results.join('\n')}`;
