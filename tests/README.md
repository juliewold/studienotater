# Tester av begrepskoblinger

Start `npm run dev` og åpne `/studienotater/tests/callout-concept-linking.html`
på adressen Vite oppgir. Siden kjører mot den faktiske TypeScript-tjenesten med
nettleserens DOMParser og viser antall beståtte tester. Ingen database eller
AI-tjeneste kalles. Testfilen er ikke inngangspunkt i produksjonsbygget.

Dekker feil plassering av ID-er, gjentatte begreper, eksisterende manuelle
koblinger, begrepsnavn, ordgrenser, tvetydige navn, nøstede bokser, manglende JSON,
usamsvar mellom HTML og JSON, uendret originaldata og gjentatt kjøring.

Lagring via Supabase og hele AI-flyten krever separat integrasjonstest med
passende testdata. Den automatiske koblingen lar notatet være uendret når
HTML og JSON ikke kan sammenlignes sikkert.

## Generering og feiltilstander

Åpne `/studienotater/tests/knowledge-base.html` med Vite. Testene bruker
simulerte API-svar og kontrollerer blant annet AI-feil før lagring, bevaring av
manuelle koblinger og forklaringer, feil under lagring, avgrensing til ett notat
og navngitte bokser som AI-en utelater.

Backend-testene kjøres fra roten med:

```sh
backend/.venv/bin/python backend/manage.py test concepts
```

De verifiserer kontrollerte feil fra AI-tjenesten og CORS for 127.0.0.1.

## Neste manuelle kontroll

1. Start frontend med `npm run dev` og backend med `python manage.py runserver`
   fra `backend/` med Python-miljøet aktivert.
2. Logg inn som administrator. Kontroller en begrepsside: «Tilhører» skal åpne
   riktig undertema, og kildelenken skal åpne notatet som inneholder boksen.
3. Når NTNUs AI-tjeneste svarer igjen, prøv generering på ett avgrenset testnotat.
   Generatorens tredje argument kan være `{ noteId: "notatets-id" }`.
4. Kontroller at navngitte bokser får begrepskoblinger, og at eksisterende
   begrepsforklaringer og koblinger er bevart. En ny kjøring skal ikke lage
   duplikater av eksisterende koblinger.

AI-tidsavbrudd stoppet siste komplette integrasjonstest. Databasefilteret,
lagringen og visningen av en eksplisitt navngitt testboks er verifisert separat.
Genereringen bevarer gamle koblinger; utdaterte koblinger må derfor fjernes
manuelt. Lagringsfeil kan fortsatt gi delvise tillegg. Opprettelse av manglende
fagstruktur skjer før begrepsanalysen og er ikke del av samme transaksjon.


## Validering av generert struktur

`/studienotater/tests/subject-structure.html` tester eksisterende struktur som
AI-kontekst, beskyttelse av plasserte/manuelt koblede notater, ett RPC-kall,
samtidige plasseringer, API-/lagringsfeil og tomt notatutvalg. Kjør også
`knowledge-base.html` og `concept-deduplication.html` for begrepsregresjoner.
Backend: `backend/.venv/bin/python backend/manage.py test concepts`.

`psql -v ON_ERROR_STOP=1 -d <tom-testdatabase> -f tests/subject-structure.sql`
krever en **tom, disponibel UTF-8 PostgreSQL-database** og en lokal testadministrator.
Skriptet oppretter fixture-tabeller og RLS-regler; det må aldri kjøres i Supabase
eller en database med eksisterende data. Det laster den faktiske RPC-migrasjonen
og verifiserer gjenbruk, navnededuplisering, idempotens, beskyttelse av primær-/
manuelle koblinger, konsistent ny plassering, RLS og full rollback ved feil.

Se `database/README.md` for migrasjonen som kreves før frontend-deploy.

## Sporadisk ugyldig AI-svar

Backend prøver et nytt AI-svar én gang ved valideringsfeil (to forsøk totalt).
Valideringen svekkes ikke, og loggen viser forsøk og valideringsårsak uten rått
AI-svar eller notattekst. Et fortsatt ugyldig svar får HTTP 502 med den særskilte
koden `invalid_ai_response`. Bare denne feilen gir kontrollert hopping over et
notat i kunnskapsbasegeneratoren. Andre tjeneste-, nettverks- og lagringsfeil
stopper fortsatt kjøringen; SDK-ens eksisterende transport-retries er uendret.

