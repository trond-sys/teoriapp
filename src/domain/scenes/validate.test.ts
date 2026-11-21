import { describe, expect, it } from 'vitest';
import { Scenario } from '../../content/schema';
import { exitArm, intentsCross, vehiclesCross } from './geometry';
import { validateScenario, type ScenarioContext } from './validate';

const l3 = (s: string) => ({ nb: `${s} nb`, en: `${s} en`, th: `${s} th` });
const ctx: ScenarioContext = { signNrs: new Set(['202', '204', '206']), termIds: new Set(['vikeplikt']) };
const src = { ref: 'Trafikkreglene § 7 nr. 2', quote: 'Kjørende har vikeplikt for kjøretøy som kommer fra høyre.' };

/** Gyldig høyreregel-scene som utgangspunkt. Overstyr felt for å lage feil. */
function scene(over: Record<string, unknown> = {}) {
  return Scenario.parse({
    id: 'vp-scene-test-01',
    topic: 'vikeplikt',
    subtopic: 'hoyreregel',
    temalisteRef: 'vp-hoyreregel',
    tier: 'kjerne',
    difficulty: 1,
    layout: { type: 'x-kryss', arms: ['N', 'E', 'S', 'W'] },
    actors: [
      { id: 'A', kind: 'bil', from: 'S', intent: 'rett-fram' },
      { id: 'B', kind: 'bil', from: 'E', intent: 'rett-fram' },
    ],
    question: { type: 'rekkefolge', prompt: l3('Hvem kjører først?') },
    answer: { order: [['B'], ['A']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('A viker'), source: src }] },
    glossaryTerms: ['vikeplikt'],
    verified: false,
    thReview: 'pending',
    ...over,
  });
}
const msgs = (s: ReturnType<typeof scene>, level: 'error' | 'warning') =>
  validateScenario(s, ctx)
    .filter((i) => i.level === level)
    .map((i) => i.message)
    .join('\n');

describe('geometri (ingen trafikkregler)', () => {
  it('utarm ut fra intensjon', () => {
    expect(exitArm('S', 'rett-fram')).toBe('N');
    expect(exitArm('S', 'hoyre')).toBe('E');
    expect(exitArm('S', 'venstre')).toBe('W');
    expect(exitArm('E', 'hoyre')).toBe('N');
    expect(exitArm('S', 'krysser')).toBeUndefined();
  });
  it('kryssing er symmetrisk', () => {
    const dirs = ['N', 'E', 'S', 'W'] as const;
    const turns = ['rett-fram', 'hoyre', 'venstre'] as const;
    for (const af of dirs) for (const bf of dirs) for (const a of turns) for (const b of turns) {
      if (af === bf) continue;
      expect(vehiclesCross(af, a, bf, b)).toBe(vehiclesCross(bf, b, af, a));
    }
  });
  it('kjente tilfeller', () => {
    expect(vehiclesCross('S', 'rett-fram', 'E', 'rett-fram')).toBe(true);
    expect(vehiclesCross('S', 'rett-fram', 'N', 'rett-fram')).toBe(false);
    expect(vehiclesCross('S', 'venstre', 'N', 'rett-fram')).toBe(true);
    expect(vehiclesCross('S', 'venstre', 'N', 'hoyre')).toBe(true); // samme utarm
    expect(vehiclesCross('S', 'hoyre', 'E', 'rett-fram')).toBe(false);
  });
  it('to møtende som begge svinger til venstre regnes som ikke kryssende (§ 6 nr. 4)', () => {
    expect(vehiclesCross('S', 'venstre', 'N', 'venstre')).toBe(false);
  });
  it('gående krysser bare kjøretøy som kommer fra eller skal til armen', () => {
    const layout = scene().layout;
    const p = { id: 'P', kind: 'gaende', from: 'E', intent: 'krysser', bluelight: false, color: 'blue' } as const;
    expect(intentsCross(layout, p, { ...p, id: 'A', kind: 'bil', from: 'S', intent: 'hoyre' })).toBe('yes');
    expect(intentsCross(layout, p, { ...p, id: 'A', kind: 'bil', from: 'S', intent: 'venstre' })).toBe('no');
  });
  it('rundkjøring: inne mot på veg inn krysser, to på veg inn er ukjent', () => {
    const layout = { ...scene().layout, type: 'rundkjoring' as const };
    const a = { id: 'A', kind: 'bil', from: 'S', intent: 'rett-fram', bluelight: false, color: 'blue' } as const;
    expect(intentsCross(layout, a, { ...a, id: 'B', from: 'W', position: 'inne-i-rundkjoring' })).toBe('yes');
    expect(intentsCross(layout, a, { ...a, id: 'B', from: 'N' })).toBe('unknown');
  });
});

