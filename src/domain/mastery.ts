// Mestring per tema i temalisten, med og uten thai (PLAN-fase0 §3.3).
// Mestring = snitt over alle elementer i temaet av andel riktige i de siste N forsøkene.
// Elementer som ikke er øvd, teller 0 – slik vektes mestringen mot dekning.
import { READINESS } from '../config/readiness';
import type { Attempt, PoolItem } from './types';

export interface TopicMastery {
  ref: string;
  items: number;
  practiced: number;
  withThai: number;
  withoutThai: number;
}

export function itemScore(attempts: Attempt[], n = READINESS.lastAttemptsPerItem): number | undefined {
  if (!attempts.length) return undefined;
  const last = [...attempts].sort((a, b) => a.at - b.at).slice(-n);
  return last.filter((a) => a.correct).length / last.length;
}

export function topicMastery(pool: PoolItem[], attempts: Attempt[], n = READINESS.lastAttemptsPerItem): Map<string, TopicMastery> {
  const byItem = new Map<string, Attempt[]>();
  for (const a of attempts) {
    if (!byItem.has(a.itemId)) byItem.set(a.itemId, []);
    byItem.get(a.itemId)!.push(a);
  }
  const out = new Map<string, TopicMastery>();
  for (const p of pool) {
    const m = out.get(p.temalisteRef) ?? { ref: p.temalisteRef, items: 0, practiced: 0, withThai: 0, withoutThai: 0 };
    const all = byItem.get(p.itemId) ?? [];
    m.items += 1;
    if (all.length) m.practiced += 1;
    m.withThai += itemScore(all, n) ?? 0;
    m.withoutThai += itemScore(all.filter((a) => !a.thaiUsed), n) ?? 0;
    out.set(p.temalisteRef, m);
  }
  for (const m of out.values()) {
    m.withThai = m.items ? m.withThai / m.items : 0;
    m.withoutThai = m.items ? m.withoutThai / m.items : 0;
  }
  return out;
}

/** Foreslå å trappe ned thai: høy treffprosent uten thai over de siste forsøkene. */
export function suggestLessThai(attempts: Attempt[]): boolean {
  const { minShare, lastAttempts } = READINESS.suggestNoThai;
  const recent = [...attempts].filter((a) => a.mode !== 'exam').sort((a, b) => a.at - b.at).slice(-lastAttempts);
  if (recent.length < lastAttempts) return false;
  const noThai = recent.filter((a) => !a.thaiUsed);
  if (noThai.length < lastAttempts / 2) return false;
  return noThai.filter((a) => a.correct).length / noThai.length >= minShare;
}

export function masteryColor(share: number): 'green' | 'yellow' | 'red' | 'none' {
  if (share <= 0) return 'none';
  if (share >= READINESS.topicGreen) return 'green';
  if (share >= READINESS.topicYellow) return 'yellow';
  return 'red';
}