Alle notater analyseres før begreper/koblinger lagres. Bare fullt validerte
notater går videre til lagring. `processedNotes` teller notater som er behandlet
og lagret; `skippedNotes` inkluderer både manglende innhold/undertema og notater
med ugyldige svar etter retry. `failedNotes` identifiserer sistnevnte med ID og
tittel. UI merker resultatet som ufullstendig og viser titlene, også når alle
notater feiler. Ingen automatisk sletting eller overskriving av eksisterende
redaksjonelt innhold innføres. Delvis feil under selve lagringen er fortsatt
ikke atomisk, som dokumentert i `database/README.md`.

Testene dekker ugyldig → gyldig svar, to ugyldige svar, avkortede/tomme svar,
ingen ekstra retries for transportfeil, et feilende notat mellom to vellykkede,
alle notater ugyldige, vanlige skippede notater og andre 502/503-feil.

## Semantisk deduplisering

Åpne `/studienotater/tests/concept-deduplication.html` med Vite. Testene bruker
simulerte AI- og databasesvar og dekker normalisert navnegjenbruk, oversettelser,
separate begreper, callout-kobling, bevaring og kontekst mellom notater.
De verifiserer integrasjonskontrakten, ikke modellens faktiske treffsikkerhet.

Generatoren henter den globale begrepslisten én gang (begreper er globale i dagens
skjema). Navn, type og kort definisjon sendes med hvert eksisterende ekstraksjonskall.
Nye validerte kandidater blir kontekst for neste notat før lagring starter. Ingen
AI-kall per kandidat legges til. Modellen skal gjenbruke canonical-navnet bare ved
samme faglige betydning, og beholde separate navn ved tvil. `sourceName` er et
valgfritt, validert originalnavn brukt lokalt for kobling av notatets bokser.

Normalisert eksakt navn (Unicode NFC, små bokstaver og normaliserte mellomrom)
gjenbrukes deterministisk i generatoren. Lagringens eksisterende slug-oppslag
beholdes, men `preserveExisting` avviser kolliderende slug med forskjellig navn.
Eksisterende begreper og manuelle koblinger slettes ikke, og innhold overskrives
ikke. Gamle semantiske duplikater slås ikke sammen automatisk.

Semantisk identitet er fortsatt en modellvurdering, ikke en garanti. Konteksten
vokser med kunnskapsbasen; ved svært store baser bør en senere løsning velge
relevant kontekst uten å kutte listen vilkårlig. Denne endringen innfører ingen
ny tabell, aliasregister eller transaksjon, og endrer ikke eksisterende retry-policy.

## AI note summaries

Run `backend/.venv/bin/python backend/manage.py test concepts` and open
`/studienotater/tests/note-summary.html` with Vite for request/response tests.
`note-summary-preview.html` is an isolated UI fixture with simulated responses
and a service-failure toggle; it never calls the real AI or writes to the database.

Admins see “Oppsummer notatet” with the existing AI tools when reading a saved
note. Only that note's plain text is sent to `/api/concepts/summarize-note/`.
Summaries are temporary, displayed as escaped text, and reset when the note
or its saved content changes. Requests are cancelled on unmount. A failed
regeneration retains the previous summary with an error message.
The endpoint follows the existing Django AI endpoint/access patterns; the
admin visibility check lives in EditableNote, as for flashcard generation.
Strict JSON/summary validation retries once; provider errors use controlled
502/503 responses. Tests mock the model and do not measure factual accuracy.

## Compact note AI tools and selected-text explanations

The admin reading view groups summaries, flashcards and selected-text explanations
in “AI-verktøy”. Existing summary and flashcard components are reused. Selections
must start and end inside the rendered note. The captured excerpt is previewed
before sending and remains available when focus moves to the tools. A new
selection replaces it; “Fjern valgt tekst” clears it. Explanations display their
own source excerpt, so a later selection cannot relabel an earlier result.
Changing the note/content resets the tools and aborts an active explanation.

