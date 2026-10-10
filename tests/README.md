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

`/studienotater/tests/subject-structure.html` kjører seks tester med simulerte
API-svar: eksisterende struktur, struktur opprettet under AI-kallet, AI-feil uten
lagring, tydelig feil ved delvis lagring uten sletting, vellykket lagring og tomt
notatutvalg. Backend-testene dekker ugyldige kandidater, strukturfelt, ukjente og
repeterte ID-er, glemte notater og kontrollerte feil fra begge AI-endepunktene.
Se `database/README.md` for valideringsregler og transaksjonsbegrensningene.


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
