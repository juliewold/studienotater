import { useEffect, useState } from "react";
import { browserPronunciation, phrases } from "./speechText";

// Narration for the lecture player. Pre-generated audio (an AI voice, recorded once and
// served as static files) is used when it exists for a part; otherwise the browser's own
// speech synthesis reads it for free. With sound off, or without speech support, a
// reading-time timer takes over so automatic playback still works.

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

const norwegian = (voice: SpeechSynthesisVoice) => /^(nb|no|nn)\b/i.test(voice.lang.replace("_", "-"));

/** Rough quality of a system voice, from the names browsers and operating systems use. */
export function voiceQuality(voice: SpeechSynthesisVoice): { rank: number; label: string } {
  if (/premium/i.test(voice.name)) return { rank: 4, label: "premium" };
  if (/natural|neural/i.test(voice.name)) return { rank: 4, label: "naturlig" };
  if (/enhanced|forbedret|utvidet/i.test(voice.name)) return { rank: 3, label: "forbedret" };
  if (/online|google/i.test(voice.name)) return { rank: 2, label: "nett" };
  return { rank: 1, label: "standard" };
}

/**
 * Norwegian voices in the browser, best first, updated when the browser loads its voices.
 * `ready` turns true once the list has arrived (or after a short wait), so narration does
 * not start in one voice and switch mid-sentence.
 */
export function useNorwegianVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ready, setReady] = useState(() => !speechSupported());
  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const all = synth.getVoices();
      setVoices(all.filter(norwegian).sort((a, b) =>
        voiceQuality(b).rank - voiceQuality(a).rank
        || Number(/^nb/i.test(b.lang)) - Number(/^nb/i.test(a.lang))
        || Number(b.localService) - Number(a.localService)));
      if (all.length) setReady(true);
    };
    pick();
    const timer = window.setTimeout(() => setReady(true), 600);
    synth.addEventListener("voiceschanged", pick);
    return () => { window.clearTimeout(timer); synth.removeEventListener("voiceschanged", pick); };
  }, []);
  return { voices, ready };
}

/** Estimated reading time for the text at the given rate, used when nothing is spoken. */
export const readingTime = (text: string, rate: number) => Math.max(1800, (text.split(/\s+/).filter(Boolean).length / (2.5 * rate)) * 1000);

type Options = {
  rate: number;
  muted: boolean;
  voice: SpeechSynthesisVoice | null;
  /** Pre-generated audio for exactly this text, if any. */
  audioUrl?: string;
  onDone: () => void;
  onBlocked?: () => void;
};

/**
 * Reads `text` aloud and calls `onDone` once at the end. Returns a function that stops
 * playback without calling `onDone`.
 */
export function narrate(text: string, options: Options): () => void {
  const { rate, muted, audioUrl, onDone } = options;
  let stop = () => {};
  let stopped = false;
  const timers: number[] = [];
  const finish = () => { if (!stopped) { stopped = true; timers.forEach(clearTimeout); onDone(); } };
  const fallback = () => timers.push(window.setTimeout(finish, readingTime(text, rate)));
  const cancel = () => { stopped = true; timers.forEach(clearTimeout); stop(); };

  if (muted || !text.trim()) { fallback(); return cancel; }
  if (audioUrl) {
    stop = playAudio(audioUrl, text, options, finish, timers, () => { if (!stopped) stop = speakText(text, options, finish, fallback, timers, () => stopped); });
    return cancel;
  }
  if (!speechSupported()) { fallback(); return cancel; }
  stop = speakText(text, options, finish, fallback, timers, () => stopped);
  return cancel;
}

function playAudio(url: string, text: string, { rate, onBlocked }: Options, finish: () => void, timers: number[], onFail: () => void) {
  const audio = new Audio(url);
  audio.playbackRate = rate;
  audio.preservesPitch = true;
  audio.onended = finish;
  // A missing or broken file falls back to the browser voice for this part.
  audio.onerror = onFail;
  audio.onloadedmetadata = () => {
    if (Number.isFinite(audio.duration)) timers.push(window.setTimeout(finish, (audio.duration / rate) * 1000 + 4000));
  };
  timers.push(window.setTimeout(finish, readingTime(text, rate) * 3 + 8000));
  audio.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "NotAllowedError" && onBlocked) { timers.forEach(clearTimeout); onBlocked(); }
    else if (!(error instanceof DOMException && error.name === "AbortError")) onFail();
  });
  return () => { audio.onended = audio.onerror = null; audio.pause(); audio.removeAttribute("src"); audio.load(); };
}

/**
 * Speaks phrase by phrase with short pauses between them. Separate utterances also avoid
 * the cut-off some browsers have for long utterances.
 */
function speakText(text: string, { rate, voice, onBlocked }: Options, finish: () => void, fallback: () => void, timers: number[], isStopped: () => boolean) {
  const synth = window.speechSynthesis;
  synth.cancel();
  const queue = phrases(browserPronunciation(text));
  // Keep a reference to the current utterance; some browsers drop events of collected ones.
  let current: SpeechSynthesisUtterance | null = null;
  const speak = (index: number) => {
    if (isStopped()) return;
    if (index >= queue.length) { finish(); return; }
    const utterance = new SpeechSynthesisUtterance(queue[index].text);
    current = utterance;
    utterance.lang = voice?.lang ?? "nb-NO";
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.onend = () => {
      if (index === queue.length - 1) finish();
      else timers.push(window.setTimeout(() => speak(index + 1), queue[index].pause / rate));
    };
    utterance.onerror = event => {
      // Cancelling (pause, skip, close) is not an error. Anything else falls back to the timer.
      if (isStopped() || event.error === "interrupted" || event.error === "canceled") return;
      // Safari refuses speech that does not follow a click; let the user start it.
      if (event.error === "not-allowed" && onBlocked) { timers.forEach(clearTimeout); synth.cancel(); onBlocked(); return; }
      fallback();
    };
    synth.speak(utterance);
  };
  speak(0);
  // Some browsers occasionally never fire `end`; never let playback hang.
  timers.push(window.setTimeout(finish, readingTime(text, rate) * 2.5 + 4000 + queue.reduce((sum, phrase) => sum + phrase.pause, 0)));
  return () => { if (current) current.onend = current.onerror = null; synth.cancel(); };
}
