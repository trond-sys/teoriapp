import { describe, expect, it } from 'vitest';
import { itemScore, masteryColor, suggestLessThai, topicMastery } from './mastery';
import { interleave, planSession } from './session';
import { DAY, MIN_EASE, replay, review } from './srs';
import type { Attempt, PoolItem, SrsState } from './types';

const T0 = Date.UTC(2026, 10, 21, 8);
let n = 0;
const att = (itemId: string, correct: boolean, at: number, extra: Partial<Attempt> = {}): Attempt => ({
  id: `a${n++}`,
  itemId,
  kind: 'question',
  temalisteRef: 'vp-hoyreregel',
  correct,
  ms: 1000,
  thaiUsed: false,
  scaffoldAtTime: 'bro',
  lang: 'en',
  mode: 'today',
  at,
  ...extra,
});

describe('SRS (forenklet SM-2)', () => {
  it('riktige svar gir intervall 1 → 3 → interval × ease', () => {
    let s = review(undefined, 'q', true, T0);
    expect(s.interval).toBe(1);
    expect(s.due).toBe(T0 + DAY);
    s = review(s, 'q', true, T0 + DAY);
    expect(s.interval).toBe(3);
    s = review(s, 'q', true, T0 + 4 * DAY);
    expect(s.interval).toBe(Math.round(3 * 2.5));
  });
  it('feil svar nullstiller, gir 1 dag og senker ease', () => {
    let s = review(undefined, 'q', true, T0);
    s = review(s, 'q', true, T0 + DAY);
    s = review(s, 'q', false, T0 + 4 * DAY);
    expect(s).toMatchObject({ reps: 0, interval: 1, lapses: 1, ease: 2.3, due: T0 + 5 * DAY });
  });
  it('ease går aldri under minimum', () => {
    let s: SrsState | undefined;
    for (let i = 0; i < 20; i++) s = review(s, 'q', false, T0 + i);
    expect(s!.ease).toBe(MIN_EASE);
  });
  it('replay gir samme svar uansett rekkefølge i lista, og hopper over eksamen', () => {
    const list = [att('q', true, T0), att('q', false, T0 + DAY), att('q', true, T0 + 2 * DAY), att('q', false, T0 + 3 * DAY, { mode: 'exam' })];
    const a = replay(list).get('q');
    const b = replay([...list].reverse()).get('q');
    expect(a).toEqual(b);
    expect(a).toMatchObject({ reps: 1, lapses: 1 });
  });
  it('thai påvirker ikke planleggingen', () => {
    const a = replay([att('q', true, T0, { thaiUsed: true })]).get('q');
    const b = replay([att('q', true, T0, { thaiUsed: false })]).get('q');
    expect(a).toEqual(b);
  });
});

describe('Dagens økt', () => {
  const refs = ['vp-hoyreregel', 'so-skilt', 'fp-veggrep'];
  const pool: PoolItem[] = Array.from({ length: 30 }, (_, i) => ({ itemId: `q${i}`, kind: 'question', temalisteRef: refs[i % 3] }));
  pool.push({ itemId: 'scene-a-01', kind: 'scene', temalisteRef: 'vp-hoyreregel', interactive: true });
  const fixed = () => 0.5;

  it('ny bruker: bare nytt stoff (maks maxNew) og én interaktiv', () => {
    const p = planSession(pool, new Map(), { now: T0, random: fixed, targetItems: 15, maxNew: 6 });
    expect(p.filter((x) => x.reason === 'new')).toHaveLength(6);
    expect(p.filter((x) => x.interactive)).toHaveLength(1);
  });
  it('forfalte kommer med, og det holdes av plass til nytt', () => {
    const srs = new Map<string, SrsState>();
    for (let i = 0; i < 20; i++) srs.set(`q${i}`, { itemId: `q${i}`, ease: 2.5, interval: 1, reps: 1, lapses: 0, due: T0 - i, lastAt: T0 - DAY });
    const p = planSession(pool, srs, { now: T0, random: fixed, targetItems: 15, maxNew: 6 });
    expect(p).toHaveLength(15);
    expect(p.filter((x) => x.reason === 'due')).toHaveLength(8);
    expect(p.filter((x) => x.reason === 'new')).toHaveLength(6);
    // Mest forfalt (q19 har lavest due) er med.
    expect(p.some((x) => x.itemId === 'q19')).toBe(true);
  });
  it('ingen element to ganger', () => {
    const p = planSession(pool, new Map(), { now: T0, targetItems: 15 });
    expect(new Set(p.map((x) => x.itemId)).size).toBe(p.length);
  });
  it('lite innhold: fyller opp med det som forfaller snart', () => {
    const small = pool.slice(0, 4);
    const srs = new Map<string, SrsState>(small.map((p, i) => [p.itemId, { itemId: p.itemId, ease: 2.5, interval: 3, reps: 2, lapses: 0, due: T0 + (i + 1) * DAY, lastAt: T0 }]));
    const p = planSession(small, srs, { now: T0, targetItems: 15 });
    expect(p).toHaveLength(4);
    expect(p.every((x) => x.reason === 'extra')).toBe(true);
  });
  it('interleave unngår samme tema to ganger på rad når det går', () => {
    const items = [
      { temalisteRef: 'a' },
      { temalisteRef: 'a' },
      { temalisteRef: 'a' },
      { temalisteRef: 'b' },
      { temalisteRef: 'b' },
      { temalisteRef: 'c' },
    ];
    const out = interleave(items).map((x) => x.temalisteRef);
    for (let i = 1; i < out.length; i++) expect(out[i]).not.toBe(out[i - 1]);
  });
});

describe('mestring', () => {
  const pool: PoolItem[] = [
    { itemId: 'q1', kind: 'question', temalisteRef: 'vp-hoyreregel' },
    { itemId: 'q2', kind: 'question', temalisteRef: 'vp-hoyreregel' },
    { itemId: 's1', kind: 'sign', temalisteRef: 'so-skilt' },
  ];
  it('bruker de siste N forsøkene', () => {
    expect(itemScore([att('q', false, 1), att('q', true, 2), att('q', true, 3), att('q', true, 4)], 3)).toBe(1);
    expect(itemScore([])).toBeUndefined();
  });
  it('uøvde elementer teller 0 (vektet mot dekning)', () => {
    const m = topicMastery(pool, [att('q1', true, 1)]);
    expect(m.get('vp-hoyreregel')).toMatchObject({ items: 2, practiced: 1, withThai: 0.5 });
  });
  it('skiller med og uten thai', () => {
    const m = topicMastery(pool, [att('q1', true, 1, { thaiUsed: true }), att('q2', true, 2)]).get('vp-hoyreregel')!;
    expect(m.withThai).toBe(1);
    expect(m.withoutThai).toBe(0.5);
  });
  it('foreslår mindre thai etter mange riktige uten thai', () => {
    const many = Array.from({ length: 30 }, (_, i) => att(`q${i}`, true, i));
    expect(suggestLessThai(many)).toBe(true);
    expect(suggestLessThai(many.map((a) => ({ ...a, thaiUsed: true })))).toBe(false);
    expect(suggestLessThai(many.slice(0, 10))).toBe(false);
  });
  it('farger', () => {
    expect(masteryColor(0)).toBe('none');
    expect(masteryColor(0.5)).toBe('red');
    expect(masteryColor(0.7)).toBe('yellow');
    expect(masteryColor(0.9)).toBe('green');
  });
});
