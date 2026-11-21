// Opplesning med Web Speech API. Lydknappen skjules når enheten mangler stemme for språket.
import { useEffect, useState } from 'react';
import type { Lang } from '../domain/types';

const PREFERRED: Record<Lang, string[]> = {
  nb: ['nb-NO', 'no-NO', 'nb', 'no', 'nn-NO'],
  en: ['en-GB', 'en-US', 'en-AU', 'en-IE', 'en'],
  th: ['th-TH', 'th'],
};

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

const norm = (tag: string) => tag.replace('_', '-').toLowerCase();

export function findVoice(voices: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice | undefined {
  for (const tag of PREFERRED[lang]) {
    const t = norm(tag);
    const exact = voices.filter((v) => norm(v.lang) === t);
    // Foretrekk lokale stemmer (virker uten nett), deretter Google-stemmer.
    const best = exact.find((v) => v.localService) ?? exact[0];
    if (best) return best;
  }
  const prefix = PREFERRED[lang][PREFERRED[lang].length - 1];
  return voices.find((v) => norm(v.lang).startsWith(norm(prefix)));
}

let cached: SpeechSynthesisVoice[] = [];
const listeners = new Set<(v: SpeechSynthesisVoice[]) => void>();

function refresh() {
  if (!ttsSupported()) return;
  cached = window.speechSynthesis.getVoices();
  listeners.forEach((l) => l(cached));
}

if (ttsSupported()) {
  refresh();
  window.speechSynthesis.addEventListener?.('voiceschanged', refresh);
}

export type VoiceMap = Record<Lang, SpeechSynthesisVoice | undefined>;

export function useVoices(): VoiceMap {
  const [voices, setVoices] = useState(cached);
  useEffect(() => {
    listeners.add(setVoices);
    refresh();
    // Noen Android-versjoner sender aldri voiceschanged: prøv igjen litt senere.
    const t = setTimeout(refresh, 1500);
    return () => {
      listeners.delete(setVoices);
      clearTimeout(t);
    };
  }, []);
  return { nb: findVoice(voices, 'nb'), en: findVoice(voices, 'en'), th: findVoice(voices, 'th') };
}

export function speak(text: string, lang: Lang, rate: number, voice?: SpeechSynthesisVoice) {
  if (!ttsSupported()) return;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = voice ?? findVoice(cached, lang);
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else u.lang = PREFERRED[lang][0];
  u.rate = rate;
  s.speak(u);
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel();
}
