// Retting av rekkefølge-oppgaver mot fasiten (answer.order). Avgjør IKKE vikeplikt – den sammenligner bare
// elevens rekkefølge med gruppene som er lagret i scenen.

export interface OrderGrade {
  correct: boolean;
  /** Par [x, y] der eleven satte x foran y, men y står i en tidligere gruppe i fasiten. */
  violations: [string, string][];
  /** Par som sto etter hverandre i svaret og er i samme gruppe (kunne kjørt samtidig). */
  simultaneous: [string, string][];
}

/**
 * Svaret er riktig når alle er med nøyaktig én gang, og ingen står foran en som er i en tidligere gruppe.
 * Trafikanter i samme gruppe godtas i hvilken som helst rekkefølge.
 */
export function gradeOrder(groups: string[][], answer: string[]): OrderGrade {
  const groupOf = new Map<string, number>();
  groups.forEach((g, i) => g.forEach((id) => groupOf.set(id, i)));
  const violations: [string, string][] = [];
  for (let i = 0; i < answer.length; i++)
    for (let k = i + 1; k < answer.length; k++) {
      const gi = groupOf.get(answer[i]);
      const gk = groupOf.get(answer[k]);
      if (gi !== undefined && gk !== undefined && gk < gi) violations.push([answer[i], answer[k]]);
    }
  const simultaneous: [string, string][] = [];
  for (let i = 0; i + 1 < answer.length; i++) {
    const g = groupOf.get(answer[i]);
    if (g !== undefined && g === groupOf.get(answer[i + 1])) simultaneous.push([answer[i], answer[i + 1]]);
  }
  const all = groups.flat();
  const complete = answer.length === all.length && new Set(answer).size === answer.length && answer.every((id) => groupOf.has(id));
  return { correct: complete && violations.length === 0, violations, simultaneous };
}
