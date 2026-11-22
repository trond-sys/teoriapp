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

export const onArm = (d: Dir, p: Pt) => rot(p, ARM_ANGLE[d]);

// Grunnpunkter for sørarmen. Inn i krysset kjører man nordover i høyre (østre) felt, x = 220.
export const BASE = {
  vehicle: [220, 300] as Pt, // midten av kjøretøyet som venter
  crosswalk: { y1: 246, y2: 266 },
  stopLine: 272,
  sign: [262, 292] as Pt,
  pedestrian: [168, 256] as Pt,
};

/** Plassering og dreining for en trafikant. */
export function actorPose(a: Actor, kind: 'cross' | 't' | 'roundabout'): { at: Pt; angle: number } {
  if (a.kind === 'pedestrian') return { at: onArm(a.from, BASE.pedestrian), angle: ARM_ANGLE[a.from] + 90 };
  if (kind === 'roundabout' && a.circulating) {
    // I rundkjøringen kjører man mot klokka. Plasser kjøretøyet like før innkjøringen ved armen `from`.
    const p: Pt = [C - 50, C + 50];
    return { at: rot(p, ARM_ANGLE[a.from]), angle: ARM_ANGLE[a.from] + 135 };
  }
  const len = a.kind === 'tram' ? 40 : a.kind === 'bus' || a.kind === 'truck' ? 16 : 0;
  const at = onArm(a.from, [BASE.vehicle[0] + (a.dx ?? 0), BASE.vehicle[1] + len / 2 + (a.dy ?? 0)]);
  return { at, angle: ARM_ANGLE[a.from] + (a.reversing ? 180 : 0) };
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