`/api/concepts/explain-selection/` accepts only the excerpt as `text` (1–10,000
characters); no whole-note context is sent. It uses the existing NTNU client,
strict output validation, one validation retry and controlled provider errors.
The prompt requests simpler wording without guessing missing context. Results
are temporary escaped text. Access follows the existing admin UI/AI endpoint
pattern; no new authentication or persistence mechanism is introduced.

Run `backend/.venv/bin/python backend/manage.py test concepts` and open
`tests/selected-text.html` and `tests/note-summary.html` under the Vite base URL.
`tests/note-ai-tools-preview.html` is an isolated mocked UI check: choose the test
excerpt, expand “Forklar markert tekst”, and request an explanation. The fixture
rejects a request containing anything except the exact selected excerpt.

## Read-only note layout

Open `tests/note-reading-preview.html` under the Vite base URL. This isolated
fixture mocks fetch and never writes notes or calls AI. Check at desktop and
mobile widths: duplicate heading labels have separate anchors, outline links
focus their headings below the navbar, the desktop outline stays visible while
scrolling, and Previous/Next and study controls scroll with the document.
The mobile outline can be collapsed. Check that Rediger keeps the same document grid
and compact progress controls. Live progress persistence and AI responses
still require authenticated integration testing.

## Compact note editor

Open `tests/note-editor-preview.html` under the Vite base URL and choose Rediger.
All requests are intercepted: autosave and multi-subtopic links are stored in
memory, and the checkbox simulates a save failure. No requests reach the database,
image storage or AI. Check title autosave, both subtopic checkboxes, formatting
and its active state, table insertion/row/column actions, undo/redo, content boxes,
and Done returning to the reader. A failed save must retain the editable draft;
uncheck the failure toggle and retry Done to recover. Check at 1280px and 390px.
The formula dialog is unchanged; its existing entry points remain available in
Sett inn and through shortcuts/slash commands. Real image uploads and concept/AI
services still require authenticated integration testing.


The reader and editor now share `NoteDocument`: title and content columns align,
and both use the same responsive outline. While editing, rename a heading,
change its level, create duplicate labels, remove headings, and undo. The outline
must update immediately with distinct working anchors; clicking one places the
cursor in its heading below the navbar/toolbar. Removing all headings hides the
outline without hiding the editor. Done must display the saved headings in the
reader. Heading anchors are view decorations, not persisted note content.

## LaTeX symbols and templates

Open `tests/math-dialog.html` under the Vite base URL. It runs 105 checks:
all 101 symbols/templates render in KaTeX, editable fields select the correct
placeholder, insertion preserves surrounding text, selection replacement and
nested templates work, and Greek commands do not merge with following letters.
The fixture needs no backend and offers empty/existing-formula dialogs.

Browser checks: insert a fraction and type over its selected numerator; switch
categories and insert a matrix using keyboard Enter; confirm Enter on a template
does not submit the dialog, while Enter in the LaTeX input does. Invalid LaTeX
must disable submission. Close/reopen an existing formula and check its preview.
Check a 390px mobile viewport and both inline/block entry points in the editor.
Templates are organized into eight categories; existing set/logic shortcuts
remain available. No note persistence or formula rendering format is changed.

## PDF summary outline navigation

Open `tests/pdf-summary-navigation.html` under the Vite base URL. The fixture
uses the real PDF summary modal and note components with mocked backend requests.
It renders identical section labels in a background note and the modal to check
that navigation targets the correct document.

At desktop and mobile widths, open the summary and click or keyboard-activate
Del 5, then an earlier section. Only the modal should scroll; its active outline
entry should follow manual scrolling too. Repeat after Rediger: the cursor must
land in the selected heading below the sticky toolbar. Close the modal and check
that the background note still scrolls normally. Closing/reopening must reset
the summary and must not leave scroll listeners on the removed dialog. No PDF
loading, summary design, editing, or save behavior is changed by this fix.

## Appnavigasjon og forside

Åpne `/studienotater/tests/app-layout.html` med Vite. Alle nettverkskall
avskjæres; fagvalg og utlogging påvirker bare testvisningen.

