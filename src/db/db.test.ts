import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { replay } from '../domain/srs';
import { recordAttempt, TeoriDB } from './db';
import { buildExport } from './export';

describe('Dexie', () => {
  it('lagrer forsøk og holder SRS-cachen lik replay', async () => {
    const d = new TeoriDB('test-' + Math.random());
    const base = { kind: 'question' as const, temalisteRef: 'vp-hoyreregel', ms: 1, thaiUsed: false, scaffoldAtTime: 'bro' as const, lang: 'en' as const, mode: 'today' as const };
    await recordAttempt({ ...base, itemId: 'q1', correct: true, at: 1000 }, d);
    await recordAttempt({ ...base, itemId: 'q1', correct: false, at: 2000 }, d);
    await recordAttempt({ ...base, itemId: 'q2', correct: true, at: 3000 }, d);
    const attempts = await d.attempts.toArray();
    expect(attempts).toHaveLength(3);
    const cached = await d.srs.toArray();
    const derived = replay(attempts);
    for (const s of cached) expect(s).toEqual(derived.get(s.itemId));
    const exp = await buildExport(d);
    expect(exp.tables.attempts).toHaveLength(3);
    expect(exp.schemaVersion).toBe(1);
  });
});
