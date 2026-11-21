import { describe, expect, it } from 'vitest';
import type { Actor, Arm, ArmControl, Dir, Junction } from '../../src/content/schema';
import { analyze, grade, type SceneInput } from './engine';
import { maneuver, pathsConflict, relPos, rightOf, rotateDir } from './geometry';

// ---------- hjelpere ----------
const arm = (control: ArmControl = 'none', extra: Partial<Arm> = {}): Arm => ({ control, crosswalk: false, tram: false, ...extra });
const cross = (c: Partial<Record<Dir, Arm>> = {}): Junction => ({
  kind: 'cross',
  arms: { N: arm(), E: arm(), S: arm(), W: arm(), ...c },
});
const car = (id: string, from: Dir, to: Dir, extra: Partial<Actor> = {}): Actor => ({
  id,
  kind: 'car',
  color: 'blue',
  from,
  to,
  siren: false,
  circulating: false,
  ...extra,
});
const ped = (id: string, at: Dir): Actor => ({ id, kind: 'pedestrian', color: 'blue', from: at, siren: false, circulating: false });
const norm = (g: string[][]) => g.map((x) => [...x].sort().join('+')).join(' → ');
const order = (s: SceneInput) => {
  const a = analyze(s);
  if (a.error) throw new Error(a.error.message);
  return norm(a.groups);
};

function rotate(s: SceneInput, q: number): SceneInput {
  const arms: Junction['arms'] = {};
  for (const [d, a] of Object.entries(s.junction.arms)) arms[rotateDir(d as Dir, q)] = a;
  return {
    junction: { ...s.junction, arms },
    actors: s.actors.map((a) => ({ ...a, from: rotateDir(a.from, q), to: a.to && rotateDir(a.to, q) })),
  };
}

// ---------- geometri ----------
describe('geometri', () => {
  it('manøvrer fra sør', () => {
    expect(maneuver('S', 'N')).toBe('straight');
    expect(maneuver('S', 'E')).toBe('right');
    expect(maneuver('S', 'W')).toBe('left');
  });
  it('manøvrer fra øst (kjører vestover)', () => {
    expect(maneuver('E', 'W')).toBe('straight');
    expect(maneuver('E', 'N')).toBe('right');
    expect(maneuver('E', 'S')).toBe('left');
  });
  it('høyre side', () => {
    expect(rightOf('S')).toBe('E');
    expect(rightOf('E')).toBe('N');
    expect(rightOf('N')).toBe('W');
    expect(rightOf('W')).toBe('S');
    expect(relPos('S', 'E')).toBe('right');
    expect(relPos('S', 'W')).toBe('left');
    expect(relPos('S', 'N')).toBe('opposite');
  });
  it('konflikter er symmetriske for alle kombinasjoner', () => {
    const dirs: Dir[] = ['N', 'E', 'S', 'W'];
    for (const af of dirs)
      for (const at of dirs)
        for (const bf of dirs)
          for (const bt of dirs) {
            if (af === at || bf === bt || af === bf) continue;
            expect(pathsConflict(af, at, bf, bt), `${af}${at} ${bf}${bt}`).toBe(pathsConflict(bf, bt, af, at));
          }
  });
  it('møtende: rett frem mot rett frem krysser ikke, venstresving krysser', () => {
    expect(pathsConflict('S', 'N', 'N', 'S')).toBe(false);
    expect(pathsConflict('S', 'W', 'N', 'S')).toBe(true);
    expect(pathsConflict('S', 'W', 'N', 'W')).toBe(true); // fletter inn i samme arm
    expect(pathsConflict('S', 'W', 'N', 'E')).toBe(false); // begge til venstre: foran hverandre
    expect(pathsConflict('S', 'E', 'N', 'W')).toBe(false); // begge til høyre
  });
  it('fra høyre: høyresving krysser ikke noe', () => {
    expect(pathsConflict('S', 'E', 'E', 'W')).toBe(false);
    expect(pathsConflict('S', 'E', 'E', 'N')).toBe(false);
    expect(pathsConflict('S', 'E', 'E', 'S')).toBe(false);
  });
  it('fra venstre: høyresving fletter med den som kjører rett frem inn i samme arm', () => {
    expect(pathsConflict('S', 'E', 'W', 'E')).toBe(true);
    expect(pathsConflict('S', 'E', 'W', 'N')).toBe(false);
  });
});