- Kontroller hovedlenkene og de tre sammenleggbare seksjonene.
- Velg/fjern fag under Semesterstart og sjekk at Mine fag oppdateres direkte.
- Kontroller lys/mørk modus i topplinjen og Innstillinger, også etter omlasting.
- Ved mobilbredde: åpne navigasjon, bruk Tab/Escape og velg en side.
  Fokus skal holdes i dialogen og returneres til åpneknappen ved lukking.
- Logg ut og kontroller at innlogging/registrering fortsatt er tilgjengelig.
- Med innlogget utviklingskonto: kontroller søk, ukens ressurser, kort/listenes
  fremdrift, «Vis flere», eksamensdatoer og nedtelling uten å endre studiedata.
- Test 390, 768, 1024 og 1440 px; ingen horisontal sidescrolling.

## Mørke flater

Åpne `/studienotater/tests/dark-surfaces.html` med Vite. Testvisningen bruker
samme CSS og notat-/fagkort som appen, uten nettverkskall til studiedata.
Bytt mellom lyst og mørkt tema og kontroller notatkort, tema/undertema,
progresjonsbokser, underordnede kort og søkefelt. Kontroller også hover,
tastaturfokus og at rosa fagaksent og grønne vurderingsstjerner beholdes.
Størrelser og plassering skal være identiske i begge temaer.

## Subject notes sidebar

Open `/studienotater/tests/notes-sidebar.html` with the Vite dev server. This uses
local in-memory fixtures; reads and saves never reach the backend.

Check folder expansion (including empty folders), current folder/note highlights,
direct note switching, unfiled notes, and sidebar collapse. Edit a title and
immediately switch notes: the title must save and update in the sidebar. An empty
title must prevent navigation and preserve the editor. Check light/dark themes,
a narrow desktop and a 390px mobile viewport; the mobile drawer must close after
navigation and with Escape. A different subject route must show no fixture notes.

## Quality of AI structure placement

`backend/.venv/bin/python backend/manage.py test concepts` includes
`test_structure_quality.py`. It checks intentionally shifted batch note IDs,
reversed note order, existing choices omitted by the structure proposal,
protected notes, source quotes from the wrong note, unknown/uncertain choices,
truncated responses, and preservation of complete text/LaTeX when removing HTML.
The mocked tests verify the contract and safeguards, not model accuracy.

Optional live smoke test using **synthetic notes only**, with no database writes
(requires the existing backend LLM configuration):

```sh
backend/.venv/bin/python backend/manage.py shell -c 'from concepts.subject_structure_service import generate_subject_structure; from concepts.test_structure_quality import StructureQualityTests; import json; print(json.dumps(generate_subject_structure("Algoritmer og datastrukturer", StructureQualityTests.notes), ensure_ascii=False))'
```

Check that `id-data` belongs to data structures, `id-reductions` to problem
reductions, and `id-divide` to divide-and-conquer/Merge Sort. Repeat with
`list(reversed(StructureQualityTests.notes))`; classification should not follow
input position. Names/language may vary. This invokes one structure call plus
one classification call per eligible note and does not persist the returned plan.

For UI integration, restart Django and use a disposable subject with new,
unlinked test notes. Existing placed notes remain protected, including old AI
mistakes: generating again deliberately does not repair their placements.
No new Supabase migration is required beyond the existing completion RPC.

## Flashcard generation

- `backend/.venv/bin/python backend/manage.py test concepts --noinput` covers
  content-only prompts, formula preservation, grounding/retry, deduplication,
  stable card IDs, uncertain classifications and notes without existing links.
- Open `http://localhost:5173/studienotater/tests/flashcard-generation.html` on a
  local origin without a signed-in Supabase session. Three service checks run
  automatically; all test requests are mocked. Generate the two fixture cards,
  verify saving is blocked until the second card has a placement, deselect the
  first, edit the second and choose Kø. Save and inspect the displayed mock body:
  only the edited card, `note_id: source-note`, `subtopic_id: queue`.
  Generate again, then click “Bytt testnotat”: the old preview must disappear.
- Run `psql -d <disposable_database> -f tests/flashcard-source.sql` only in an
  empty local test database. It tests migration reruns, old-card preservation,
  source foreign keys and keeping cards when the source note is deleted.

## Folder colors and ordering

- Open `/studienotater/tests/folder-order-unit.html` on localhost (without a
  signed-in Supabase session): six checks cover shared sorting, stable colors,
  appending new folders, loading saved order, RPC scope and save failure events.
