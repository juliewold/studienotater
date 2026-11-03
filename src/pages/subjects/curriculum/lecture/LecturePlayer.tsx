import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, AudioLines, BookOpen, ChevronLeft, ChevronRight, HelpCircle, Lightbulb, Pause, Play, RotateCcw, ScrollText, Shapes, Volume2, VolumeX, X } from "lucide-react";
import type { Lesson } from "../../../../data/curriculum/lessons/types";
import { Block } from "../LessonView";
import { RichText } from "../curriculumShared";
import { animationById } from "./animations";
import { buildLectureScript, type LecturePart, type LectureScene } from "./lectureScript";
import { narrate, speechSupported, useNorwegianVoices, voiceQuality } from "./narrator";
import { hasRecording, loadRecording, recordingUrl, type LectureRecording } from "./recordings";
import { toSpeech } from "./speechText";
import "./LecturePlayer.css";

/** `voice` is "auto", "recorded" (pre-generated AI audio) or the voiceURI of a browser voice. */
type Settings = { auto: boolean; muted: boolean; rate: number; voice: string };
type Position = { scene: number; part: number };

const SETTINGS_KEY = "lecture-player-settings";
const RATES = [0.75, 0.9, 1, 1.15, 1.3, 1.5];
// Pause between parts, and a little longer between scenes, so each step can sink in.
const PART_GAP = 450;
const SCENE_GAP = 900;

function loadSettings(): Settings {
  const defaults = { auto: true, muted: false, rate: 1, voice: "auto" };
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") as Partial<Settings>;
    return { ...defaults, ...stored, rate: RATES.includes(stored.rate ?? 1) ? stored.rate ?? 1 : 1 };
  } catch {
    return defaults;
  }
}

const frames = {
  definition: { label: "Definisjon", icon: BookOpen },
  theorem: { label: "Teorem", icon: ScrollText },
  tip: { label: "Tips", icon: Lightbulb },
  pitfall: { label: "Felle", icon: AlertTriangle },
  example: { label: "Eksempel", icon: Shapes },
  quiz: { label: "Test deg selv", icon: HelpCircle },
};

/**
 * Plays a lesson as an interactive lecture: one concept per scene, revealed and read
 * aloud one part at a time. Built from the lesson already loaded by the topic page.
 */
