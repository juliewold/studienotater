# Opplesning i forelesningsavspilleren

Avspilleren har to kilder til stemme:

1. **Ferdiginnlest AI-lyd.** Den genereres én gang per replikk og serveres som statiske filer. Dette er standard når lyden finnes.
2. **Nettleserens stemmer.** De er gratis og brukes som fallback. Brukeren kan velge stemme og forhåndslytte i avspilleren (lydbølge-knappen).

Lyden synkroniseres med animasjonene på samme måte for begge kildene. Hver replikk hører til ett steg, og neste steg starter først når lyden er ferdig.

## Hvordan lyd unngår å bli generert på nytt

Hver replikk får en nøkkel, som er en hash av den eksakte teksten (`narrationKey` i `speechText.ts`).

- Filen heter `<nøkkel>.mp3`.
- `src/data/curriculum/lectureAudio/<fag>/<tema>.json` peker fra nøkkel til fil.
- En ny kjøring genererer bare replikker som mangler. Endres en tekst, genereres bare den replikken.
- Til den er generert, leser nettleserstemmen den.

Lydfilene ligger i `public/lecture-audio/` og publiseres med GitHub Pages. De hentes aldri fra Supabase. `VITE_LECTURE_AUDIO_URL` kan peke til en annen statisk vert, for eksempel Cloudflare R2.

## Generere lyd

```sh
node scripts/lecture-audio.mjs --all                           # tørrkjøring: antall tegn og anslått pris, ingen API-kall
node scripts/lecture-audio.mjs --unit 01 --provider macos      # gratis lokal test av hele kjeden
node scripts/lecture-audio.mjs --unit 01 --provider azure --confirm
```

Nøklene leses fra miljøet eller `.env.local`. Bruk aldri `VITE_`-prefiks på dem, ellers havner de i frontend.

- `AZURE_SPEECH_KEY` og `AZURE_SPEECH_REGION`. Standardstemmen er `nb-NO-PernilleNeural`; endre den med `--voice nb-NO-FinnNeural` eller `--voice nb-NO-IselinNeural`.
- `ELEVENLABS_API_KEY` sammen med `--voice <voice-id>`. Modellen er `eleven_multilingual_v2`; endre den med `--model`.

Betalte leverandører kalles bare med `--confirm`. `--prune` sletter lydfiler som ikke lenger brukes.

## Uttale for nettleserstemmer

`browserPronunciation` i `speechText.ts` er et lite uttaleleksikon, for eksempel «key» → «ki». Det brukes bare av nettleserstemmene. AI-stemmene får teksten uendret.