- Open `/studienotater/tests/folder-order.html`: an isolated App fixture mocks
  every request and persists mock order only in sessionStorage. Drag a card by
  its handle; compare sidebar and cards, then refresh. Colors must stay with
  folders. Focus a handle and press an arrow key to test keyboard reordering.
  Test dark mode and the mobile notes drawer with the same fixture.
- `psql -d <empty_disposable_database> -f tests/folder-order.sql` verifies the
  migration, reruns, colors, subject scope, incomplete/duplicate lists and atomic
  rollback when RLS permits only part of an order. Requires role authenticated.

## Shared folder permissions

- `/studienotater/tests/folder-admin.html` checks the actual FolderCard and
  SortableFolders components under both roles: reader links/colors remain, menus
  and drag controls appear only for admins (even with enabled=true).
- `/studienotater/tests/folder-order.html?role=user` renders the complete reader
  view with mock data. Verify no create/rename/delete/reorder controls, then open
  a folder. Without the query parameter the fixture uses admin permissions.
- `psql -d <empty_disposable_database> -f tests/folder-admin.sql` needs local
  roles `anon` and `authenticated`. It tests direct CRUD and the sorting RPC,
  preserved reads/colors, admin success, profile-role escalation and migration
  reruns against deliberately permissive legacy policies. Never run this test
  schema against Supabase/production.

## Shared note permissions

- `/studienotater/tests/note-admin.html` checks actual note cards for each role:
  admin-only menu, preserved read links, favorites and read-state display.
- In `/studienotater/tests/folder-order.html?role=user`, open a folder and note:
  no creation/edit/move/delete controls should appear. Reading and the personal
  favorite/read-state controls remain. This fixture never writes real data.
- Run `tests/shared-note-admin.sql` only in an empty disposable PostgreSQL database
  with `anon`/`authenticated` roles. It includes the previous folder/role checks,
  tests direct note CRUD/moving and secondary-link writes under permissive legacy
  RLS, verifies admin operations, and checks personal favorites and progress still
  work. No production schema/data is used.

## Persistent note order

- `/studienotater/tests/note-order-unit.html`: six automated service tests cover
  stored positions, cross-folder Previous/Next sequence, unfiled last, orphan
  fallback, scoped RPC payloads and failed-save notifications.
- `/studienotater/tests/note-order.html`: full App mock fixture, order retained in
  test-only sessionStorage. Reorder notes in Uke 1 and Uten mappe with handles or
  arrow keys, refresh, compare card/sidebar order, and follow Next from the last
  note in Uke 1 through Uke 2 into Uten mappe. Add `?role=user` to check read-only
  controls, or `?fail` to simulate an RPC failure without changing stored order.
- `psql -d <empty_disposable_database> -f tests/note-order.sql`: includes the
  existing folder/note permission suites, then verifies saved order in both kinds
  of groups, scope/duplicate/stale lists, partial-RLS rollback, admin-only RPC and
  direct writes, migration reruns, and append-on-create/move. Never run the test
  fixture in Supabase. The deployment SQL is in database/migrations instead.
- `/studienotater/tests/note-order-drag.html` dispatches synthetic pointer events
  through the actual SortableNotes component, performs real DOM hit testing and
  verifies one correctly scoped save. Native pointer capture is stubbed because
  synthetic events do not create a native active pointer.

## Temasider

Åpne `/studienotater/tests/topic-learning.html` med Vite. Tolv tester kontrollerer
primær-/ekstrakoblinger, avgrensing, duplikater, uttrekk av eksempelbokser og
formler (inkludert nøstet matematikk), kildebevaring, introduksjonslagring og
manglende migrering. Siden bruker kun simulerte nettverkskall. Bytt mellom
leser/admin og light/dark; som admin kan introduksjonen redigeres og lagres.

`tests/topic-introductions.sql` kjøres med `psql -v ON_ERROR_STOP=1 -f ...` i en
**tom disponibel lokal database** med rollene `anon` og `authenticated`.
Testen kjører migreringene og kontrollerer adminlagring, lengdegrense, lesetilgang
og avvisning av vanlige brukeres/anonymes skriving, inkludert direkte upsert.

