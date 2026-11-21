import { describe, expect, it } from 'vitest';
import { gradeOrder } from './grade';

describe('gradeOrder (retting mot lagret fasit)', () => {
  it('riktig rekkefølge', () => {
    expect(gradeOrder([['B'], ['A']], ['B', 'A'])).toEqual({ correct: true, violations: [], simultaneous: [] });
  });
  it('feil rekkefølge gir brudd', () => {
    const g = gradeOrder([['B'], ['C'], ['A']], ['A', 'B', 'C']);
    expect(g.correct).toBe(false);
    expect(g.violations).toEqual([
      ['A', 'B'],
      ['A', 'C'],
    ]);
  });
  it('samme gruppe godtas i begge rekkefølger og meldes som samtidig', () => {
    expect(gradeOrder([['B', 'C'], ['A']], ['C', 'B', 'A'])).toEqual({ correct: true, violations: [], simultaneous: [['C', 'B']] });
    expect(gradeOrder([['A', 'B']], ['B', 'A']).correct).toBe(true);
  });
  it('ufullstendig, dobbelt eller ukjent svar er feil', () => {
    expect(gradeOrder([['B'], ['A']], ['B']).correct).toBe(false);
    expect(gradeOrder([['B'], ['A']], ['B', 'B']).correct).toBe(false);
    expect(gradeOrder([['B'], ['A']], ['B', 'X']).correct).toBe(false);
  });
});
