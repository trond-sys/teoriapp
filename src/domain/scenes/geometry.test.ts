import { describe, expect, it } from 'vitest';
import type { ScenarioActor, ScenarioLayout } from '../../content/schema';
import { intentsCross } from './geometry';

const layout: ScenarioLayout = { type: 'x-kryss', arms: ['N', 'E', 'S', 'W'], signs: [], crosswalks: [], tram: [], lights: null, police: null };
const act = (id: string, over: Partial<ScenarioActor>): ScenarioActor => ({ id, kind: 'bil', from: 'S', intent: 'rett-fram', bluelight: false, color: 'blue', ...over });

describe('geometri: trafikanter fra samme arm', () => {
  it('buss fra holdeplass krysser bilen bak i samme felt', () => {
    expect(intentsCross(layout, act('A', {}), act('B', { kind: 'buss', position: 'pa-holdeplass' }))).toBe('yes');
  });
  it('syklist rett fram krysser bil som svinger til høyre fra samme arm', () => {
    expect(intentsCross(layout, act('A', { intent: 'hoyre' }), act('B', { kind: 'syklist' }))).toBe('yes');
    expect(intentsCross(layout, act('A', { intent: 'venstre' }), act('B', { kind: 'syklist' }))).toBe('no');
  });
  it('to biler fra samme arm uten holdeplass krysser ikke', () => {
    expect(intentsCross(layout, act('A', {}), act('B', { intent: 'hoyre' }))).toBe('no');
  });
  it('rygging er ukjent for geometrien', () => {
    expect(intentsCross(layout, act('A', { intent: 'rygger' }), act('B', { from: 'E' }))).toBe('unknown');
  });
});