Kjør `database/migrations/20261014_topic_introductions.sql` manuelt i Supabase
etter `20261013_note_folder_admin.sql`. Den nye tabellen inneholder kun
introduksjoner; eksisterende temaer, koblinger og notater endres ikke.
Uten migreringen vises eksisterende temainnhold sammen med en feilmelding,
og redigering av introduksjon er utilgjengelig.

Manuell kontroll med eksisterende data: TDT4120 → Sorting algorithms. Kontroller
seksjonsrekkefølge, lenker til begreper/undertemaer/notater, og matematikk.
Test lagring/refresh som admin etter migreringen, og lesetilgang uten
redigeringsknapp som vanlig bruker. Eksemplene følger dagens notatplasseringer;
ingen koblinger korrigeres automatisk.

Temasiden viser bare navngitte/begrepskoblede formler og teorembokser i
sammendraget, med duplikater fjernet. Andre uttrykk finnes fortsatt i
kildenotatene. Testene kontrollerer dette utvalget og begrepskonteksten.
Eksempelbokser kan åpnes, og kildelenker er samlet nederst.

### Pensumnavigasjon

`topic-learning.html` inkluderer den faktiske `CurriculumLayout` og to simulerte
temaer. Inngangen `/tema` skal åpne det første temaet i den returnerte
sorteringsrekkefølgen. Bytt fra Sorting algorithms til Data structures: bare
Stacks skal foldes ut. Åpne Stacks, og kontroller at både temaet og undertemaet
er markert. Bytt tilbake til Sorting algorithms → Insertion sort. Sidebaren
skal bli stående, og eksisterende SubtopicPage skal vise begrepslenkene.
Kontroller også light/dark og «Vis temaer» ved mobilbredde. TopicPage skal ikke
lenger ha en egen Undertemaer-seksjon. Fagsiden har et Temaer-ressurskort som
åpner `/fag/:subjectId/tema`, i stedet for den tidligere store temalisten.

## Strukturert innhold i kunnskapsbasen

Åpne `/studienotater/tests/structured-content.html`. Testen bruker simulerte
Supabase-svar og faktisk notatrenderer. Den verifiserer fem innholdstyper,
bevaring av LaTeX/tabeller/lister, kildehenvisninger, nøstede bokser og
filtrering av et forelesningsnotat som inneholder flere undertemaer/temaer.
Lenkene øverst lar deg kontrollere samme innhold på begreps-, tema- og
undertemasiden, inkludert bytte mellom undertemaer.

Innholdsavgrensingen bruker `concept_subtopics` og eksplisitte begreps-ID-er i
notatboksene. Notatets primær-/ekstrakoblinger brukes fortsatt for videre lesing,
men er ikke tilstrekkelig bevis for at alle boksene tilhører samme undertema.
Eldre HTML-bokser kan også kobles ved et entydig lagret begrepsnavn eller en definisjon som begynner med «En **algoritme** er …». Vanlige omtaler, tvetydige navn og eksisterende ID-koblinger overstyres ikke. Dette skjer kun ved lesing, uten databaseendringer. Testen dekker HTML-formatet fra «Forelesning 1 - Algoritmer og kompleksitet», og bevarer inline-lenker til andre begreper.
Visningen endrer ingen lagrede notater, koblinger eller navn.

Kildekoblingen støtter også entydige nummererte overskrifter (inkludert undertitler),
navn inne i bokser og overskriftshierarkiet. En ny overskrift på samme eller høyere
nivå avslutter seksjonen. Dette gjelder alle begreper og bokstyper, ikke en navneliste.
Frittstående formler beholder foregående forklarende avsnitt fra sin seksjon.
Tvetydige navn og vanlige omtaler gir fortsatt ingen kobling.

Manuell kontroll med eksisterende Supabase-data (kun lesing):
- `#/concepts/algoritme`: hele definisjonen og punktlisten fra Forelesning 1.
- `#/concepts/big-o`, `big-omega`, `big-theta`: norske definisjoner og eksempler med LaTeX.
- `#/concepts/de-morgans-lover`: teoremboks fra Logisk ekvivalens.
- `#/concepts/kjoretid`: frittstående formler med norsk kildekontekst.
- Følg «Tilhører» til undertema og videre til tema; kontroller at hovedinnholdet
  bruker kildebokser og at begreper uten kilde vises som korte forklaringer separat.
