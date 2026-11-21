// REVISJONSVERKTØY (Endring 01, steg 5). Den gamle regelmotoren brukes bare av scripts/audit-scenes.ts for å
// lage docs/scene-audit.md. Den avgjør ikke noe i appen. Slettes når alle kjernescener er verifisert.
// Vikeplikt-motoren: fra kryss + trafikanter til hvem som viker for hvem, og i hvilken rekkefølge de kan kjøre.
import type { Actor, ArmControl, Junction } from '../../src/content/schema';
import { crossesCrosswalk, maneuver, pathsConflict, relPos } from './geometry';
import type { RuleId } from './rules';

/** `yielder` har vikeplikt for `priority`, etter regelen `rule`. */
export interface YieldEdge {
  yielder: string;
  priority: string;
  rule: RuleId;
}

export type AnalysisError =
  | { kind: 'deadlock'; ids: string[]; message: string }
  | { kind: 'unresolved'; ids: string[]; message: string }
  | { kind: 'invalid'; ids: string[]; message: string };

export interface Analysis {
  edges: YieldEdge[];
  /** Lagvis rekkefølge. De i samme gruppe kan kjøre samtidig. */
  groups: string[][];
  error?: AnalysisError;
}

export interface SceneInput {
  junction: Junction;
  actors: Actor[];
}

const isVehicle = (a: Actor) => a.kind !== 'pedestrian';
const hasSiren = (a: Actor) => a.kind === 'emergency' && a.siren;

/** Hvor «tung» vikeplikten fra armen er. Høyere tall viker for lavere. */
function rank(c: ArmControl | undefined): number {
  if (c === 'exit') return 2;
  if (c === 'yield' || c === 'stop') return 1;
  return 0;
}

type Decision = { yielder: Actor; priority: Actor; rule: RuleId } | 'none' | 'unresolved';

function vehiclesConflict(j: Junction, a: Actor, b: Actor): boolean {
  if (j.kind === 'roundabout') return a.circulating !== b.circulating; // se regelen rundkjoring
  return pathsConflict(a.from, a.to!, b.from, b.to!);
}

/** Avgjør ett par. Reglene prøves i fast forrang (se RULE_ORDER i rules.ts). */
export function decide(j: Junction, a: Actor, b: Actor): Decision {
  // 1. Utrykning med blålys: alle andre gir fri veg, uansett om banene krysser.
  if (hasSiren(a) !== hasSiren(b)) {
    return hasSiren(a) ? { yielder: b, priority: a, rule: 'utrykning' } : { yielder: a, priority: b, rule: 'utrykning' };
  }
  if (hasSiren(a) && hasSiren(b)) {
    return isVehicle(a) && isVehicle(b) && vehiclesConflict(j, a, b) ? 'unresolved' : 'none';
  }

  // 2. Trikk: alle andre trafikanter gir fri veg når banene krysser.
  const aTram = a.kind === 'tram';
  const bTram = b.kind === 'tram';
  if (aTram !== bTram) {
    const tram = aTram ? a : b;
    const other = aTram ? b : a;
    const conflict = isVehicle(other)
      ? vehiclesConflict(j, tram, other)
      : crossesCrosswalk(tram.from, tram.to, other.from);
    return conflict ? { yielder: other, priority: tram, rule: 'sporvogn' } : 'none';
  }

  // 3. Gående i gangfelt: kjørende som krysser gangfeltet, har vikeplikt.
  if (!isVehicle(a) || !isVehicle(b)) {
    if (!isVehicle(a) && !isVehicle(b)) return 'none';
    const ped = isVehicle(a) ? b : a;
    const veh = isVehicle(a) ? a : b;
    return crossesCrosswalk(veh.from, veh.to, ped.from) ? { yielder: veh, priority: ped, rule: 'gangfelt' } : 'none';
  }

  // Herfra: to kjøretøy.
  if (!vehiclesConflict(j, a, b)) return 'none';

  // 4. Rundkjøring: den som skal inn, viker for den som allerede kjører i rundkjøringen.
  if (j.kind === 'roundabout') {
    return a.circulating ? { yielder: b, priority: a, rule: 'rundkjoring' } : { yielder: a, priority: b, rule: 'rundkjoring' };
  }

  // 5–6. Avkjørsel og skilt.
  const ca = j.arms[a.from]?.control;
  const cb = j.arms[b.from]?.control;
  const ra = rank(ca);
  const rb = rank(cb);
  if (ra !== rb) {
    const [yielder, priority, c] = ra > rb ? [a, b, ca] : [b, a, cb];
    return { yielder, priority, rule: c === 'exit' ? 'avkjorsel' : 'skilt' };
  }

  // 7. Møtende: den som svinger til venstre, viker.
  const rel = relPos(a.from, b.from);
  if (rel === 'opposite') {
    const aLeft = maneuver(a.from, a.to!) === 'left';
    return aLeft ? { yielder: a, priority: b, rule: 'venstresving' } : { yielder: b, priority: a, rule: 'venstresving' };
  }

  // 8. Høyreregelen.
  if (rel === 'right') return { yielder: a, priority: b, rule: 'hoyreregel' };
  if (rel === 'left') return { yielder: b, priority: a, rule: 'hoyreregel' };
  return 'unresolved';
}

