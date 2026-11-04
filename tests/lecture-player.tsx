import { createRoot } from "react-dom/client";
import { act, useState } from "react";
import { loadLesson, loadSubjectLessons } from "../src/data/curriculum/lessons";
import type { Lesson, LessonBlock } from "../src/data/curriculum/lessons/types";
import { buildLectureScript, countSteps, type LecturePart } from "../src/pages/subjects/curriculum/lecture/lectureScript";
import { figureParts } from "../src/data/curriculum/lessons/reveal";
import { browserPronunciation, chunkText, codeToSpeech, latexToSpeech, narrationKey, phrases, splitSentences, toSpeech } from "../src/pages/subjects/curriculum/lecture/speechText";
import { narrate } from "../src/pages/subjects/curriculum/lecture/narrator";
import { recordingUrl } from "../src/pages/subjects/curriculum/lecture/recordings";
import { traceInsertionSort } from "../src/pages/subjects/curriculum/lecture/animations/insertionSort";
import { traceBfs } from "../src/pages/subjects/curriculum/lecture/animations/bfs";
import { traceDfs } from "../src/pages/subjects/curriculum/lecture/animations/dfs";
import { traceDijkstra } from "../src/pages/subjects/curriculum/lecture/animations/dijkstra";
import LecturePlayer from "../src/pages/subjects/curriculum/lecture/LecturePlayer";
import "../src/index.css";
import "../src/styles/global.css";
import "../src/styles/theme.css";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const results: string[] = [];
function check(condition: unknown, name: string) { if (!condition) throw new Error(name); results.push(`✓ ${name}`); }
const report = () => { document.getElementById("results")!.textContent = `${results.length} tester bestått\n${results.join("\n")}`; };
const waitFor = (predicate: () => boolean, ms = 4000) => new Promise<void>((resolve, reject) => {
  const started = performance.now();
  const tick = () => predicate() ? resolve() : performance.now() - started > ms ? reject(new Error("Tidsavbrudd")) : setTimeout(tick, 20);
  tick();
});
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