- Kontroller mobilbredde og lys/mørk modus. Metodebokser dekkes i testfiksturen;
  det undersøkte live-utvalget hadde ingen koblede metodebokser.

Språk: AI-prompten tillot engelske canonical-navn uten å angi språk separat for
forklaringene. `preserveExisting` bevarer tidligere `short_definition`/`explanation`.
Prompten angir nå at nye forklaringer følger notatets språk selv med engelsk navn.
Eksisterende tekster oversettes ikke; kildeinnholdet prioriteres i visningen.

### Eldre kunnskapsbaser uten concept_subtopics

`structured-content.html` tester også notater uten begrepskoblinger. Lesefallbacken
krever én unik plassering samlet fra `notes.subtopic_id` og `note_subtopics`, og
samme normaliserte tittel som undertemaet. Den viser eksisterende kildebokser,
ikke oppdiktede begreper. Brede forelesninger, flere plasseringer, eksplisitt
blokkeierskap og allerede viste begrepsbokser blir ikke overstyrt/duplisert.
Dette er bare leselogikk; det kreves ingen migrering eller databaseoppdatering.

Verifisert med ekte TMA4412-data: «Mengder» hadde null `concept_subtopics`, men
samme undertema i både primærplasseringen og `note_subtopics`. Notatet hadde
17 definisjons-/eksempelbokser uten begreps-ID; disse vises nå med original LaTeX.
Temaoversikten bruker samme kildeutvalg. Tidligere fungerte TDT4120 fordi
begrepskoblingene der var utfylt, mens notatkoblinger bare ga videre-lesing-lenker.

### Undertemasidens seksjonslayout

`structured-content.html` tester presentasjonsgruppering, utelatelse av tomme
seksjoner, stabil rekkefølge og deduplisering av nøyaktig samme boks fra samme
kilde. Ulike kilder eller forskjellig kontekst beholdes. Hele bokser, inkludert
nøstet matematikk, sendes uendret til eksisterende `StructuredConceptContent`.
Bruk «Undertema 1» for alle fire seksjonene og «Undertema 2» for kun eksempler.
Kontroller seksjonslenkene med mus og tastatur; de skal rulle innen siden uten
å endre HashRouter-ruten. Test også 390 px mobilbredde og mørkt tema.
Live-regresjon: TMA4412 → Mengder skal vise 9 definisjonsbokser og 8 eksempler,
uten gjentatt notattittel eller tomme formel-/metodeseksjoner.

### Skrivebeskyttet begrepsgjennomgang

Åpne `/studienotater/tests/concept-review.html`. Testene kontrollerer ordrette forslag, bevaring av engelske kildetermer, tvetydighet, manglende kilder, uendrede objekter/koblinger, paginert lesing, admin-tilgang og at UI-et ikke har skrivehandlinger. Nettverket er mocket og avviser skrivekall.

I appen: Administrer konsepter → «Gjennomgå begreper mot kilder» (`/admin/concepts/review`). Søk etter navn/fag, åpne et begrep og sammenlign førtekst, forslag og original kildeboks. «Alle begreper» inkluderer også begreper uten påviste avvik og uten kilde. Forslag er konservative utdrag, ikke en automatisk semantisk vurdering eller sikker identifikasjon av AI-generert tekst. Ingen LLM-kall, databaseendringer eller migreringer inngår.

### Manuell begrepsopprydding (admin)

Gjennomgangen har nå enkeltvise Behold/Rediger/Slett-handlinger. Tidligere omtale av helt skrivebeskyttet UI gjelder før disse handlingene ble lagt til. Ingen automatisk eller massevis opprydding utføres.

**Kjør `database/migrations/20261020_concept_review_actions.sql` manuelt i Supabase før bruk**, etter migreringen for beskyttede admin-roller (`20261013_note_folder_admin.sql`). Den endrer ingen eksisterende innholdsrader. Restriktive RLS-regler beskytter `concepts` og `concept_subtopics` også mot permissive eldre policyer. RPC-en validerer admin og forventet gammel tekst. ID, slug, type og koblinger beholdes ved redigering.