describe('validateScenario: struktur', () => {
  it('gyldig scene gir ingen feil eller advarsler', () => {
    expect(validateScenario(scene(), ctx)).toEqual([]);
  });
  it('trafikant som mangler i order, eller står to ganger', () => {
    expect(msgs(scene({ answer: { order: [['B']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('x'), source: src }] } }), 'error')).toMatch(/A står 0 ganger/);
    expect(msgs(scene({ answer: { order: [['B'], ['A', 'B']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('x'), source: src }] } }), 'error')).toMatch(/B står 2 ganger/);
  });
  it('ukjent trafikant i steg eller order', () => {
    const s = scene({ answer: { order: [['B'], ['A', 'C']], steps: [{ who: 'C', yieldsTo: ['D'], explanation: l3('x'), source: src }] } });
    const e = msgs(s, 'error');
    expect(e).toMatch(/order nevner C/);
    expect(e).toMatch(/C finnes ikke/);
    expect(e).toMatch(/D, som ikke finnes/);
  });
  it('steg som ikke stemmer med rekkefølgen', () => {
    const s = scene({ answer: { order: [['A'], ['B']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('x'), source: src }] } });
    expect(msgs(s, 'error')).toMatch(/B står ikke før A/);
  });
  it('skilt, gangfelt og lys på armer som ikke finnes, og ukjent skilt', () => {
    const s = scene({
      layout: { type: 't-kryss', arms: ['E', 'S', 'W'], signs: [{ arm: 'N', nr: '999' }], crosswalks: ['N'], lights: { N: 'gronn' } },
      actors: [
        { id: 'A', kind: 'bil', from: 'S', intent: 'venstre' },
        { id: 'B', kind: 'bil', from: 'E', intent: 'rett-fram' },
      ],
    });
    const e = msgs(s, 'error');
    expect(e).toMatch(/skilt 999 står på armen N/);
    expect(e).toMatch(/skilt 999 finnes ikke/);
    expect(e).toMatch(/gangfelt på armen N/);
    expect(e).toMatch(/trafikklys på armen N/);
  });
  it('intensjon mot en arm som ikke finnes', () => {
    const s = scene({ layout: { type: 't-kryss', arms: ['E', 'S', 'W'] } });
    expect(msgs(s, 'error')).toMatch(/A skal rett-fram fra S, men armen N finnes ikke/);
  });
  it('kjerne krever temalisteRef', () => {
    expect(msgs(scene({ temalisteRef: undefined }), 'error')).toMatch(/temalisteRef/);
    expect(msgs(scene({ temalisteRef: undefined, tier: 'dybde' }), 'error')).toBe('');
  });
  it('mangler sitat eller språk: skjemaet avviser', () => {
    expect(() => scene({ answer: { order: [['B'], ['A']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('x'), source: { ref: 'Trafikkreglene § 7' } }] } })).toThrow();
    expect(() => scene({ question: { type: 'rekkefolge', prompt: { nb: 'x', en: 'y' } } })).toThrow();
  });
  it('blått lys bare på utrykning, og gående må krysse', () => {
    const s = scene({
      actors: [
        { id: 'A', kind: 'bil', from: 'S', intent: 'rett-fram', bluelight: true },
        { id: 'B', kind: 'gaende', from: 'E', intent: 'rett-fram' },
      ],
    });
    const e = msgs(s, 'error');
    expect(e).toMatch(/A har blått lys/);
    expect(e).toMatch(/B er gående og må ha intent «krysser»/);
  });
  it('ja-nei og velg krever fasit', () => {
    expect(msgs(scene({ question: { type: 'ja-nei', prompt: l3('Har A vikeplikt?') } }), 'error')).toMatch(/answer\.yes/);
    expect(msgs(scene({ question: { type: 'velg', prompt: l3('Hva gjør A?'), options: [{ id: 'a', text: l3('a') }, { id: 'b', text: l3('b') }] } }), 'error')).toMatch(/answer\.correct/);
  });
});

describe('validateScenario: geometriske advarsler', () => {
  it('kryssende intensjoner i samme gruppe', () => {
    const s = scene({ answer: { order: [['A', 'B']], steps: [{ who: 'A', yieldsTo: [], explanation: l3('x'), source: src }] } });
    expect(msgs(s, 'warning')).toMatch(/A og B står i samme gruppe/);
  });
  it('vikeplikt mot en som ikke krysser', () => {
    const s = scene({
      actors: [
        { id: 'A', kind: 'bil', from: 'S', intent: 'hoyre' },
        { id: 'B', kind: 'utrykning', from: 'W', intent: 'rett-fram', bluelight: true },
      ],
      answer: { order: [['B'], ['A']], steps: [{ who: 'A', yieldsTo: ['B'], explanation: l3('x'), source: src }] },
    });
    // A til høyre (mot E) og B rett fram fra W (mot E) fletter – krysser. Bytt B til N for å få «krysser ikke».
    expect(msgs(s, 'warning')).toBe('');
    const s2 = scene({ ...s, actors: [s.actors[0], { ...s.actors[1], from: 'N', intent: 'rett-fram' }] });
    expect(msgs(s2, 'warning')).toMatch(/A viker for B, men intensjonene deres krysser ikke/);
  });
  it('to møtende venstresvingere samtidig gir ingen advarsel', () => {
    const s = scene({
      actors: [
        { id: 'A', kind: 'bil', from: 'S', intent: 'venstre' },
        { id: 'B', kind: 'bil', from: 'N', intent: 'venstre' },
      ],
      answer: { order: [['A', 'B']], steps: [{ who: 'A', yieldsTo: [], explanation: l3('x'), source: src }] },
    });
    expect(validateScenario(s, ctx)).toEqual([]);
  });
});