export default function LecturePlayer({ lesson, title, label, onClose }: { lesson: Lesson; title: string; label: string; onClose: () => void }) {
  const script = useMemo(() => buildLectureScript(lesson, title), [lesson, title]);
  const [settings, setSettings] = useState(loadSettings);
  const [position, setPosition] = useState<Position>({ scene: 0, part: 0 });
  const [playing, setPlaying] = useState(settings.auto);
  const [blocked, setBlocked] = useState(false);
  const [recording, setRecording] = useState<LectureRecording>();
  const [voicePanel, setVoicePanel] = useState(false);
  const { voices, ready: voicesReady } = useNorwegianVoices();
  const dialog = useRef<HTMLDivElement>(null);
  const { auto, muted, rate } = settings;
  // Pre-generated audio is preferred when it exists; otherwise the chosen or best browser voice.
  const useRecorded = Boolean(recording) && (settings.voice === "auto" || settings.voice === "recorded");
  const voice = voices.find(item => item.voiceURI === settings.voice) ?? voices[0] ?? null;
  const voiceRef = useRef(voice);
  // Restart the current part when the voice changes (also when the browser's voice list arrives).
  const voiceId = voice?.voiceURI ?? "";
  const supported = speechSupported() || Boolean(recording);

  const offsets = useMemo(() => script.scenes.reduce<number[]>((sums, scene, index) => [...sums, (sums[index] ?? 0) + scene.parts.length], [0]), [script]);
  const total = offsets.at(-1)!;
  const step = offsets[position.scene] + position.part;
  const scene = script.scenes[position.scene];
  const atEnd = step === total - 1;

  useLayoutEffect(() => { voiceRef.current = voice; }, [voice]);
  useEffect(() => {
    if (!hasRecording(lesson.subjectId, lesson.unitId)) return;
    let cancelled = false;
    loadRecording(lesson.subjectId, lesson.unitId).then(result => { if (!cancelled) setRecording(result); }).catch(() => { /* The browser voice reads instead. */ });
    return () => { cancelled = true; };
  }, [lesson.subjectId, lesson.unitId]);
  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* Settings are a convenience only. */ }
  }, [settings]);

  const goTo = useCallback((target: number) => {
    const clamped = Math.max(0, Math.min(total - 1, target));
    const sceneIndex = offsets.findLastIndex(offset => offset <= clamped && offset < total);
    setPosition({ scene: sceneIndex, part: clamped - offsets[sceneIndex] });
  }, [offsets, total]);

  // Narrate the current part; in automatic mode move on when it is done.
  useEffect(() => {
    if (!playing || (!voicesReady && !useRecorded)) return;
    const part = script.scenes[position.scene].parts[position.part];
    const lastInScene = position.part === script.scenes[position.scene].parts.length - 1;
    let timer = 0;
    const stop = narrate(part.say, {
      rate, muted, voice: voiceRef.current,
      audioUrl: useRecorded ? recordingUrl(recording, lesson.subjectId, lesson.unitId, part.say) : undefined,
      onBlocked: () => { setBlocked(true); setPlaying(false); },
      onDone: () => {
        if (!auto) { setPlaying(false); return; }
        timer = window.setTimeout(() => {
          if (step >= total - 1) setPlaying(false);
          else goTo(step + 1);
        }, (part.pause ?? 0) + (lastInScene ? SCENE_GAP : PART_GAP));
      },
    });
    return () => { stop(); window.clearTimeout(timer); };
  }, [playing, position, script, rate, muted, auto, step, total, goTo, useRecorded, recording, lesson.subjectId, lesson.unitId, voiceId, voicesReady]);

  // Manual navigation reads the new step aloud when sound is on.
  const navigate = useCallback((target: number) => {
    goTo(target);
    setBlocked(false);
    if (!auto) setPlaying(!muted && supported);
  }, [goTo, auto, muted, supported]);
  const next = useCallback(() => { if (step < total - 1) navigate(step + 1); }, [navigate, step, total]);
  const previous = useCallback(() => navigate(step - 1), [navigate, step]);
  const toggle = useCallback(() => {
    setBlocked(false);
    if (playing) { setPlaying(false); return; }
    if (atEnd && auto) goTo(0);
    setPlaying(true);
  }, [playing, atEnd, auto, goTo]);
  const restart = () => { goTo(0); setBlocked(false); setPlaying(auto || (!muted && supported)); };

  // Modal behaviour: lock page scrolling, keyboard shortcuts, restore focus when closed.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (speechSupported()) window.speechSynthesis.cancel();
      opener?.focus();
    };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); if (voicePanel) setVoicePanel(false); else onClose(); return; }
      if (event.target instanceof HTMLSelectElement || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
      else if (event.key === " " && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); toggle(); }
      else if (event.key === "Tab") trapFocus(event, dialog.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, next, previous, toggle, voicePanel]);

  const update = (patch: Partial<Settings>) => setSettings(current => ({ ...current, ...patch }));
  const chapterStarts = script.chapters.map((_, chapter) => offsets[script.scenes.findIndex(item => item.chapter === chapter)]);

  return createPortal(<div className="lp-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialog} className="lp-dialog" role="dialog" aria-modal="true" aria-labelledby="lp-title" tabIndex={-1}>
      <header className="lp-header">
        <div className="lp-heading">
          <p className="lp-label">{label} · Interaktiv gjennomgang</p>
          <h2 id="lp-title">{title}</h2>
        </div>
        <label className="lp-chapter">
          <span className="visually-hidden">Hopp til del</span>
          <select value={scene.chapter} onChange={event => navigate(chapterStarts[Number(event.target.value)])}>
            {script.chapters.map((chapter, index) => <option key={index} value={index}>{index === 0 || index === script.chapters.length - 1 ? chapter : `${index}. ${chapter}`}</option>)}
          </select>
        </label>
        <button type="button" className="lp-icon-button" onClick={onClose} aria-label="Lukk forelesningen"><X size={20} aria-hidden="true" /></button>
      </header>

      <div className="lp-stage">
        <Scene key={scene.id} scene={scene} part={position.part} chapters={script.chapters} label={label} />
      </div>

      <footer className="lp-footer">
        <Progress step={step} total={total} chapterStarts={chapterStarts} chapters={script.chapters} onSeek={navigate} />
        <div className="lp-controls">
          <div className="lp-controls-side">
            <span className="lp-counter" aria-live="off">{step + 1} / {total}</span>
            {(!supported || blocked) && <span className="lp-notice" role="status">
              {!supported ? "Nettleseren støtter ikke opplesning. Forelesningen vises uten lyd." : "Trykk på play for å starte opplesningen."}
            </span>}
            {supported && !voice && !useRecorded && !muted && !blocked && <span className="lp-notice">Fant ingen norsk stemme, bruker standardstemmen.</span>}
          </div>
          <div className="lp-transport">
            <button type="button" className="lp-icon-button" onClick={restart} aria-label="Start på nytt" title="Start på nytt"><RotateCcw size={18} aria-hidden="true" /></button>
            <button type="button" className="lp-icon-button" onClick={previous} disabled={step === 0} aria-label="Forrige" title="Forrige (←)"><ChevronLeft size={22} aria-hidden="true" /></button>
            <button type="button" className="lp-play" onClick={toggle} aria-label={playing ? "Pause" : "Spill av"} title={playing ? "Pause (mellomrom)" : "Spill av (mellomrom)"}>
              {playing ? <Pause size={24} aria-hidden="true" /> : <Play size={24} aria-hidden="true" />}
            </button>
            <button type="button" className="lp-icon-button" onClick={next} disabled={atEnd} aria-label="Neste" title="Neste (→)"><ChevronRight size={22} aria-hidden="true" /></button>
            <button type="button" className="lp-icon-button" onClick={() => update({ muted: !muted })} disabled={!supported}
              aria-pressed={muted} aria-label={muted ? "Slå på lyd" : "Slå av lyd"} title={muted ? "Slå på lyd" : "Slå av lyd"}>
              {muted || !supported ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
            </button>
          </div>
          <div className="lp-controls-side is-end">
            <button type="button" className="lp-icon-button" onClick={() => { setPlaying(false); setVoicePanel(open => !open); }} disabled={!supported}
              aria-expanded={voicePanel} aria-controls="lp-voice-panel" aria-label="Velg stemme" title="Velg stemme"><AudioLines size={18} aria-hidden="true" /></button>
            <div className="lp-segmented" role="group" aria-label="Avspilling">
              <button type="button" aria-pressed={auto} onClick={() => update({ auto: true })}>Automatisk</button>
              <button type="button" aria-pressed={!auto} onClick={() => { update({ auto: false }); setPlaying(false); }}>Manuell</button>
            </div>
            <label className="lp-rate">
              <span className="visually-hidden">Hastighet</span>
              <select value={rate} onChange={event => update({ rate: Number(event.target.value) })}>
                {RATES.map(value => <option key={value} value={value}>{value.toLocaleString("nb-NO")}×</option>)}
              </select>
            </label>
          </div>
        </div>
        {voicePanel && <VoicePanel voices={voices} recording={recording} selected={useRecorded ? "recorded" : voice?.voiceURI ?? ""} rate={rate}
          sampleUrl={recording && recordingUrl(recording, lesson.subjectId, lesson.unitId, script.scenes[0].parts[0].say)}
          onSelect={value => update({ voice: value })} onClose={() => setVoicePanel(false)} />}
      </footer>
    </div>
  </div>, document.body);
}

