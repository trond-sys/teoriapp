// «Dagens økt»: forfalte repetisjoner + nytt stoff + én interaktiv oppgave, med temaer blandet (interleaving).
import { SESSION } from '../config/readiness';
import type { PoolItem, SrsState } from './types';

export interface SessionOptions {
  now: number;
  targetItems?: number;
  maxNew?: number;
  /** Tilfeldig tall i [0, 1). Settes i tester for å få fast rekkefølge. */
  random?: () => number;
}

export interface PlannedItem extends PoolItem {
  reason: 'due' | 'new' | 'interactive' | 'extra';
}

export function planSession(pool: PoolItem[], srs: Map<string, SrsState>, opts: SessionOptions): PlannedItem[] {
  const target = opts.targetItems ?? SESSION.targetItems;
  const maxNew = opts.maxNew ?? SESSION.maxNew;
  const rnd = opts.random ?? Math.random;

  const plain = pool.filter((p) => !p.interactive);
  const interactive = pool.filter((p) => p.interactive);

  // Forfalte: mest forfalt først.
  const due = plain
    .filter((p) => (srs.get(p.itemId)?.due ?? Infinity) <= opts.now)
    .sort((a, b) => srs.get(a.itemId)!.due - srs.get(b.itemId)!.due);

  // Nye: vektet tilfeldig trekk (særnorske temaer oftere), men ett tema om gangen spres utover.
  const fresh = weightedShuffle(
    plain.filter((p) => !srs.has(p.itemId)),
    rnd,
  );

  const slots = target - (interactive.length ? 1 : 0);
  // Forfalte først, men hold av plass til nytt stoff (opptil maxNew).
  const newCount = Math.min(maxNew, fresh.length);
  const dueCount = Math.min(due.length, slots - newCount);
  const picked: PlannedItem[] = [
    ...due.slice(0, dueCount).map((p) => ({ ...p, reason: 'due' as const })),
    ...fresh.slice(0, Math.min(newCount, slots - dueCount)).map((p) => ({ ...p, reason: 'new' as const })),
  ];
  // Lite å gjøre i dag (lite innhold): fyll opp med de som forfaller snarest.
  if (picked.length < slots) {
    const soon = plain
      .filter((p) => srs.has(p.itemId) && !picked.some((x) => x.itemId === p.itemId))
      .sort((a, b) => srs.get(a.itemId)!.due - srs.get(b.itemId)!.due);
    soon.slice(0, slots - picked.length).forEach((p) => picked.push({ ...p, reason: 'extra' }));
  }

  const mixed = interleave(picked);

  // Én interaktiv oppgave: forfalt eller ny først, ellers den som forfaller snarest. Legges midt i økta.
  if (interactive.length) {
    const ia =
      interactive.find((p) => (srs.get(p.itemId)?.due ?? -Infinity) <= opts.now) ??
      [...interactive].sort((a, b) => (srs.get(a.itemId)?.due ?? 0) - (srs.get(b.itemId)?.due ?? 0))[0];
    mixed.splice(Math.floor(mixed.length / 2), 0, { ...ia, reason: 'interactive' });
  }
  return mixed;
}

function weightedShuffle<T extends PoolItem>(items: T[], rnd: () => number): T[] {
  // Efraimidis–Spirakis: nøkkel = u^(1/w), sorter synkende.
  return items
    .map((it) => ({ it, key: Math.pow(rnd(), 1 / (it.weight ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.it);
}

/** Stokker slik at to etterfølgende elementer helst har ulikt tema. Rekkefølgen ellers beholdes. */
export function interleave<T extends { temalisteRef: string }>(items: T[]): T[] {
  const rest = [...items];
  const out: T[] = [];
  while (rest.length) {
    const last = out[out.length - 1]?.temalisteRef;
    const i = rest.findIndex((x) => x.temalisteRef !== last);
    out.push(rest.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}