// ---------- regler ----------
describe('høyreregelen (tr. § 7 nr. 2)', () => {
  it('to biler rett frem: den med bil fra høyre viker', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'N'), car('B', 'E', 'W')] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0]).toMatchObject({ yielder: 'A', priority: 'B', rule: 'hoyreregel' });
  });
  it('tre biler: kjede av høyreregel', () => {
    // A fra S, B fra E (høyre for A), C fra N (høyre for B). Alle rett frem.
    // A–C er møtende rett frem: ingen konflikt.
    const s = { junction: cross(), actors: [car('A', 'S', 'N'), car('B', 'E', 'W'), car('C', 'N', 'S')] };
    expect(order(s)).toBe('C → B → A');
  });
  it('fire biler rett frem er fastlåst', () => {
    const s = {
      junction: cross(),
      actors: [car('A', 'S', 'N'), car('B', 'E', 'W'), car('C', 'N', 'S'), car('D', 'W', 'E')],
    };
    expect(analyze(s).error?.kind).toBe('deadlock');
  });
  it('høyresving uten konflikt: begge kan kjøre samtidig', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'E'), car('B', 'E', 'W')] };
    expect(order(s)).toBe('A+B');
  });
  it('gjelder også i T-kryss', () => {
    const j: Junction = { kind: 't', arms: { E: arm(), S: arm(), W: arm() } };
    // A fra S til venstre (W). B fra W rett frem (E) – B kommer fra venstre for A. C fra E rett frem (W) – fra høyre for A.
    const s = { junction: j, actors: [car('A', 'S', 'W'), car('B', 'W', 'E'), car('C', 'E', 'W')] };
    // A viker for C (høyre). B viker for A (A er på Bs høyre side). B og C møtes rett frem: ingen konflikt.
    expect(order(s)).toBe('C → A → B');
  });
});

describe('venstresving mot møtende (tr. § 7 nr. 2 annet punktum)', () => {
  it('venstresvingende viker for møtende rett frem', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'W'), car('B', 'N', 'S')] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0].rule).toBe('venstresving');
  });
  it('venstresvingende viker for møtende høyresving (samme utarm)', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'W'), car('B', 'N', 'W')] };
    expect(order(s)).toBe('B → A');
  });
  it('to møtende venstresvingende kan kjøre samtidig', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'W'), car('B', 'N', 'E')] };
    expect(order(s)).toBe('A+B');
  });
  it('gjelder også på forkjørsveg', () => {
    const j = cross({ N: arm('priority'), S: arm('priority'), E: arm('yield'), W: arm('yield') });
    const s = { junction: j, actors: [car('A', 'S', 'W'), car('B', 'N', 'S')] };
    expect(order(s)).toBe('B → A');
  });
});

describe('skilt (vikeplikt, stopp, forkjørsveg)', () => {
  const j = cross({ N: arm('priority'), S: arm('priority'), E: arm('yield'), W: arm('stop') });
  it('bil med vikepliktskilt viker selv om den andre kommer fra venstre', () => {
    // A fra E (vikeplikt) rett frem. B fra N (forkjørsveg) rett frem: B kommer fra venstre for A? N er høyre for E.
    // Bruk B fra S (venstre for A=E): uten skilt ville B vike, men A har vikepliktskilt.
    const s = { junction: j, actors: [car('A', 'E', 'W'), car('B', 'S', 'N')] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0].rule).toBe('skilt');
  });
  it('to på sideveg med skilt: høyreregelen mellom dem', () => {
    // A fra E (vikeplikt) til venstre (S). B fra W (stopp) rett frem (E). Møtende: A svinger venstre og viker.
    const s = { junction: j, actors: [car('A', 'E', 'S'), car('B', 'W', 'E')] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0].rule).toBe('venstresving');
  });
  it('forkjørsveg og arm uten skilt i samme kryss er ugyldig', () => {
    const bad = cross({ N: arm('priority'), S: arm('priority') });
    expect(analyze({ junction: bad, actors: [car('A', 'S', 'N')] }).error?.kind).toBe('invalid');
  });
});

