// Oversetter et håndlagd scenario (Endring 01) til tegnemodellen SceneView bruker.
// Den oversetter bare utseende (armtype, skilt, kjøretøytype). Den avgjør ikke vikeplikt.
import type { Actor, Arm, ArmControl, Dir, Junction, Scenario, ScenarioKind } from '../content/schema';

/** Det tegningen trenger: en scene, eller en kryss-tegning til en oppgave (uten fasit). */
export type DrawableJunction = Pick<Scenario, 'layout' | 'actors'> & { id: string };
import { exitArm } from '../domain/scenes/geometry';

const KIND: Record<ScenarioKind, Actor['kind']> = {
  bil: 'car',
  buss: 'bus',
  lastebil: 'truck',
  trikk: 'tram',
  utrykning: 'emergency',
  gaende: 'pedestrian',
  syklist: 'bicycle',
};

/** Utseendet på armen: skiltet som står der, eller «avkjørsel» når noen kommer fra parkering e.l. */
function armLook(s: DrawableJunction, d: Dir): ArmControl {
  if (s.actors.some((a) => a.from === d && (a.position === 'fra-parkering' || a.position === 'fra-gardsveg' || a.position === 'fra-sykkelveg'))) return 'exit';
  const nrs = s.layout.signs.filter((x) => x.arm === d).map((x) => x.nr);
  if (nrs.includes('204')) return 'stop';
  if (nrs.includes('202')) return 'yield';
  if (nrs.includes('206')) return 'priority';
  return 'none';
}

/** UI-tekst for trafikanttypen (actor.* i strings.json). */
export const ACTOR_UI_KEY = {
  bil: 'actor.car',
  buss: 'actor.bus',
  lastebil: 'actor.truck',
  trikk: 'actor.tram',
  utrykning: 'actor.emergency',
  gaende: 'actor.pedestrian',
  syklist: 'actor.bicycle',
} as const satisfies Record<ScenarioKind, string>;

/** Plassering når flere trafikanter kommer fra samme arm (bare utseende). */
function offset(s: DrawableJunction, a: Scenario['actors'][number]): { dx?: number; dy?: number } {
  if (a.kind === 'gaende' || a.position === 'inne-i-rundkjoring') return {};
  if (a.position === 'pa-holdeplass') return { dx: 32, dy: 18 }; // i busslomma
  const same = s.actors.filter((x) => x.from === a.from && x.kind !== 'gaende' && x.position !== 'inne-i-rundkjoring');
  if (same.length < 2) return {};
  if (same.some((x) => x.position === 'pa-holdeplass')) return { dy: 70 }; // bak bussen, i feltet
  const bike = same.find((x) => x.kind === 'syklist');
  if (bike && same.length === 2) return a === bike ? { dx: 24, dy: -34 } : { dx: -6, dy: 10 }; // syklist ytterst til høyre, litt foran
  return { dy: same.indexOf(a) * 56 }; // kø
}

export function scenarioToDrawing(s: DrawableJunction): { id: string; junction: Junction; actors: Actor[] } {
  const arms: Junction['arms'] = {};
  for (const d of s.layout.arms) {
    const from = s.actors.filter((a) => a.from === d);
    const look = from.some((a) => a.position === 'fra-gardsveg') ? 'gardsveg' : from.some((a) => a.position === 'fra-sykkelveg') ? 'sykkelveg' : undefined;
    const light = s.layout.lights?.[d];
    const arm: Arm = {
      control: armLook(s, d),
      crosswalk: s.layout.crosswalks.includes(d),
      tram: s.layout.tram.includes(d),
      ...(look ? { look } : {}),
      ...(from.some((a) => a.position === 'pa-holdeplass') ? { busBay: true } : {}),
      ...(light ? { light } : {}),
    };
    arms[d] = arm;
  }
  return {
    id: s.id,
    junction: {
      kind: s.layout.type === 'x-kryss' ? 'cross' : s.layout.type === 't-kryss' ? 't' : 'roundabout',
      arms,
      ...(s.layout.police ? { police: s.layout.police } : {}),
    },
    actors: s.actors.map((a) => ({
      id: a.id,
      kind: KIND[a.kind],
      color: a.color,
      from: a.from,
      to: exitArm(a.from, a.intent),
      siren: a.bluelight,
      circulating: a.position === 'inne-i-rundkjoring',
      ...(a.intent === 'rygger' ? { reversing: true } : {}),
      ...offset(s, a),
    })),
  };
}
