#!/usr/bin/env node
// Generates natural-sounding narration for the lecture player once, so nobody pays for the
// same audio twice. Each narration text gets a file named by its hash; files that already
// exist are skipped, and only changed texts are generated again.
//
//   node scripts/lecture-audio.mjs --unit 01                        # dry run: characters and estimated cost
//   node scripts/lecture-audio.mjs --unit 01 --provider macos       # free local test with the macOS voice
//   node scripts/lecture-audio.mjs --unit 01 --provider piper       # free and local, Norwegian Piper voice
//   node scripts/lecture-audio.mjs --unit 01 --provider azure --confirm
//   node scripts/lecture-audio.mjs --all --provider elevenlabs --voice <voice-id> --confirm
//
// Keys are read from the environment or .env.local (AZURE_SPEECH_KEY, AZURE_SPEECH_REGION,
// ELEVENLABS_API_KEY) and are never part of the frontend bundle. Paid providers are only
// called with --confirm. Audio goes to public/lecture-audio/<subject>/<unit>/ and the
// manifest the player reads to src/data/curriculum/lectureAudio/<subject>/<unit>.json.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createServer, loadEnv } from "vite";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const option = (name, fallback) => { const index = args.indexOf(`--${name}`); return index >= 0 ? args[index + 1] : fallback; };

const providers = {
  azure: { voice: "nb-NO-PernilleNeural", label: voice => `${voice.replace(/^nb-NO-|Neural$/g, "")} (Azure)`, extension: "mp3", paid: true, usdPerMillion: 16 },
  elevenlabs: { voice: undefined, label: () => "ElevenLabs", extension: "mp3", paid: true, usdPerMillion: 100 },
  macos: { voice: "Nora", label: voice => `${voice} (macOS, test)`, extension: "m4a", paid: false, usdPerMillion: 0 },
  // The model file is read from PIPER_MODEL_DIR (default ~/.local/share/piper), not from the repo.
  piper: { voice: "no_NO-talesyntese-medium", label: () => "Talesyntese (Piper)", extension: "m4a", paid: false, usdPerMillion: 0 },
};
const providerName = option("provider", "azure");
const provider = providers[providerName];
if (!provider) throw new Error(`Ukjent leverandør «${providerName}». Bruk ${Object.keys(providers).join(", ")}.`);
const voice = option("voice", provider.voice);
const subjectId = option("subject", "tdt4120");
const dryRun = flag("dry-run") || (provider.paid && !flag("confirm"));
const env = { ...loadEnv("", root, ""), ...process.env };

