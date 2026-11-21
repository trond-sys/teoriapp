// Forenklet SM-2 (PLAN-fase0 §3.3). Thai påvirker ikke planleggingen, bare statistikken.
import type { Attempt, SrsState } from './types';

export const DAY = 24 * 60 * 60 * 1000;
export const MIN_EASE = 1.3;
export const START_EASE = 2.5;

export function review(prev: SrsState | undefined, itemId: string, correct: boolean, at: number): SrsState {
  const s: SrsState = prev ?? { itemId, ease: START_EASE, interval: 0, reps: 0, lapses: 0, due: at, lastAt: at };
  if (!correct) {
    return {
      ...s,
      reps: 0,
      lapses: s.lapses + 1,
      interval: 1,
      ease: Math.max(MIN_EASE, round2(s.ease - 0.2)),
      due: at + DAY,
      lastAt: at,
    };
  }
  const reps = s.reps + 1;
  const interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(s.interval * s.ease);
  return { ...s, reps, interval, due: at + interval * DAY, lastAt: at };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Regner SRS-tilstanden ut fra alle forsøk. `srs`-tabellen er bare en cache av dette.
 * Forsøk i prøveeksamen teller ikke for planleggingen.
 */
export function replay(attempts: Attempt[]): Map<string, SrsState> {
  const out = new Map<string, SrsState>();
  const sorted = [...attempts].filter((a) => a.mode !== 'exam').sort((a, b) => a.at - b.at);
  for (const a of sorted) out.set(a.itemId, review(out.get(a.itemId), a.itemId, a.correct, a.at));
  return out;
}

export function isDue(s: SrsState | undefined, now: number): boolean {
  return !!s && s.due <= now;
}