describe('avkjørselsregelen (tr. § 7 nr. 4)', () => {
  it('den som kommer fra parkeringsplass viker for bil fra venstre', () => {
    const j: Junction = { kind: 't', arms: { E: arm(), W: arm(), S: arm('exit') } };
    const s = { junction: j, actors: [car('A', 'S', 'E'), car('B', 'W', 'E')] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0].rule).toBe('avkjorsel');
  });
  it('avkjørsel viker også for bil med vikepliktskilt', () => {
    const j: Junction = { kind: 'cross', arms: { N: arm('yield'), S: arm('exit'), E: arm('priority'), W: arm('priority') } };
    const s = { junction: j, actors: [car('A', 'S', 'N'), car('B', 'N', 'W')] };
    // B svinger til høyre (fra N mot W)? Fra N kjører man sørover; høyre er W. B høyre, A rett frem møtende → ingen konflikt.
    expect(order(s)).toBe('A+B');
    const s2 = { junction: j, actors: [car('A', 'S', 'N'), car('B', 'N', 'E')] };
    // B svinger til venstre mot møtende A, men A kommer fra avkjørsel og viker likevel.
    expect(order(s2)).toBe('B → A');
    expect(analyze(s2).edges[0].rule).toBe('avkjorsel');
  });
});

describe('gående i gangfelt (tr. § 9 nr. 2)', () => {
  it('bil som svinger over gangfeltet viker for gående', () => {
    const j = cross({ E: arm('none', { crosswalk: true }) });
    const s = { junction: j, actors: [car('A', 'S', 'E'), ped('P', 'E')] };
    expect(order(s)).toBe('P → A');
    expect(analyze(s).edges[0].rule).toBe('gangfelt');
  });
  it('bil som ikke krysser gangfeltet, kan kjøre samtidig', () => {
    const j = cross({ E: arm('none', { crosswalk: true }) });
    expect(order({ junction: j, actors: [car('A', 'S', 'W'), ped('P', 'E')] })).toBe('A+P');
  });
  it('gående uten gangfelt er ugyldig', () => {
    expect(analyze({ junction: cross(), actors: [ped('P', 'E')] }).error?.kind).toBe('invalid');
  });
});

describe('fri veg (tr. § 10)', () => {
  it('utrykning med blålys kjører først, også foran forkjørsveg og gående', () => {
    const j = cross({ N: arm('priority'), S: arm('priority'), E: arm('yield', { crosswalk: true }), W: arm('yield') });
    const s = {
      junction: j,
      actors: [car('A', 'N', 'S'), car('U', 'E', 'W', { kind: 'emergency', siren: true }), ped('P', 'E')],
    };
    const a = analyze(s);
    expect(a.groups[0]).toEqual(['U']);
    expect(a.edges.filter((e) => e.rule === 'utrykning')).toHaveLength(2);
  });
  it('utrykningsbil uten blålys følger vanlige regler', () => {
    const s = { junction: cross(), actors: [car('A', 'S', 'N'), car('U', 'W', 'E', { kind: 'emergency', siren: false })] };
    expect(order(s)).toBe('A → U'); // U har A på sin høyre side
  });
  it('trikk har fri veg, selv fra venstre', () => {
    const j = cross({ W: arm('none', { tram: true }), E: arm('none', { tram: true }) });
    const s = { junction: j, actors: [car('A', 'S', 'N'), car('T', 'W', 'E', { kind: 'tram' })] };
    expect(order(s)).toBe('T → A');
    expect(analyze(s).edges[0].rule).toBe('sporvogn');
  });
  it('gående viker for trikk i gangfeltet', () => {
    const j = cross({ E: arm('none', { tram: true, crosswalk: true }), W: arm('none', { tram: true }) });
    const s = { junction: j, actors: [car('T', 'W', 'E', { kind: 'tram' }), ped('P', 'E')] };
    expect(order(s)).toBe('T → P');
  });
  it('trikk viker for utrykning', () => {
    const j = cross({ W: arm('none', { tram: true }), E: arm('none', { tram: true }) });
    const s = { junction: j, actors: [car('T', 'W', 'E', { kind: 'tram' }), car('U', 'S', 'N', { kind: 'emergency', siren: true })] };
    expect(order(s)).toBe('U → T');
  });
});