Sletting krever inntasting av navnet. DB-triggeren avviser sletting når notatenes HTML/JSON/radinnhold inneholder ID eller begreps-URL, eller andre FK-referanser fortsatt finnes. Dette er konservativt og kan blokkere også en ren omtale av ID/URL. Bare `concept_subtopics` ryddes automatisk, atomisk med slettingen. Notater og tema-/undertemastruktur endres aldri. «Behold» gjelder inneværende gjennomgang og skriver ingen data. En vellykket endring laster kildeanalysen på nytt; feil beholder utkastet.

- `/studienotater/tests/concept-review-actions.html`: 11 UI/service-tester med mock-RPC, ingen ekte skriving.
- `/studienotater/tests/concept-review.html`: kilde/status- og tilgangsregresjoner.
- `tests/concept-review-actions.sql`: kjør kun i en tom, disponibel lokal PostgreSQL-database. Tester migration/RLS/RPC, vanlig bruker, anonym bruker, bevarte ID-er/slug/koblinger, konflikt, ugyldig tekst, navnekollisjon, blokkering av notatreferanser/andre FK-er og atomisk opprydding. Skal ikke kjøres mot produksjon.

#### Lazy lasting i gjennomgangen

Listen henter kun begreper og lett pensummetadata. Ingen notattekst, kilderendering eller begrepsanalyse hentes ved første sidevisning. Åpning starter analyse for ett begrep, med lokal loading/feil og «Prøv igjen». Notatgrunnlaget og løste kildekoblinger deles i sidens sesjon; individuelle resultater og samtidige forespørsler caches. Lukk/åpne gjentar ikke analysen. Lagret redigering/sletting ugyldiggjør sesjonen og laster en ny lett indeks.

Kildestatus kan ikke kjennes før analyse uten en ny databaseindeks. Uåpnede begreper merkes derfor «Ikke undersøkt ennå». Eksisterende statusfiltre gjelder undersøkte begreper, med uundersøkte i egen gruppe. Et åpent begrep forblir synlig til det lukkes selv om den nye statusen avviker fra filteret. Fagsøk bruker lette pensumkoblinger fra første lasting. Testfixture `concept-review.html` dekker fravær av tidlige notatlesinger, åpning, cache, samtidige åpninger, retry og eksisterende kilde-/statusregresjoner.

### Redigering og konvertering av matematikk

Åpne `/studienotater/tests/math-editing.html`: tester bruker ekte TipTap-editor med de eksisterende matematikknodene. Dekker kodeblokk → blokk/inline, blokk ↔ inline, erstatning uten duplikater, tekst rundt inline-formler, bevaring av LaTeX inkludert whitespace, begrepskoblinger, HTML-rundtur, undo/redo, utdatert dialog og klikkredigering i faktisk NoteEditor.

Manuelt: sett markøren i en LaTeX-kodeblokk og velg Formelblokk/Formel i tekst. Dialogen viser originalkilden; «Bruk endring» erstatter hele kodeblokken. Klikk en formel for å redigere kilden. Lukk dialogen og bruk motsatt matteknapp for å konvertere valgt formel. Kontroller Angre/Gjør om og last notatet på nytt. Shift+Enter gir linjeskift i kildefeltet; Enter bekrefter som før. Ingen LaTeX blir generert eller trimmet.

### Markert innhold til innholdsboks
Åpne `tests/callout-selection.html`: tester alle fem bokstyper med avsnitt, liste, marks, inline- og blokkmatematikk, delvis utvalg, tomt utvalg og undo. Toolbar-testene kjører den faktiske NoteEditor i StrictMode med kontrollert lagring av HTML.
Bruk `tests/callout-selection.html?manual` for manuell prøve: marker innhold, åpne Innholdsbokser, velg type, og bruk Cmd+Z. Markeringen skal flyttes én gang og formatering/formler skal beholdes.

### Theme consistency
See `tests/theme-audit.md`. Run `node tests/theme-light-regression.mjs` to verify all migrated styles preserve original light colors/layout. Open `tests/theme-consistency.html`, click **Kjør kontrasttester**, and switch between the five representative views and themes. Uses isolated data-free previews; no Supabase writes.
