import { useEffect, useState } from "react";
import { splitSentences } from "./speechText";

// Narration with the browser's built-in speech synthesis. No external service is used.
// Without speech support, or with sound off, a reading-time timer takes its place so
// automatic playback still works.

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

const norwegian = (voice: SpeechSynthesisVoice) => /^(nb|no|nn)\b/i.test(voice.lang.replace("_", "-"));

/** The best available Norwegian voice, updated when the browser loads its voices. */
export function useNorwegianVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (!speechSupported()) return;
    const synth = window.speechSynthesis;
    const pick = () => {
      const voices = synth.getVoices().filter(norwegian);
      // Prefer Bokmål and local (offline) voices.
      setVoice(voices.sort((a, b) => Number(/^nb/i.test(b.lang)) - Number(/^nb/i.test(a.lang)) || Number(b.localService) - Number(a.localService))[0] ?? null);
    };
    pick();
    synth.addEventListener("voiceschanged", pick);
    return () => synth.removeEventListener("voiceschanged", pick);
  }, []);
  return voice;
}

/** Estimated reading time for the text at the given rate, used when nothing is spoken. */
export const readingTime = (text: string, rate: number) => Math.max(1800, (text.split(/\s+/).filter(Boolean).length / (2.6 * rate)) * 1000);

type Options = { rate: number; muted: boolean; voice: SpeechSynthesisVoice | null; onDone: () => void; onBlocked?: () => void };

/**
 * Speaks `text` sentence by sentence (long utterances are cut off in some browsers) and
 * calls `onDone` once at the end. Returns a function that stops it without calling `onDone`.
 */
export function narrate(text: string, { rate, muted, voice, onDone, onBlocked }: Options): () => void {
  let stopped = false;
  const timers: number[] = [];
  const finish = () => { if (!stopped) { stopped = true; timers.forEach(clearTimeout); onDone(); } };
  const fallback = () => timers.push(window.setTimeout(finish, readingTime(text, rate)));

  if (muted || !speechSupported() || !text.trim()) {
    fallback();
    return () => { stopped = true; timers.forEach(clearTimeout); };
  }

  const synth = window.speechSynthesis;
  synth.cancel();
  const sentences = splitSentences(text);
  sentences.forEach((sentence, index) => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = voice?.lang ?? "nb-NO";
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    if (index === sentences.length - 1) utterance.onend = finish;
    utterance.onerror = event => {
      // Cancelling (pause, skip, close) is not an error. Anything else falls back to the timer.
      if (stopped || event.error === "interrupted" || event.error === "canceled") return;
      // Safari refuses speech that does not follow a click; let the user start it.
      if (event.error === "not-allowed" && onBlocked) { stopped = true; timers.forEach(clearTimeout); synth.cancel(); onBlocked(); return; }
      fallback();
    };
    synth.speak(utterance);
  });
  // Some browsers occasionally never fire `end`; never let playback hang.
  timers.push(window.setTimeout(finish, readingTime(text, rate) * 2.5 + 4000));
  return () => {
    stopped = true;
    timers.forEach(clearTimeout);
    synth.cancel();
  };
}