const SAMPLE = "Hei, og velkommen til forelesningen. I dag ser vi på Insertion-Sort, som bruker $\\Theta(n^2)$ tid i verste tilfelle. Legg merke til pausene mellom setningene.";

/** Picks the narrator voice, with a short sample to listen to first. */
function VoicePanel({ voices, recording, selected, rate, sampleUrl, onSelect, onClose }: {
  voices: SpeechSynthesisVoice[]; recording?: LectureRecording; selected: string; rate: number; sampleUrl?: string;
  onSelect: (voice: string) => void; onClose: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);
  const stopPreview = useRef<() => void>(() => {});
  useEffect(() => () => stopPreview.current(), []);
  const chosen = voices.find(item => item.voiceURI === selected);
  const preview = () => {
    stopPreview.current();
    if (previewing) { setPreviewing(false); return; }
    const voice = chosen ?? voices[0] ?? null;
    setPreviewing(true);
    stopPreview.current = narrate(toSpeech(SAMPLE), {
      rate, muted: false, voice, audioUrl: selected === "recorded" ? sampleUrl : undefined,
      onDone: () => setPreviewing(false), onBlocked: () => setPreviewing(false),
    });
  };
  const best = Math.max(0, ...voices.map(voice => voiceQuality(voice).rank));
  return <div className="lp-voice-panel" id="lp-voice-panel" role="dialog" aria-label="Stemme">
    <div className="lp-voice-head">
      <strong>Stemme</strong>
      <button type="button" className="lp-icon-button" onClick={onClose} aria-label="Lukk stemmevalg"><X size={16} aria-hidden="true" /></button>
    </div>
    <label className="lp-voice-select">
      <span className="visually-hidden">Velg stemme</span>
      <select value={selected} onChange={event => { stopPreview.current(); setPreviewing(false); onSelect(event.target.value); }}>
        {recording && <option value="recorded">{recording.label} (AI, ferdig innlest)</option>}
        {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voiceQuality(voice).label}{voice.localService ? "" : ", på nett"})</option>)}
        {!recording && !voices.length && <option value="">Nettleserens standardstemme</option>}
      </select>
    </label>
    <button type="button" className="lp-voice-preview" onClick={preview} aria-pressed={previewing}>
      {previewing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{previewing ? "Stopp" : "Forhåndslytt"}
    </button>
    {!recording && best < 3 && <p className="lp-voice-tip">
      Stemmene på denne maskinen er enkle. På Mac kan du laste ned en bedre norsk stemme under Systeminnstillinger → Tilgjengelighet → Opplest innhold → Systemstemme → Administrer stemmer
      (velg «Nora (forbedret)»), og så laste siden på nytt. Microsoft Edge har naturlige norske nettstemmer gratis.
    </p>}
    {chosen && !chosen.localService && <p className="lp-voice-tip">
      Nettstemmer sender teksten til nettleserleverandøren for opplesning.
    </p>}
  </div>;
}

