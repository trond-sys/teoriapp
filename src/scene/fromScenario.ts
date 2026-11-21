// Oversetter et håndlagd scenario (Endring 01) til tegnemodellen SceneView bruker.
// Den oversetter bare utseende (armtype, skilt, kjøretøytype). Den avgjør ikke vikeplikt.
import type { Actor, Arm, ArmControl, Dir, Junction, Scenario, ScenarioKind } from '../content/schema';
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
function armLook(s: Scenario, d: Dir): ArmControl {
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

export function scenarioToDrawing(s: Scenario): { id: string; junction: Junction; actors: Actor[] } {
  const arms: Junction['arms'] = {};
  for (const d of s.layout.arms) {
    const gardsveg = s.actors.some((a) => a.from === d && a.position === 'fra-gardsveg');
    const arm: Arm = {
      control: armLook(s, d),
      crosswalk: s.layout.crosswalks.includes(d),
      tram: s.layout.tram.includes(d),
      ...(gardsveg ? { look: 'gardsveg' as const } : {}),
    };
    arms[d] = arm;
  }
  return {
    id: s.id,
    junction: { kind: s.layout.type === 'x-kryss' ? 'cross' : s.layout.type === 't-kryss' ? 't' : 'roundabout', arms },
    actors: s.actors.map((a) => ({
      id: a.id,
      kind: KIND[a.kind],
      color: a.color,
      from: a.from,
      to: exitArm(a.from, a.intent),
      siren: a.bluelight,
      circulating: a.position === 'inne-i-rundkjoring',
    })),
  };
}
