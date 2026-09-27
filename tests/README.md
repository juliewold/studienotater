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