function validate(scene: SceneInput): AnalysisError | undefined {
  const { junction: j, actors } = scene;
  for (const a of actors) {
    if (!j.arms[a.from]) return { kind: 'invalid', ids: [a.id], message: `${a.id}: armen ${a.from} finnes ikke` };
    if (isVehicle(a)) {
      if (!a.to || !j.arms[a.to] || a.to === a.from)
        return { kind: 'invalid', ids: [a.id], message: `${a.id}: ugyldig «to»` };
    } else if (!j.arms[a.from]?.crosswalk) {
      return { kind: 'invalid', ids: [a.id], message: `${a.id}: ingen gangfelt ved armen ${a.from}` };
    }
  }
  const vehicles = actors.filter(isVehicle);
  for (let i = 0; i < vehicles.length; i++)
    for (let k = i + 1; k < vehicles.length; k++)
      if (vehicles[i].from === vehicles[k].from && !(j.kind === 'roundabout' && vehicles[i].circulating !== vehicles[k].circulating))
        return {
          kind: 'invalid',
          ids: [vehicles[i].id, vehicles[k].id],
          message: `${vehicles[i].id} og ${vehicles[k].id} kommer fra samme arm (kø støttes ikke)`,
        };
  const arms = Object.values(j.arms);
  if (j.kind !== 'roundabout' && arms.some((a) => a?.control === 'priority') && arms.some((a) => a?.control === 'none'))
    return { kind: 'invalid', ids: [], message: 'forkjørsveg og arm uten skilt i samme kryss' };
  return undefined;
}

export function analyze(scene: SceneInput): Analysis {
  const invalid = validate(scene);
  if (invalid) return { edges: [], groups: [], error: invalid };

  const { actors, junction } = scene;
  const edges: YieldEdge[] = [];
  for (let i = 0; i < actors.length; i++) {
    for (let k = i + 1; k < actors.length; k++) {
      const d = decide(junction, actors[i], actors[k]);
      if (d === 'none') continue;
      if (d === 'unresolved') {
        return {
          edges,
          groups: [],
          error: { kind: 'unresolved', ids: [actors[i].id, actors[k].id], message: `kan ikke avgjøre ${actors[i].id} mot ${actors[k].id}` },
        };
      }
      edges.push({ yielder: d.yielder.id, priority: d.priority.id, rule: d.rule });
    }
  }

  // Lagvis topologisk sortering (Kahn). De uten utestående vikeplikt kjører i samme gruppe.
  const remaining = new Set(actors.map((a) => a.id));
  const groups: string[][] = [];
  while (remaining.size) {
    const ready = actors
      .map((a) => a.id)
      .filter((id) => remaining.has(id) && !edges.some((e) => e.yielder === id && remaining.has(e.priority)));
    if (!ready.length) {
      const ids = [...remaining];
      return {
        edges,
        groups,
        error: { kind: 'deadlock', ids, message: `fastlåst: ${ids.join(', ')} venter på hverandre` },
      };
    }
    groups.push(ready);
    ready.forEach((id) => remaining.delete(id));
  }
  return { edges, groups };
}

export interface Grade {
  correct: boolean;
  /** Vikeplikter eleven brøt: `yielder` ble satt foran `priority`. */
  violations: YieldEdge[];
  /** Par som sto etter hverandre i svaret, men kunne ha kjørt samtidig. */
  simultaneous: [string, string][];
}

/**
 * Retter en rekkefølge. Svaret er riktig når ingen er satt foran en de skal vike for.
 * Kjøretøy som kan kjøre samtidig, godtas i begge rekkefølger.
 */
export function grade(analysis: Analysis, answer: string[]): Grade {
  const pos = new Map(answer.map((id, i) => [id, i]));
  const violations = analysis.edges.filter((e) => {
    const y = pos.get(e.yielder);
    const p = pos.get(e.priority);
    return y === undefined || p === undefined || y < p;
  });
  const groupOf = new Map<string, number>();
  analysis.groups.forEach((g, i) => g.forEach((id) => groupOf.set(id, i)));
  const simultaneous: [string, string][] = [];
  for (let i = 0; i + 1 < answer.length; i++) {
    const a = answer[i];
    const b = answer[i + 1];
    if (groupOf.get(a) !== undefined && groupOf.get(a) === groupOf.get(b)) simultaneous.push([a, b]);
  }
  const complete = answer.length === analysis.groups.flat().length && new Set(answer).size === answer.length;
  return { correct: complete && violations.length === 0, violations, simultaneous };
}
