// IndexedDB via Dexie (PLAN-fase0 §3.2). attempts og exams legges bare til; srs er en cache som kan regnes ut på nytt.
import Dexie, { type Table } from 'dexie';
import { review } from '../domain/srs';
import type { Attempt, SrsState } from '../domain/types';

export interface SettingRow {
  key: string;
  value: unknown;
}

/** Fase 2. Tabellen finnes allerede, så skjemaet ikke må migreres senere. */
export interface ExamRecord {
  id: string;
  at: number;
  itemIds: string[];
  answers: Record<string, string>;
  score: number;
  lang: 'en' | 'nb';
  durationMs: number;
  thaiUsed: boolean;
}

export interface ThReport {
  id: string;
  itemId: string;
  /** Hvilket felt teksten står i, f.eks. «prompt» eller «options.b.text». */
  field: string;
  current: string;
  suggestion: string;
  comment: string;
  status: 'new' | 'exported' | 'fixed';
  at: number;
}

export class TeoriDB extends Dexie {
  settings!: Table<SettingRow, string>;
  attempts!: Table<Attempt, string>;
  srs!: Table<SrsState, string>;
  exams!: Table<ExamRecord, string>;
  thReports!: Table<ThReport, string>;

  constructor(name = 'teori-b') {
    super(name);
    this.version(1).stores({
      settings: 'key',
      attempts: 'id, itemId, [temalisteRef+at], at',
      srs: 'itemId, due',
      exams: 'id, at',
      thReports: 'id, itemId, status',
    });
  }
}

export const db = new TeoriDB();

export const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

/** Lagrer et svar og oppdaterer SRS-cachen i samme transaksjon. */
export async function recordAttempt(a: Omit<Attempt, 'id'>, database: TeoriDB = db): Promise<Attempt> {
  const attempt: Attempt = { ...a, id: uuid() };
  await database.transaction('rw', database.attempts, database.srs, async () => {
    await database.attempts.add(attempt);
    if (attempt.mode !== 'exam') {
      const prev = await database.srs.get(attempt.itemId);
      await database.srs.put(review(prev, attempt.itemId, attempt.correct, attempt.at));
    }
  });
  return attempt;
}

/** Ber nettleseren om varig lagring (Chrome godtar det normalt for installerte apper). */
export async function requestPersist(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