describe('rundkjøring', () => {
  const j: Junction = { kind: 'roundabout', arms: { N: arm('yield'), E: arm('yield'), S: arm('yield'), W: arm('yield') } };
  it('den som skal inn, viker for den som er i rundkjøringen', () => {
    const s = { junction: j, actors: [car('A', 'S', 'N'), car('B', 'W', 'E', { circulating: true })] };
    expect(order(s)).toBe('B → A');
    expect(analyze(s).edges[0].rule).toBe('rundkjoring');
  });
  it('to som skal inn fra ulike armer, kan kjøre inn samtidig', () => {
    expect(order({ junction: j, actors: [car('A', 'S', 'N'), car('B', 'N', 'S')] })).toBe('A+B');
  });
});

describe('forrang mellom regler', () => {
  it('skilt går foran høyreregelen', () => {
    const j = cross({ E: arm('yield'), W: arm('yield'), N: arm('priority'), S: arm('priority') });
    // A fra S (forkjørsveg) rett frem, B fra E (vikeplikt) rett frem: B er på As høyre, men B har vikeplikt.
    expect(order({ junction: j, actors: [car('A', 'S', 'N'), car('B', 'E', 'W')] })).toBe('A → B');
  });
  it('avkjørsel går foran venstresving-regelen', () => {
    const j: Junction = { kind: 'cross', arms: { N: arm(), S: arm('exit'), E: arm(), W: arm() } };
    expect(order({ junction: j, actors: [car('A', 'S', 'N'), car('B', 'N', 'E')] })).toBe('B → A');
  });
});

describe('rotasjon', () => {
  const scenes: SceneInput[] = [
    { junction: cross(), actors: [car('A', 'S', 'N'), car('B', 'E', 'W'), car('C', 'N', 'S')] },
    { junction: cross({ E: arm('yield'), W: arm('stop'), N: arm('priority'), S: arm('priority') }), actors: [car('A', 'E', 'S'), car('B', 'W', 'E'), car('C', 'N', 'S')] },
    { junction: { kind: 't', arms: { E: arm(), S: arm('exit', { crosswalk: true }), W: arm() } }, actors: [car('A', 'S', 'W'), car('B', 'E', 'W'), ped('P', 'S')] },
  ];
  it('samme kryss dreid 90°, 180° og 270° gir samme svar', () => {
    for (const s of scenes) {
      const base = order(s);
      for (const q of [1, 2, 3]) expect(order(rotate(s, q))).toBe(base);
    }
  });
});

describe('retting av svar', () => {
  const s = { junction: cross(), actors: [car('A', 'S', 'N'), car('B', 'E', 'W'), car('C', 'S', 'E')] };
  // A og C kommer fra samme arm (kø støttes ikke). s2: C fra W til høyre (S) krysser verken A eller B.
  const s2 = { junction: cross(), actors: [car('A', 'S', 'N'), car('B', 'E', 'W'), car('C', 'W', 'S')] };
  it('kø fra samme arm avvises', () => {
    expect(analyze(s).error?.kind).toBe('invalid');
  });
  it('riktig rekkefølge godtas, også når samtidige byttes om', () => {
    const a = analyze(s2);
    expect(norm(a.groups)).toBe('B+C → A');
    expect(grade(a, ['B', 'C', 'A']).correct).toBe(true);
    expect(grade(a, ['C', 'B', 'A']).correct).toBe(true);
    expect(grade(a, ['C', 'B', 'A']).simultaneous).toEqual([['C', 'B']]);
  });
  it('feil rekkefølge gir brutt regel', () => {
    const g = grade(analyze(s2), ['A', 'B', 'C']);
    expect(g.correct).toBe(false);
    expect(g.violations).toEqual([{ yielder: 'A', priority: 'B', rule: 'hoyreregel' }]);
  });
  it('ufullstendig svar er feil', () => {
    expect(grade(analyze(s2), ['B', 'C']).correct).toBe(false);
  });
});