try {
  // --- Speech text ---------------------------------------------------------------
  check(latexToSpeech("n^2") === "n i andre" && latexToSpeech("2^n") === "2 opphøyd i n", "Potenser leses som ord");
  check(latexToSpeech("\\Theta(n^2)") === "theta av n i andre", "Θ(n²) leses «theta av n i andre»");
  check(latexToSpeech("O(g(n))") === "stor O av g av n" && latexToSpeech("f = o(g)") === "f er lik lille o av g", "Stor og lille O skilles");
  check(latexToSpeech("\\frac{n(n-1)}{2}") === "n av n minus 1 delt på 2", "Brøker leses som «delt på»");
  check(latexToSpeech("A[1:i-1]") === "A fra 1 til i minus 1" && latexToSpeech("A[j] > key") === "A på plass j er større enn key", "Tabellintervaller og indekser leses «fra … til» og «på plass»");
  check(latexToSpeech("\\sum_{i=1}^{n} i") === "summen fra i er lik 1 til n av i", "Summer med grenser");
  check(latexToSpeech("T_{\\text{worst}}(n) = \\max_{|I| = n} T(I)") === "T worst av n er lik maksimum over størrelsen av I er lik n av T av I", "Indekser, tekst og maksimum");
  check(toSpeech("**Insertion-Sort** er $\\Theta(n^2)$ **(A8)**.") === "Insertion Sort er theta av n i andre.", "Fet skrift og læringsmålkoder fjernes, algoritmenavn sies som ord");
  check(codeToSpeech("while j > 0 and A[j] > key") === "så lenge j er større enn 0 og A på plass j er større enn key"
    && codeToSpeech("for i = 2 to n") === "for i fra 2 til n" && codeToSpeech("A[j + 1] = A[j]") === "A på plass j pluss 1 settes til A på plass j", "Pseudokode leses som en foreleser sier den");
  check(toSpeech("Ca. 5, f.eks. dvs. ingen.") === "Cirka 5, for eksempel det vil si ingen.", "Forkortelser skrives ut");
  const spokenPhrases = phrases("Først dette. Så en lang setning med mange ledd: første del av forklaringen, andre del av forklaringen, tredje del av forklaringen; og en avslutning som er lang nok til å telle med her.");
  check(spokenPhrases.length >= 3 && spokenPhrases[0].pause > spokenPhrases[1].pause && spokenPhrases.at(-1)!.text.endsWith("her."), "Naturlige pauser: lengre etter punktum, kortere ved kolon og komma");
  check(browserPronunciation("key og Heapsort") === "ki og hipsort" && toSpeech("$key$") === "key", "Uttaleleksikon gjelder bare nettleserstemmer");
  check(narrationKey("Hei") === narrationKey("Hei") && narrationKey("Hei") !== narrationKey("Hei.") && /^[0-9a-z]+$/.test(narrationKey("Hei")), "Stabil lydnøkkel per replikk");
  const manifest = { provider: "azure", voice: "nb-NO-PernilleNeural", label: "Pernille", generated: "2026-11-03", files: { [narrationKey("Hei.")]: "a.mp3" } };
  check(recordingUrl(manifest, "tdt4120", "01", "Hei.")?.endsWith("/lecture-audio/tdt4120/01/a.mp3") && recordingUrl(manifest, "tdt4120", "01", "Endret.") === undefined, "Bare uendret tekst bruker ferdiginnlest lyd");
  check(splitSentences("Velg $c = 1.5$. Da er f.eks. $n = 2$ nok. Slutt.").length === 3, "Setninger deles ikke inne i matematikk eller forkortelser");
  check(chunkText("En. To. Tre.", 8).length === 2 && chunkText("Kort.").length === 1, "Lange avsnitt deles i korte biter");

  // --- Script for every lesson ---------------------------------------------------
  const lessons = await loadSubjectLessons("tdt4120");
  check(lessons.length >= 7, "Alle læringsnotater for TDT4120 lastes");
  for (const lesson of lessons) {
    const script = buildLectureScript(lesson, lesson.unitId);
    const parts = script.scenes.flatMap(scene => scene.parts);
    // Silent steps (figure and formula steps without a sentence) are the only parts without speech.
    const spoken = parts.filter(part => part.kind !== "visual" || part.say.trim()).map(part => part.say);
    const raw = spoken.filter(text => /[\\$]|[_^]\{|[{}]/.test(text) || !text.trim());
    check(!raw.length, `Forelesning ${lesson.unitId}: ingen rå LaTeX eller tomme replikker${raw.length ? `\n  ${raw.join("\n  ")}` : ""}`);
    const shown = JSON.stringify(script.scenes);
    const missing = leaves(lesson).find(leaf => !shown.includes(JSON.stringify(leaf).slice(1, -1)));
    check(!missing, `Forelesning ${lesson.unitId}: alt faginnhold er med${missing ? ` (mangler ${missing.slice(0, 60)})` : ""}`);
    const long = script.scenes.filter(scene => scene.kind !== "animation" && !scene.table && scene.parts.length > 8);
    check(!long.length && script.chapters.length === lesson.sections.length + 2, `Forelesning ${lesson.unitId}: korte scener og én del per avsnitt${long.map(scene => ` (${scene.heading}: ${scene.parts.length} deler)`).join("")}`);
  }

  // --- Figures, code and derivations built up step by step -----------------------
  for (const lesson of lessons) {
    const scenes = buildLectureScript(lesson, lesson.unitId).scenes;
    const builds = new Map<LessonBlock, LecturePart[]>();
    scenes.flatMap(scene => scene.parts).forEach(part => {
      if (part.kind === "visual") builds.set(part.source, [...(builds.get(part.source) ?? []), part]);
    });
    const bad = [...builds].filter(([source, steps]) => {
      const reveals = steps.map(step => step.kind === "visual" ? step.reveal : 0);
      const total = source.type === "figure" ? figureParts(source.component) : source.type === "pseudocode" ? source.lines.length : Infinity;
      const ordered = reveals.every((reveal, index) => index === 0 || reveal >= reveals[index - 1]);
      return !ordered || steps.length < 2 || reveals.at(-1) !== total;
    });
    check(!bad.length, `Forelesning ${lesson.unitId}: figurer og kode bygges opp i stigende steg til alt er synlig`);
    const spokenSteps = [...builds.values()].map(steps => steps.map(step => step.say).filter(Boolean).join(" "));
    const captions = lesson.sections.flatMap(section => section.blocks.filter(block => block.type === "figure")).map(block => block.type === "figure" ? block.caption : "");
    check(captions.every(caption => splitSentences(toSpeech(caption)).every(sentence => spokenSteps.some(text => text.includes(sentence)))),
      `Forelesning ${lesson.unitId}: hver setning i figurteksten leses én gang, mens figuren bygges opp`);
  }
  const unit03 = (await loadLesson("tdt4120", "03"))!;
  const derivation = unit03.sections.flatMap(section => section.blocks).find(block => block.type === "formula" && block.latex.includes("aligned"));
  const derivationSteps = derivation ? buildLectureScript(unit03, "03").scenes.flatMap(scene => scene.parts).filter(part => part.kind === "visual" && part.source === derivation) : [];
  const finalStep = derivationSteps.at(-1);
  check(derivationSteps.length >= 2 && finalStep?.kind === "visual" && finalStep.block.type === "formula" && finalStep.block.latex === (derivation as { latex: string }).latex,
    "Utregninger vises linje for linje, og siste steg er hele formelen");

  // --- Graph algorithms step by step --------------------------------------------
  const bfs = traceBfs();
  const bfsEnd = bfs.at(-1)!;
  const expectedD = { 1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: Infinity } as Record<string, number>;
  check(Object.entries(expectedD).every(([u, value]) => bfsEnd.d[u] === value) && bfsEnd.pi["8"] === "6" && bfsEnd.pi["9"] === undefined,
    "BFS fra node 1 gir de samme avstandene og forgjengerne som figuren, og node 9 nås ikke");
  check(bfs.every(frame => {
    const distances = frame.queue.map(u => frame.d[u]);
    return distances.every((value, index) => index === 0 || value >= distances[index - 1]) && new Set(distances).size <= 2;
  }), "BFS-køen er alltid sortert etter avstand, og inneholder høyst to ulike avstander");
  check(bfs.filter(frame => frame.line === 10).length === 8 && bfs.filter(frame => frame.line === 17).length === 8,
    "BFS tar ut hver av de åtte nåbare nodene nøyaktig én gang");

  const dfs = traceDfs();
  const dfsEnd = dfs.at(-1)!;
  const intervals = Object.keys(dfsEnd.d).map(u => [dfsEnd.d[u], dfsEnd.f[u]] as const);
  check(intervals.length === 9 && intervals.every(([d, f]) => d < f) && new Set(intervals.flat()).size === 18
    && intervals.every(([d1, f1]) => intervals.every(([d2, f2]) => (d1 > d2 && f1 < f2) || (d2 > d1 && f2 < f1) || f1 < d2 || f2 < d1 || (d1 === d2 && f1 === f2))),
  "DFS gir et sammenhengende parentesuttrykk: intervallene er nøstet eller disjunkte");
  check(dfs.every(frame => frame.stack.every(u => frame.color[u] === "gray")) && dfsEnd.stack.length === 0 && dfs.some(frame => frame.kind === "tilbake"),
    "DFS-kallstakken inneholder bare grå noder, er tom til slutt, og finner minst én tilbakekant");
  check(dfs.filter(frame => frame.line === 2).length === 9 && dfs.filter(frame => frame.line === 9).length === 9,
    "DFS besøker og fullfører hver av de ni nodene nøyaktig én gang");

  const dijkstra = traceDijkstra();
  const dijkstraEnd = dijkstra.at(-1)!;
  check(dijkstraEnd.d.s === 0 && dijkstraEnd.d.b === 5 && dijkstraEnd.d.c === 7 && dijkstraEnd.d.a === 8 && dijkstraEnd.d.d === 11,
    "Dijkstra gir s 0, b 5, c 7, a 8 og d 11, som i figuren");
  const order = dijkstra.filter(frame => frame.line === 6).map(frame => frame.current);
  check(order.join() === "s,b,c,a,d" && dijkstra.filter(frame => frame.lowered).every(frame => frame.edge !== null),
    "Dijkstra tar ut noder i stigende estimat: s, b, c, a, d");

  const lessonEight = (await loadLesson("tdt4120", "08"))!;
  const scriptEight = buildLectureScript(lessonEight, "Grafer");
  const bfsCode = scriptEight.scenes.findIndex(scene => scene.parts.some(part => part.kind === "visual" && part.source.type === "pseudocode" && part.source.title === "BFS(G, s)"));
  check(scriptEight.scenes[bfsCode + 1]?.kind === "animation" && scriptEight.scenes[bfsCode + 1].animation?.id === "bfs"
    && scriptEight.scenes[bfsCode + 1].parts.length === bfs.length,
  "BFS-animasjonen følger rett etter pseudokoden, med ett steg per hendelse");
  const dfsCode = scriptEight.scenes.findIndex(scene => scene.parts.some(part => part.kind === "visual" && part.source.type === "pseudocode" && part.source.title === "DFS-Visit(G, u)"));
  check(scriptEight.scenes[dfsCode + 1]?.animation?.id === "dfs" && scriptEight.scenes[dfsCode + 1].parts.length === dfs.length,
    "DFS-animasjonen følger rett etter DFS-Visit, med ett steg per hendelse");
  const lessonTen = (await loadLesson("tdt4120", "10"))!;
  const scriptTen = buildLectureScript(lessonTen, "Korteste veier");
  const dijkstraCode = scriptTen.scenes.findIndex(scene => scene.parts.some(part => part.kind === "visual" && part.source.type === "pseudocode" && part.source.title === "Dijkstra(G, w, s)"));
  check(scriptTen.scenes[dijkstraCode + 1]?.animation?.id === "dijkstra" && scriptTen.scenes[dijkstraCode + 1].parts.length === dijkstra.length,
    "Dijkstra-animasjonen følger rett etter pseudokoden, med ett steg per hendelse");

  // --- Insertion-Sort animation --------------------------------------------------
  const frames = traceInsertionSort();
  const final = frames.at(-1)!;
  check(final.slots.map(id => final.values[id!]).join() === "1,2,3,4,5,6" && final.shifts === 9, "Animasjonen ender sortert etter 9 flyttinger");
  check(frames.every(frame => {
    const placed = frame.slots.filter(id => id !== null);
    return new Set(placed).size === placed.length && placed.length + (frame.key !== null ? 1 : 0) === frame.values.length;
  }), "Hvert steg er en gyldig tilstand: alle elementer er enten i tabellen eller løftet ut som key");
  const rounds = frames.filter(frame => frame.line === 7).map((frame, index, all) => frame.shifts - (index ? all[index - 1].shifts : 0));
  check(rounds.join() === "1,1,0,4,3", "Flyttinger per runde stemmer med tabellen i læringsnotatet");

  const lesson = (await loadLesson("tdt4120", "01"))!;
  const script = buildLectureScript(lesson, "Algoritmer og kompleksitet");
  const code = script.scenes.findIndex(scene => scene.parts.some(part => part.kind === "visual" && part.source.type === "pseudocode"));
  check(script.scenes[code + 1]?.kind === "animation" && script.scenes[code + 1].parts.length === frames.length, "Animasjonen følger rett etter pseudokoden for Insertion-Sort");
  const codeSteps = script.scenes[code].parts.filter(part => part.kind === "visual");
  check(codeSteps.every((part, index) => part.kind === "visual" && part.reveal >= (index ? (codeSteps[index - 1] as { reveal: number }).reveal : 0)) && codeSteps.length > 1,
    "Pseudokoden for Insertion-Sort vises linje for linje før animasjonen");
  check(script.scenes.filter(scene => scene.kind === "figure").length === 6, "Alle seks figurene i forelesning 01 får egen scene");

  // --- Player with stubbed speech ------------------------------------------------
  const spokenLog: { text: string; lang: string; rate: number; voice?: string }[] = [];
  let cancels = 0;
  let pending: { onend?: () => void }[] = [];
  class FakeUtterance { text: string; lang = ""; rate = 1; voice: { name: string } | null = null; onend?: () => void; onerror?: () => void; constructor(text: string) { this.text = text; } }
  const fakeSynth = {
    speak(utterance: FakeUtterance) { spokenLog.push({ text: utterance.text, lang: utterance.lang, rate: utterance.rate, voice: utterance.voice?.name }); pending.push(utterance); },
    cancel() { cancels++; pending = []; },
    getVoices: () => [{ lang: "nb-NO", name: "Nora", voiceURI: "nora", localService: true }, { lang: "nb-NO", name: "Nora (forbedret)", voiceURI: "nora-enhanced", localService: true }, { lang: "en-US", name: "Samantha", voiceURI: "samantha", localService: true }],
    addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(window, "speechSynthesis", { value: fakeSynth, configurable: true });
  Object.defineProperty(window, "SpeechSynthesisUtterance", { value: FakeUtterance, configurable: true });
  const finishSpeech = () => { const queue = pending; pending = []; queue.forEach(utterance => utterance.onend?.()); };
  // Ends every phrase of the current part; the narrator waits a short pause between phrases.
  // In manual mode the step does not change, so stop once nothing is queued for a while.
  const finishPart = async () => {
    const start = document.querySelector(".lp-counter")?.textContent;
    let idle = 0;
    for (let round = 0; round < 200 && idle < 8; round++) {
      if (document.querySelector(".lp-counter")?.textContent !== start) return;
      if (pending.length) { idle = 0; await act(async () => finishSpeech()); }
      else { idle++; await sleep(100); }
    }
  };
  // Browser voices are tested here, so the recorded audio of the unit is not used.
  localStorage.setItem("lecture-player-settings", JSON.stringify({ auto: true, muted: false, rate: 1, voice: "nora-enhanced" }));

  // Pre-generated audio plays when it exists and falls back to the browser voice if the file fails.
  const audios: { src: string; playbackRate: number; onended: (() => void) | null; onerror: (() => void) | null }[] = [];
  class FakeAudio {
    src: string; playbackRate = 1; preservesPitch = true; duration = NaN;
    onended: (() => void) | null = null; onerror: (() => void) | null = null; onloadedmetadata: (() => void) | null = null;
    constructor(src: string) { this.src = src; audios.push(this); }
    play() { return Promise.resolve(); }
    pause() {} removeAttribute() {} load() {}
  }
  const realAudio = window.Audio;
  Object.defineProperty(window, "Audio", { value: FakeAudio, configurable: true, writable: true });
  let audioDone = false;
  narrate("Hei.", { rate: 1.15, muted: false, voice: null, audioUrl: "a.mp3", onDone: () => { audioDone = true; } });
  audios[0].onended?.();
  check(audioDone && audios[0].src === "a.mp3" && audios[0].playbackRate === 1.15 && !spokenLog.length, "Ferdiginnlest lyd spilles i valgt tempo og styrer når neste steg starter");
  narrate("Hei igjen.", { rate: 1, muted: false, voice: null, audioUrl: "mangler.mp3", onDone: () => {} })();
  const stopFallback = narrate("Hei igjen.", { rate: 1, muted: false, voice: null, audioUrl: "mangler.mp3", onDone: () => {} });
  audios.at(-1)!.onerror?.();
  check(spokenLog.at(-1)?.text === "Hei igjen.", "Mangler lydfilen, leser nettleserstemmen i stedet");
  stopFallback();
  Object.defineProperty(window, "Audio", { value: realAudio, configurable: true, writable: true });
  spokenLog.length = 0;
  pending = [];

  const container = document.getElementById("root")!;
  const root = createRoot(container);
  let setOpen: (open: boolean) => void = () => {};
  function Host({ lesson }: { lesson: Lesson }) {
    const [open, setter] = useState(true);
    setOpen = setter;
    return <>
      <button id="opener">Spill av</button>
      {open && <LecturePlayer lesson={lesson} title="Algoritmer og kompleksitet" label="Forelesning 01" onClose={() => setter(false)} />}
    </>;
  }
  document.body.style.overflow = "";
  await act(async () => root.render(<Host lesson={lesson} />));
  const dialog = () => document.querySelector<HTMLElement>(".lp-dialog");
  const button = (label: string) => document.querySelector<HTMLButtonElement>(`.lp-dialog button[aria-label="${label}"]`)!;
  const counter = () => document.querySelector(".lp-counter")?.textContent ?? "";
  await waitFor(() => spokenLog.length > 0);
  check(dialog()?.getAttribute("aria-modal") === "true" && document.body.style.overflow === "hidden", "Avspilleren åpnes som modal og låser siden bak");
  check(document.querySelector(".lp-scene-title h3")?.textContent === "Algoritmer og kompleksitet", "Første scene er tittelen");
  check(spokenLog[0].lang === "nb-NO" && !/[$\\]/.test(spokenLog[0].text) && spokenLog[0].voice === "Nora (forbedret)", "Opplesningen starter automatisk med den beste norske stemmen");
  const total = Number(counter().split("/")[1]);
  check(total === countSteps(script) && counter().startsWith("1 /"), "Telleren viser steg av totalt");

  await finishPart();
  await waitFor(() => counter().startsWith("2 /"), 2000);
  check(true, "Når en replikk er ferdig, går avspilleren automatisk videre");

  await act(async () => button("Pause").click());
  const spokenBefore = spokenLog.length;
  check(cancels > 0 && button("Spill av"), "Pause stopper talen");
  await act(async () => button("Neste").click());
  await sleep(700);
  check(counter().startsWith("3 /") && spokenLog.length === spokenBefore, "Neste flytter ett steg uten å starte avspilling på pause");
  await act(async () => button("Forrige").click());
  check(counter().startsWith("2 /"), "Forrige går ett steg tilbake");

  await act(async () => [...document.querySelectorAll<HTMLButtonElement>(".lp-segmented button")].find(item => item.textContent === "Manuell")!.click());
  await act(async () => button("Neste").click());
  await waitFor(() => spokenLog.length > spokenBefore);
  await finishPart();
  await sleep(700);
  check(counter().startsWith("3 /") && button("Spill av"), "Manuell modus leser steget og venter på brukeren");

  await act(async () => button("Velg stemme").click());
  const voiceSelect = document.querySelector<HTMLSelectElement>(".lp-voice-select select")!;
  const voiceOptions = [...voiceSelect.options].filter(option => option.value !== "recorded").map(option => option.textContent);
  check(voiceOptions.length === 2 && voiceOptions[0]?.startsWith("Nora (forbedret)") && !voiceOptions.some(option => option?.includes("Samantha")), "Stemmevalget viser norske stemmer, best først");
  await act(async () => { voiceSelect.value = "nora"; voiceSelect.dispatchEvent(new Event("change", { bubbles: true })); });
  const previewFrom = spokenLog.length;
  await act(async () => document.querySelector<HTMLButtonElement>(".lp-voice-preview")!.click());
  check(spokenLog.slice(previewFrom).some(item => item.voice === "Nora" && item.text.includes("velkommen")), "Forhåndslytting leser en prøve med valgt stemme");
  await act(async () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
  check(!document.querySelector(".lp-voice-panel") && dialog(), "Escape lukker stemmevalget først, ikke avspilleren");
  check(JSON.parse(localStorage.getItem("lecture-player-settings")!).voice === "nora", "Valgt stemme huskes");
  await act(async () => button("Neste").click());
  await waitFor(() => spokenLog.at(-1)?.voice === "Nora");
  await finishPart();
  check(true, "Neste replikk leses med den valgte stemmen");

  const select = document.querySelector<HTMLSelectElement>(".lp-chapter select")!;
  await act(async () => { select.value = "3"; select.dispatchEvent(new Event("change", { bubbles: true })); });
  check(document.querySelector(".lp-scene-chapter h3")?.textContent === "Insertion-Sort", "Hopp til en del via innholdsvelgeren");
  for (let index = 0; index < 12 && !document.querySelector(".lp-anim"); index++) await act(async () => button("Neste").click());
  check(document.querySelector(".lp-anim .lp-cell") && document.querySelectorAll(".lp-anim .lp-cell").length === 6, "Insertion-Sort-animasjonen vises med seks celler");
  const before = document.querySelector(".lp-anim-caption")?.textContent;
  await act(async () => button("Neste").click());
  check(document.querySelector(".lp-anim-code li.is-active") && document.querySelector(".lp-anim-caption")?.textContent !== before, "Animasjonen viser aktiv pseudokodelinje og ny forklaring per steg");

  await act(async () => button("Slå av lyd").click());
  const mutedBefore = spokenLog.length;
  await act(async () => button("Neste").click());
  await sleep(200);
  check(spokenLog.length === mutedBefore && button("Slå på lyd").getAttribute("aria-pressed") === "true", "Lyd av: ingen opplesning");
  check(JSON.parse(localStorage.getItem("lecture-player-settings")!).muted === true, "Innstillingene huskes");
  await act(async () => button("Slå på lyd").click());

  await act(async () => button("Start på nytt").click());
  check(counter().startsWith("1 /"), "Start på nytt går til første steg");

  const progress = document.querySelector<HTMLElement>(".lp-progress")!;
  const box = progress.getBoundingClientRect();
  await act(async () => progress.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: box.left + box.width * 0.999 })));
  check(counter() === `${total} / ${total}` && document.querySelector(".lp-scene-summary"), "Fremdriftslinjen kan klikkes for å hoppe; siste scene er oppsummeringen");

  const cancelsBeforeClose = cancels;
  document.getElementById("opener")!.focus();
  await act(async () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
  check(!dialog() && cancels > cancelsBeforeClose && document.body.style.overflow === "", "Escape lukker, stopper talen og låser opp siden");

  // Without speech synthesis the player still works, silently.
  Reflect.deleteProperty(window, "speechSynthesis");
  Reflect.deleteProperty(window, "SpeechSynthesisUtterance");
  const hadSpeech = "speechSynthesis" in window;
  if (!hadSpeech) {
    await act(async () => setOpen(true));
    // Unit 01 has recorded audio, which plays without speech synthesis, so the player stays usable.
    check(!document.querySelector(".lp-notice")?.textContent?.includes("støtter ikke opplesning") && !button("Slå av lyd").disabled, "Uten tekst-til-tale spiller innspilt lyd, og lydknappen er aktiv");
    await act(async () => button("Neste").click());
    check(counter().startsWith("2 /"), "Navigasjon fungerer uten lyd");
    await act(async () => button("Lukk forelesningen").click());
    check(!dialog(), "Lukkeknappen lukker avspilleren");
  } else results.push("– Nettleseren har innebygd tale som ikke kan fjernes; uten-lyd-testen hoppes over");
  report();
} catch (error) {
  document.getElementById("results")!.textContent = `FEIL: ${(error as Error).message}\n${results.join("\n")}`;
  throw error;
}

/** Every piece of subject content in a lesson, to check that the lecture leaves nothing out. */
function leaves(lesson: Lesson): string[] {
  const out: string[] = [...lesson.goals, ...lesson.overview, ...lesson.keyFormulas.map(formula => formula.latex)];
  const visit = (blocks: LessonBlock[]) => blocks.forEach(block => {
    switch (block.type) {
      case "text": out.push(...splitSentences(block.text)); break;
      case "list": out.push(...block.items); break;
      case "formula": out.push(block.latex); break;
      case "pseudocode": out.push(...block.lines); break;
      case "table": out.push(...block.head, ...block.rows.flat()); break;
      case "figure": out.push(block.caption); break;
      case "quiz": out.push(...block.items.flatMap(item => [item.question, item.answer])); break;
      // The frame label says «Eksempel», so the player drops that prefix from example titles.
      case "box": case "example": if (block.title) out.push(block.title.replace(/^eksempel:\s*./i, "")); visit(block.blocks); break;
    }
  });
  lesson.sections.forEach(section => { out.push(section.title); visit(section.blocks); });
  return out;
}