function trapFocus(event: KeyboardEvent, root: HTMLElement | null) {
  const focusable = Array.from(root?.querySelectorAll<HTMLElement>("button:not(:disabled), select, a[href], summary, [tabindex='0']") ?? []);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === root)) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function Progress({ step, total, chapterStarts, chapters, onSeek }: { step: number; total: number; chapterStarts: number[]; chapters: string[]; onSeek: (step: number) => void }) {
  const percent = (value: number) => `${(value / total) * 100}%`;
  return <div className="lp-progress" role="slider" tabIndex={0} aria-label="Fremdrift" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1}
    aria-valuetext={`Steg ${step + 1} av ${total}`}
    onKeyDown={event => {
      if (event.key === "Home") { event.preventDefault(); onSeek(0); }
      if (event.key === "End") { event.preventDefault(); onSeek(total - 1); }
    }}
    onClick={event => {
      const box = event.currentTarget.getBoundingClientRect();
      onSeek(Math.floor(((event.clientX - box.left) / box.width) * total));
    }}>
    <div className="lp-progress-track"><div className="lp-progress-fill" style={{ width: percent(step + 1) }} /></div>
    {chapterStarts.map((start, index) => index > 0 && <span key={index} className="lp-progress-mark" style={{ left: percent(start) }} title={chapters[index]} />)}
  </div>;
}

