// Tegnegeometri for scener (ovenfra). Alt tegnes for sørarmen og dreies til riktig arm.
// viewBox 0 0 400 400, sentrum (200, 200). Vegbredde 80 (to felt à 40), kryssflate 160–240.
import type { Actor, Dir } from '../content/schema';

export const C = 200;
export const HALF = 40; // halv vegbredde
export const SIZE = 400;

/** Dreining med klokka (grader) som flytter sørarmen til armen d. */
export const ARM_ANGLE: Record<Dir, number> = { S: 0, W: 90, N: 180, E: 270 };

export type Pt = [number, number];

export function rot([x, y]: Pt, deg: number): Pt {
  const r = (deg * Math.PI) / 180;
  const dx = x - C;
  const dy = y - C;
  return [C + dx * Math.cos(r) - dy * Math.sin(r), C + dx * Math.sin(r) + dy * Math.cos(r)];
}

export function rotVec([x, y]: Pt, deg: number): Pt {
  const r = (deg * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
}

export const onArm = (d: Dir, p: Pt) => rot(p, ARM_ANGLE[d]);

// Grunnpunkter for sørarmen. Inn i krysset kjører man nordover i høyre (østre) felt, x = 220.
export const BASE = {
  vehicle: [220, 300] as Pt, // midten av kjøretøyet som venter
  entry: [220, 250] as Pt, // der banen starter (foran kjøretøyet)
  exit: [180, 330] as Pt, // ut av krysset sørover i vestre felt
  crosswalk: { y1: 246, y2: 266 },
  stopLine: 272,
  sign: [262, 292] as Pt,
  pedestrian: [168, 256] as Pt,
};

/** Retning kjøretøy på armen d kjører inn i krysset. */
export const inDir = (d: Dir): Pt => rotVec([0, -1], ARM_ANGLE[d]);
/** Retning ut av krysset via armen d. */
export const outDir = (d: Dir): Pt => rotVec([0, 1], ARM_ANGLE[d]);

function intersect(p: Pt, r: Pt, q: Pt, s: Pt): Pt | null {
  const cross = r[0] * s[1] - r[1] * s[0];
  if (Math.abs(cross) < 1e-6) return null;
  const t = ((q[0] - p[0]) * s[1] - (q[1] - p[1]) * s[0]) / cross;
  return [p[0] + t * r[0], p[1] + t * r[1]];
}

/** Bane fra venteposisjon til ut av krysset, som kvadratisk Bézier (SVG path). */
export function vehiclePath(from: Dir, to: Dir): string {
  const start = onArm(from, BASE.entry);
  const end = onArm(to, BASE.exit);
  const ctrl = intersect(start, inDir(from), end, outDir(to)) ?? [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  return `M ${start[0]} ${start[1]} Q ${ctrl[0]} ${ctrl[1]} ${end[0]} ${end[1]}`;
}

/** Plassering og dreining for en trafikant. */
export function actorPose(a: Actor, kind: 'cross' | 't' | 'roundabout'): { at: Pt; angle: number } {
  if (a.kind === 'pedestrian') return { at: onArm(a.from, BASE.pedestrian), angle: ARM_ANGLE[a.from] + 90 };
  if (kind === 'roundabout' && a.circulating) {
    // I rundkjøringen kjører man mot klokka. Plasser kjøretøyet like før innkjøringen ved armen `from`.
    const p: Pt = [C - 50, C + 50];
    return { at: rot(p, ARM_ANGLE[a.from]), angle: ARM_ANGLE[a.from] + 135 };
  }
  const len = a.kind === 'tram' ? 40 : a.kind === 'bus' || a.kind === 'truck' ? 16 : 0;
  return { at: onArm(a.from, [BASE.vehicle[0], BASE.vehicle[1] + len / 2]), angle: ARM_ANGLE[a.from] };
}

export const COLORS: Record<string, string> = {
  red: '#c62828',
  blue: '#1e5aa8',
  yellow: '#e0a800',
  green: '#2e7d32',
  white: '#f4f4f4',
  black: '#2b2b2b',
  orange: '#e8710a',
};
