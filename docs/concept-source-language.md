# Språk i AI-begreper

## Dagens flyt og årsak

- `knowledgeBaseService.ts` sender notatets tekst, tilgjengelige undertemaer og eksisterende globale begrepsnavn/definisjoner via `conceptExtractionService.ts` til Django `/api/concepts/extract/`.
- `concept_extraction_service.py` ber NTNU-modellen om `name`, `shortDefinition` og `explanation`. Det finnes ingen etterfølgende oversettelse. Teksten fra modellen lagres gjennom `createConcept`.
- Historiske prompter (bl.a. `0375fee`, `fc5001e`) hadde ingen eksplisitt språkregel for forklaringene. Nåværende prompt har en slik regel, men eksisterende canonical-navn prioriteres ved gjenbruk. Engelsk eksisterende kontekst kan dermed videreføres. Valideringen kontrollerte tidligere bare felttyper og undertema-ID-er, ikke om navnet fantes i notatet.
- Kunnskapsbaseflyten bruker `savedByName` og `preserveExisting: true`: gamle beskrivelser blir derfor ikke korrigert ved ny kjøring. Dette beskytter også manuelle endringer.
- De konkrete TMA4240-postene kunne ikke bekreftes via anonym read-only REST: både eksakt navn og priori/posteriori-søk returnerte tomme resultater. Dette beviser ikke at postene mangler; tilgang kan begrense resultatet. Historisk opphav for akkurat disse radene er derfor ikke fastslått.

## Endringen

Nye navn må finnes som en avgrenset term i kildeteksten (Unicode-, mellomrom- og kasusnormalisert). En ny kandidat kan ikke få et oversatt/alternativt `name` som avviker fra `sourceName`. Eksisterende navn kan fortsatt gjenbrukes med en dokumentert kildeterm; ingen eksisterende rad omskrives. Ugyldig svar prøves én gang til og avvises deretter gjennom eksisterende feilhåndtering. Dette er med hensikt konservativt: et implisitt begrep uten eksplisitt navn utelates.

Prompten angir at forklaringer følger språket i det relevante kildeavsnittet, og at gamle beskrivelser/undertemanavn ikke bestemmer språket. Engelske fagtermer som faktisk står i notatet beholdes. Forklaringenes språk styres av prompten; navnevalideringen er ikke en generell språkdetektor eller garanti for modellens formuleringer.

## Trygg opprydding senere (ikke utført)

1. Les med autorisert tilgang og lag en gjennomgangsliste per begreps-ID: lagret navn/tekst, alle undertemakoblinger og kildebokser i HTML og JSON. Begreper er globale; kontroller alle fag som bruker dem. Undersøk også forslag og øvrige referanser før endring.
2. Sammenlign med faktisk kildeterm og kildeavsnitt. Engelsk navn alene beviser ikke feil eller AI-opphav. Marker tvetydige/motstridende kilder for manuell vurdering.
3. Presenter eksplisitte før/etter-forslag og kildebelegg for admin. Ikke generer en generell oversettelse. Behold etablerte engelske termer som brukes i kilden.
4. Etter separat godkjenning: ta sikkerhetskopi og endre kun godkjente tekstfelt med kontroll på forventet gammel verdi. Behold ID og slug, slik at URL-er og koblinger består. Ikke overskriv samtidige/manuelle endringer.
5. Duplikater må behandles separat etter full referansekartlegging. Ingen automatisk sammenslåing, sletting eller flytting av manuelle koblinger.

Ingen Supabase-data, UI, CSS eller migreringer er endret. Testene bruker en mock av modellen og utfører ingen reelle LLM-kall.
