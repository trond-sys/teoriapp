// Ren geometri for scenarier: hvilken arm en intensjon fører til, og om to intensjoner krysser.
// Her finnes INGEN trafikkregler. Resultatet brukes bare til advarsler for et menneske (Endring 01 §4).
// Høyretrafikk. «from: S» betyr at trafikanten kommer inn fra sørarmen og kjører nordover.
import type { Dir, Intent, Scenario, ScenarioActor } from '../../content/schema';

export const DIRS: Dir[] = ['N', 'E', 'S', 'W'];
const idx = (d: Dir) => DIRS.indexOf(d);
const at = (i: number) => DIRS[((i % 4) + 4) % 4];

/** Armen på førerens høyre side. Fra S (kjører nordover) er det E. */
export const rightOf = (from: Dir): Dir => at(idx(from) - 1);
export const leftOf = (from: Dir): Dir => at(idx(from) + 1);
export const opposite = (from: Dir): Dir => at(idx(from) + 2);

/** Armen trafikanten kjører ut av. Gående har ingen utarm. */
export function exitArm(from: Dir, intent: Intent): Dir | undefined {
  if (intent === 'rett-fram') return opposite(from);
  if (intent === 'hoyre') return rightOf(from);
  if (intent === 'venstre') return leftOf(from);
  return undefined;
}

type Rel = 'same' | 'right' | 'left' | 'opposite';
function rel(aFrom: Dir, bFrom: Dir): Rel {
  if (aFrom === bFrom) return 'same';
  if (bFrom === rightOf(aFrom)) return 'right';
  if (bFrom === leftOf(aFrom)) return 'left';
  return 'opposite';
}

type Turn = 'rett-fram' | 'hoyre' | 'venstre';

/** A krysser eller fletter med B, der B kommer fra høyre for A. */
function fromRight(a: Turn, b: Turn): boolean {
  if (a === 'rett-fram') return true; // krysser B rett fram og venstre, fletter med B til høyre
  if (a === 'hoyre') return false; // A legger seg i sitt eget felt
  return b !== 'hoyre'; // A til venstre: samme utarm som B rett fram, krysser B til venstre
}

/**
 * Krysser eller fletter intensjonene til to kjøretøy fra ulike armer i et vanlig kryss?
 * To møtende som begge skal til venstre regnes som IKKE kryssende: trafikkreglene § 6 nr. 4 sier at de
 * «kan svinges til venstre for hverandre». Hvordan de passerer, påstår vi ikke noe om.
 */
export function vehiclesCross(aFrom: Dir, a: Turn, bFrom: Dir, b: Turn): boolean {
  const r = rel(aFrom, bFrom);
  if (r === 'same') return false;
  if (r === 'opposite') return (a === 'venstre') !== (b === 'venstre');
  if (r === 'right') return fromRight(a, b);
  return fromRight(b, a);
}

/** 'yes' = krysser, 'no' = krysser ikke, 'unknown' = geometrien kan ikke si det (da gis ingen advarsel). */
export type Crossing = 'yes' | 'no' | 'unknown';

export function intentsCross(layout: Scenario['layout'], a: ScenarioActor, b: ScenarioActor): Crossing {
  const aPed = a.kind === 'gaende';
  const bPed = b.kind === 'gaende';
  if (aPed && bPed) return 'no';
  if (aPed || bPed) {
    // Gående krysser armen de står ved. Et kjøretøy krysser den når det kommer inn derfra eller kjører ut der.
    const ped = aPed ? a : b;
    const veh = aPed ? b : a;
    if (layout.type === 'rundkjoring' && veh.position === 'inne-i-rundkjoring') return 'unknown';
    return veh.from === ped.from || exitArm(veh.from, veh.intent) === ped.from ? 'yes' : 'no';
  }
  if (layout.type === 'rundkjoring') {
    const aIn = a.position === 'inne-i-rundkjoring';
    const bIn = b.position === 'inne-i-rundkjoring';
    if (aIn !== bIn) return 'yes';
    return 'unknown'; // to som skal inn fra ulike armer, eller to som er inne: ikke avklart (funn B5)
  }
  if (a.intent === 'krysser' || b.intent === 'krysser') return 'unknown';
  return vehiclesCross(a.from, a.intent, b.from, b.intent) ? 'yes' : 'no';
}