// Load the lessons and the lecture builder through Vite, so this uses exactly the code the player runs.
const vite = await createServer({ root, logLevel: "error", server: { middlewareMode: true }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { loadLesson, loadSubjectLessons } = await vite.ssrLoadModule("/src/data/curriculum/lessons/index.ts");
  const { buildLectureScript } = await vite.ssrLoadModule("/src/pages/subjects/curriculum/lecture/lectureScript.ts");
  const { narrationKey, phrases } = await vite.ssrLoadModule("/src/pages/subjects/curriculum/lecture/speechText.ts");
  const units = flag("all") ? (await loadSubjectLessons(subjectId)).map(lesson => lesson.unitId) : [option("unit", "01")];

  let totalCharacters = 0;
  let newCharacters = 0;
  for (const unitId of units) {
    const lesson = await loadLesson(subjectId, unitId);
    if (!lesson) throw new Error(`Fant ikke læringsnotatet ${subjectId}/${unitId}.`);
    // The title only appears in the first scene's heading, not in what is said. Silent steps have no text.
    const texts = [...new Set(buildLectureScript(lesson, "").scenes.flatMap(scene => scene.parts.map(part => part.say)))].filter(text => text.trim());
    const audioDir = join(root, "public", "lecture-audio", subjectId, unitId);
    const manifestPath = join(root, "src", "data", "curriculum", "lectureAudio", subjectId, `${unitId}.json`);
    const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : undefined;
    const sameVoice = previous?.provider === providerName && previous?.voice === voice;
    const files = {};
    const todo = [];
    for (const text of texts) {
      const key = narrationKey(text);
      const file = sameVoice && previous.files[key];
      if (file && existsSync(join(audioDir, file))) files[key] = file;
      else todo.push({ key, text });
    }
    const characters = texts.reduce((sum, text) => sum + text.length, 0);
    const pending = todo.reduce((sum, item) => sum + item.text.length, 0);
    totalCharacters += characters;
    newCharacters += pending;
    console.log(`${subjectId}/${unitId}: ${texts.length} replikker, ${characters} tegn, ${todo.length} må genereres (${pending} tegn).`);
    if (dryRun || !todo.length) continue;

    mkdirSync(audioDir, { recursive: true });
    for (const [index, item] of todo.entries()) {
      const file = `${item.key}.${provider.extension}`;
      const neighbours = { previous: texts[texts.indexOf(item.text) - 1], next: texts[texts.indexOf(item.text) + 1] };
      writeFileSync(join(audioDir, file), await synthesize(item.text, neighbours, phrases));
      files[item.key] = file;
      process.stdout.write(`\r  ${index + 1}/${todo.length}`);
    }
    process.stdout.write("\n");
    if (flag("prune")) for (const file of readdirSync(audioDir)) if (!Object.values(files).includes(file)) rmSync(join(audioDir, file));
    mkdirSync(join(manifestPath, ".."), { recursive: true });
    writeFileSync(manifestPath, `${JSON.stringify({ provider: providerName, voice, label: provider.label(voice), generated: new Date().toISOString().slice(0, 10), files }, null, 2)}\n`);
    console.log(`  Skrev ${manifestPath.replace(`${root}/`, "")}`);
  }

  const cost = (newCharacters / 1e6) * provider.usdPerMillion;
  console.log(`\nTotalt ${totalCharacters} tegn, ${newCharacters} nye. ${provider.paid ? `Anslått pris med ${providerName}: ca. $${cost.toFixed(2)} (før gratiskvote).` : "Gratis (lokal)."}`);
  if (dryRun && provider.paid) console.log("Tørrkjøring: ingen API-kall er gjort. Legg til --confirm for å generere lyd.");
} finally {
  await vite.close();
}

async function synthesize(text, neighbours, phrases) {
  if (providerName === "macos") {
    const aiff = join(tmpdir(), `lecture-${process.pid}.aiff`);
    const out = join(tmpdir(), `lecture-${process.pid}.m4a`);
    // [[slnc N]] inserts the same pauses as the browser narrator.
    const marked = phrases(text).map(phrase => `${phrase.text} [[slnc ${phrase.pause}]]`).join(" ");
    execFileSync("say", ["-v", voice, "-o", aiff, marked]);
    execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "64000", aiff, out]);
    const data = readFileSync(out);
    rmSync(aiff); rmSync(out);
    return data;
  }
  if (providerName === "piper") {
    const model = join(env.PIPER_MODEL_DIR ?? join(homedir(), ".local", "share", "piper"), `${voice}.onnx`);
    if (!existsSync(model)) throw new Error(`Fant ikke Piper-modellen ${model}. Sett PIPER_MODEL_DIR.`);
    const wav = join(tmpdir(), `lecture-${process.pid}.wav`);
    const out = join(tmpdir(), `lecture-${process.pid}.m4a`);
    // Same phrases and pauses as the browser narrator; the Python helper joins them into one WAV.
    execFileSync(env.PIPER_PYTHON ?? "python3", [join(root, "scripts", "piper-speak.py"), model, wav], { input: JSON.stringify(phrases(text)) });
    // 32 kbps mono is clear for speech and halves the size compared with 64 kbps.
    execFileSync("afconvert", ["-f", "m4af", "-d", "aac", "-b", "32000", wav, out]);
    const data = readFileSync(out);
    rmSync(wav); rmSync(out);
    return data;
  }
  if (providerName === "azure") {
    const key = env.AZURE_SPEECH_KEY;
    const region = env.AZURE_SPEECH_REGION;
    if (!key || !region) throw new Error("Mangler AZURE_SPEECH_KEY eller AZURE_SPEECH_REGION.");
    const escape = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const body = phrases(text).map(phrase => `${escape(phrase.text)}<break time="${phrase.pause}ms"/>`).join(" ");
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="nb-NO"><voice name="${voice}"><prosody rate="-4%">${body}</prosody></voice></speak>`;
    return request(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST", body: ssml,
      headers: { "Ocp-Apim-Subscription-Key": key, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3", "User-Agent": "studienotater" },
    });
  }
  const key = env.ELEVENLABS_API_KEY;
  if (!key || !voice) throw new Error("Mangler ELEVENLABS_API_KEY eller --voice <voice-id>.");
  // previous_text/next_text keep the intonation continuous across parts.
  return request(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text, model_id: option("model", "eleven_multilingual_v2"), previous_text: neighbours.previous, next_text: neighbours.next,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, speed: 0.95 },
    }),
  });
}

async function request(url, init) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, init);
    if (response.ok) return Buffer.from(await response.arrayBuffer());
    if (attempt < 3 && (response.status === 429 || response.status >= 500)) { await new Promise(r => setTimeout(r, 2000 * attempt)); continue; }
    throw new Error(`${providerName} svarte ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}
