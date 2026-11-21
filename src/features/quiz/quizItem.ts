// Felles visningsmodell for alt som vises som flervalg: oppgaver fra banken og genererte skiltoppgaver.
import type { L3, Option, Question, Sign } from '../../content/schema';
import { ui } from '../../i18n/strings';
import { signItemId, SIGN_TEMA } from '../../content/index';
import type { ItemKind } from '../../domain/types';

export interface QuizItem {
  itemId: string;
  kind: ItemKind;
  temalisteRef: string;
  prompt: L3;
  options: Option[];
  correct: string;
  explanation: L3;
  thaiContrast?: L3;
  media?: { scene?: string; sign?: string; signs?: Record<string, string> };
  roadTextNb: string[];
  glossaryTerms: string[];
  source: string;
  sourceUrl?: string;
  verified: boolean;
}

export function fromQuestion(q: Question): QuizItem {
  return {
    itemId: q.id,
    kind: 'question',
    temalisteRef: q.temalisteRef,
    prompt: q.prompt,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    thaiContrast: q.thaiContrast,
    media: q.media,
    roadTextNb: q.roadTextNb,
    glossaryTerms: q.glossaryTerms,
    source: q.source,
    sourceUrl: q.sourceUrl,
    verified: q.verified,
  };
}

const IDS = ['a', 'b', 'c', 'd'];

function shuffle<T>(xs: T[], rnd: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Velger feilsvar: helst fra samme skiltgruppe, så oppgaven blir reell. */
export function pickDistractors(sign: Sign, all: Sign[], n: number, rnd: () => number): Sign[] {
  const others = all.filter((s) => s.nr !== sign.nr);
  const same = shuffle(others.filter((s) => s.group === sign.group), rnd);
  const rest = shuffle(others.filter((s) => s.group !== sign.group), rnd);
  return [...same, ...rest].slice(0, n);
}

/** «Hva betyr skiltet?» – skiltet vises, svarene er navn. */
export function signMeaningItem(sign: Sign, all: Sign[], rnd: () => number = Math.random): QuizItem {
  const opts = shuffle([sign, ...pickDistractors(sign, all, 3, rnd)], rnd);
  return {
    itemId: signItemId(sign.nr),
    kind: 'sign',
    temalisteRef: SIGN_TEMA,
    prompt: ui('signs.quizMeaning'),
    options: opts.map((s, i) => ({ id: IDS[i], text: s.name })),
    correct: IDS[opts.indexOf(sign)],
    explanation: sign.meaning,
    media: { sign: sign.nr },
    roadTextNb: [],
    glossaryTerms: sign.glossaryTerms,
    source: sign.source,
    sourceUrl: sign.sourceUrl,
    verified: sign.verified,
  };
}

/** «Finn skiltet» – navnet vises, svarene er skilt. */
export function signFindItem(sign: Sign, all: Sign[], rnd: () => number = Math.random): QuizItem {
  const opts = shuffle([sign, ...pickDistractors(sign, all, 3, rnd)], rnd);
  const p = ui('signs.findPrompt');
  return {
    itemId: signItemId(sign.nr),
    kind: 'sign',
    temalisteRef: SIGN_TEMA,
    prompt: { nb: p.nb.replace('{a}', sign.name.nb), en: p.en.replace('{a}', sign.name.en), th: p.th.replace('{a}', sign.name.th) },
    options: opts.map((s, i) => ({ id: IDS[i], text: ui('signs.nr', { a: s.nr }) })),
    correct: IDS[opts.indexOf(sign)],
    explanation: sign.meaning,
    media: { signs: Object.fromEntries(opts.map((s, i) => [IDS[i], s.nr])) },
    roadTextNb: [],
    glossaryTerms: sign.glossaryTerms,
    source: sign.source,
    sourceUrl: sign.sourceUrl,
    verified: sign.verified,
  };
}
