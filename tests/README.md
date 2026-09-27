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

Åpne `/studienotater/tests/knowledge-base.html` med Vite. De sju testene bruker
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