function Scene({ scene, part, chapters, label }: { scene: LectureScene; part: number; chapters: string[]; label: string }) {
  const shown = scene.parts.slice(0, part + 1);
  if (scene.kind === "title") return <div className="lp-scene lp-scene-title">
    <p className="lp-kicker">{label}</p>
    <h3><RichText>{scene.heading ?? ""}</RichText></h3>
    <Parts parts={shown} current={part} />
  </div>;
  if (scene.kind === "chapter") return <div className="lp-scene lp-scene-chapter">
    <p className="lp-kicker">{shown[0].kind === "text" ? shown[0].text : ""}</p>
    <h3><RichText>{scene.heading ?? ""}</RichText></h3>
  </div>;
  if (scene.kind === "animation" && scene.animation) {
    const animation = animationById(scene.animation.id);
    return <div className="lp-scene lp-scene-animation">
      <p className="lp-kicker">{chapters[scene.chapter]}</p>
      <h3><RichText>{scene.heading ?? ""}</RichText></h3>
      {animation && <animation.View block={scene.animation.block} step={part} />}
    </div>;
  }
  const body = <>
    {scene.table && <SceneTable head={scene.table.head} rows={shown} current={part} caption={scene.table.caption} done={part === scene.parts.length - 1} />}
    {!scene.table && <Parts parts={shown} current={part} />}
  </>;
  return <div className={`lp-scene lp-scene-${scene.kind}`}>
    <p className="lp-kicker">{chapters[scene.chapter]}</p>
    {scene.heading && scene.heading !== chapters[scene.chapter] && <h3><RichText>{scene.heading}</RichText></h3>}
    {scene.frame ? <Frame variant={scene.frame.variant} title={scene.frame.title}>{body}</Frame> : body}
  </div>;
}

function Frame({ variant, title, children }: { variant: keyof typeof frames; title?: string; children: ReactNode }) {
  const { label, icon: Icon } = frames[variant];
  return <section className={`lp-frame is-${variant}`}>
    <p className="lp-frame-label"><Icon size={16} aria-hidden="true" />{label}{title && <span><RichText>{title}</RichText></span>}</p>
    {children}
  </section>;
}

/** Revealed parts in order; consecutive list items share one list. */
function Parts({ parts, current }: { parts: LecturePart[]; current: number }) {
  const groups: { items: { part: LecturePart; index: number }[]; list?: boolean; ordered?: boolean }[] = [];
  parts.forEach((part, index) => {
    const last = groups.at(-1);
    if (part.kind === "item" && last?.list && last.ordered === part.ordered) last.items.push({ part, index });
    else groups.push({ items: [{ part, index }], list: part.kind === "item", ordered: part.kind === "item" && part.ordered });
  });
  const state = (index: number) => (index === current ? "is-current" : "is-past");
  return <>{groups.map(group => {
    if (group.list) {
      const items = group.items.map(({ part, index }) => <li key={index} className={`lp-part ${state(index)}`}><RichText>{part.kind === "item" ? part.text : ""}</RichText></li>);
      const start = group.items[0].part.kind === "item" ? group.items[0].part.number : 1;
      return group.ordered ? <ol key={group.items[0].index} start={start} className="lp-list">{items}</ol> : <ul key={group.items[0].index} className="lp-list">{items}</ul>;
    }
    const { part, index } = group.items[0];
    return <div key={index} className={`lp-part ${state(index)}`}>
      {part.kind === "text" && <p className="lp-text"><RichText>{part.text}</RichText></p>}
      {part.kind === "block" && <Block block={part.block} />}
    </div>;
  })}</>;
}

function SceneTable({ head, rows, current, caption, done }: { head: string[]; rows: LecturePart[]; current: number; caption?: string; done: boolean }) {
  return <figure className="lesson-table lp-table">
    <div className="lesson-table-scroll"><table>
      <thead><tr>{head.map(cell => <th key={cell} scope="col"><RichText>{cell}</RichText></th>)}</tr></thead>
      <tbody>{rows.map((row, index) => row.kind === "row" && <tr key={index} className={`lp-part ${index === current ? "is-current" : "is-past"}`}>
        {row.cells.map((cell, cellIndex) => <td key={cellIndex}><RichText>{cell}</RichText></td>)}
      </tr>)}</tbody>
    </table></div>
    {caption && done && <figcaption className="lesson-caption"><RichText>{caption}</RichText></figcaption>}
  </figure>;
}
