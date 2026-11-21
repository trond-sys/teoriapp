// Laster alt innhold i nettleseren og validerer det med Zod. Ugyldige elementer hoppes over (og logges).
import { z } from 'zod';
import { TEMA_BY_ID } from '../config/temaliste';
import type { PoolItem } from '../domain/types';
import { GlossaryTerm, Question, Sign, YieldScene } from './schema';
import signsRaw from './signs.json';
import glossaryRaw from './glossary.json';

const questionFiles = import.meta.glob<unknown[]>('./questions/*.json', { eager: true, import: 'default' });
const sceneFiles = import.meta.glob<unknown>('./scenes/*.json', { eager: true, import: 'default' });

function parseList<T>(label: string, list: unknown[], schema: z.ZodType<T>): T[] {
  const out: T[] = [];
  for (const item of list) {
    const r = schema.safeParse(item);
    if (r.success) out.push(r.data);
    else console.error(`Ugyldig innhold i ${label}`, item, r.error.issues);
  }
  return out;
}

export const QUESTIONS: Question[] = Object.entries(questionFiles).flatMap(([f, list]) => parseList(f, list, Question));
export const SCENES: YieldScene[] = parseList('scenes', Object.values(sceneFiles), YieldScene);
export const SIGNS: Sign[] = parseList('signs.json', signsRaw as unknown[], Sign);
export const GLOSSARY: GlossaryTerm[] = parseList('glossary.json', glossaryRaw as unknown[], GlossaryTerm);

export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));
export const SCENE_BY_ID = new Map(SCENES.map((s) => [s.id, s]));
export const SIGN_BY_NR = new Map(SIGNS.map((s) => [s.nr, s]));
export const TERM_BY_ID = new Map(GLOSSARY.map((g) => [g.id, g]));

export const signItemId = (nr: string) => `sign-${nr}`;
export const SIGN_TEMA = 'so-skilt';

const weightOf = (ref: string) => (TEMA_BY_ID[ref]?.star ? 1.5 : 1);

/** Alt som kan øves i «Dagens økt» og teller i mestring. */
export const POOL: PoolItem[] = [
  ...QUESTIONS.map((q) => ({ itemId: q.id, kind: 'question' as const, temalisteRef: q.temalisteRef, weight: weightOf(q.temalisteRef) })),
  ...SIGNS.map((s) => ({ itemId: signItemId(s.nr), kind: 'sign' as const, temalisteRef: SIGN_TEMA, weight: weightOf(SIGN_TEMA) })),
  ...SCENES.map((s) => ({ itemId: s.id, kind: 'scene' as const, temalisteRef: s.temalisteRef, interactive: true, weight: weightOf(s.temalisteRef) })),
];

export const signUrl = (file: string) => `${import.meta.env.BASE_URL}signs/${file}`;
