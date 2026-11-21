// Geometri for kryss: retninger, manøvrer og hvilke kjørebaner som krysser hverandre.
// Høyretrafikk. «from: S» betyr at kjøretøyet kommer inn fra sørarmen og kjører nordover inn i krysset.
import type { Dir } from '../../content/schema';

export type Maneuver = 'left' | 'straight' | 'right';
/** Hvor B kommer fra, sett fra A: fra høyre, fra venstre eller møtende. */
export type RelPos = 'right' | 'left' | 'opposite' | 'same';

export const DIRS: Dir[] = ['N', 'E', 'S', 'W'];
const idx = (d: Dir) => DIRS.indexOf(d);
const at = (i: number) => DIRS[((i % 4) + 4) % 4];

/** Dreier en retning med klokka i kvarte omdreininger. */
export function rotateDir(d: Dir, quarterTurns: number): Dir {
  return at(idx(d) + quarterTurns);
}

/**
 * Manøver ut fra hvilken arm man kommer fra og skal til.
 * Fra S (kjører mot nord): til N = rett frem, til E = høyre, til W = venstre.
 */
export function maneuver(from: Dir, to: Dir): Maneuver {
  const d = (idx(to) - idx(from) + 4) % 4;
  // Med klokka N→E→S→W. Fra S (2) til E (1): d = 3 → høyre. Til W (3): d = 1 → venstre. Til N: d = 2 → rett frem.
  if (d === 2) return 'straight';
  if (d === 3) return 'right';
  if (d === 1) return 'left';
  throw new Error(`U-sving fra ${from} til ${to} støttes ikke`);
}

/**
 * Armen som ligger til høyre for en fører som kommer inn fra `from`.
 * Kommer man fra S (kjører nordover), er høyre side øst (E).
 */
export function rightOf(from: Dir): Dir {
  return at(idx(from) - 1);
}
export function leftOf(from: Dir): Dir {
  return at(idx(from) + 1);
}
export function opposite(from: Dir): Dir {
  return at(idx(from) + 2);
}

export function relPos(aFrom: Dir, bFrom: Dir): RelPos {
  if (aFrom === bFrom) return 'same';
  if (bFrom === rightOf(aFrom)) return 'right';
  if (bFrom === leftOf(aFrom)) return 'left';
  return 'opposite';
}

/**
 * Krysser eller fletter banene til to kjøretøy fra ulike armer?
 *
 * Tabellen er hentet fra hvordan banene går i et vanlig firearmet kryss med høyretrafikk:
 * - Møtende: konflikt bare når nøyaktig én av dem svinger til venstre
 *   (venstresving krysser møtende rett frem, og fletter med møtende høyresving).
 *   To møtende som begge svinger til venstre, svinger foran hverandre og krysser ikke.
 * - B fra høyre for A:
 *   A rett frem krysser alle B-manøvrer (B rett frem krysser, B høyre fletter inn i samme arm, B venstre krysser).
 *   A høyre krysser ingen (A legger seg i sin egen bane på armen B kom fra).
 *   A venstre krysser B rett frem (samme utarm) og B venstre, men ikke B høyre.
 * - B fra venstre for A: speilvendt – samme som A sett fra høyre for B.
 */
export function pathsConflict(aFrom: Dir, aTo: Dir, bFrom: Dir, bTo: Dir): boolean {
  const rel = relPos(aFrom, bFrom);
  const ma = maneuver(aFrom, aTo);
  const mb = maneuver(bFrom, bTo);
  if (rel === 'same') return false; // samme arm: kø, håndteres ikke som konflikt
  if (rel === 'opposite') return (ma === 'left') !== (mb === 'left');
  if (rel === 'right') return fromRightConflict(ma, mb);
  return fromRightConflict(mb, ma);
}

function fromRightConflict(a: Maneuver, bFromRight: Maneuver): boolean {
  if (a === 'straight') return true;
  if (a === 'right') return false;
  return bFromRight !== 'right';
}

/** Går banen over gangfeltet på armen `cw`? (inn fra armen eller ut på armen) */
export function crossesCrosswalk(from: Dir, to: Dir | undefined, cw: Dir): boolean {
  return from === cw || to === cw;
}
