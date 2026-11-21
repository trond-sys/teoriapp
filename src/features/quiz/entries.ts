// Gjør om øvbare elementer (itemId) til det runneren viser.
import { QUESTION_BY_ID, SCENE_BY_ID, SIGNS, SIGN_BY_NR } from '../../content/index';
import type { PoolItem } from '../../domain/types';
import type { Entry } from './QuestionRunner';
import { fromQuestion, signMeaningItem } from './quizItem';

export function toEntry(p: Pick<PoolItem, 'itemId' | 'kind'>, rnd: () => number = Math.random): Entry | null {
  if (p.kind === 'question') {
    const q = QUESTION_BY_ID.get(p.itemId);
    return q ? { type: 'quiz', item: fromQuestion(q) } : null;
  }
  if (p.kind === 'scene') {
    const s = SCENE_BY_ID.get(p.itemId);
    return s ? { type: 'scene', scene: s } : null;
  }
  if (p.kind === 'sign') {
    const s = SIGN_BY_NR.get(p.itemId.replace(/^sign-/, ''));
    return s && SIGNS.length >= 2 ? { type: 'quiz', item: signMeaningItem(s, SIGNS, rnd) } : null;
  }
  return null;
}

export function toEntries(items: Pick<PoolItem, 'itemId' | 'kind'>[]): Entry[] {
  return items.map((p) => toEntry(p)).filter((e): e is Entry => e !== null);
}
