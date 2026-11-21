// Validator for håndlagde scenarier (Endring 01 §4). Den avgjør IKKE vikeplikt.
// Feil = scenen henger ikke sammen (stopper validate-content). Advarsel = noe et menneske bør se på.
import type { Scenario } from '../../content/schema';
import { exitArm, intentsCross } from './geometry';

export interface SceneIssue {
  id: string;
  level: 'error' | 'warning';
  message: string;
}

export interface ScenarioContext {
  /** Skiltnumre som finnes i signs.json. */
  signNrs: Set<string>;
  /** ID-er i ordlisten. */
  termIds: Set<string>;
}

export function validateScenario(s: Scenario, ctx: ScenarioContext): SceneIssue[] {
  const issues: SceneIssue[] = [];
  const err = (message: string) => issues.push({ id: s.id, level: 'error', message });
  const warn = (message: string) => issues.push({ id: s.id, level: 'warning', message });

  const ids = s.actors.map((a) => a.id);
  const idSet = new Set(ids);
  const byId = new Map(s.actors.map((a) => [a.id, a]));
  const arms = new Set(s.layout.arms);

  // ---------- Struktur ----------
  if (idSet.size !== ids.length) err('to trafikanter har samme ID');
  if (new Set(s.layout.arms).size !== s.layout.arms.length) err('en arm står to ganger i layout.arms');
  if (s.layout.type === 'x-kryss' && s.layout.arms.length !== 4) err('x-kryss må ha fire armer');
  if (s.layout.type === 't-kryss' && s.layout.arms.length !== 3) err('t-kryss må ha tre armer');

  for (const sign of s.layout.signs) {
    if (!arms.has(sign.arm)) err(`skilt ${sign.nr} står på armen ${sign.arm}, som ikke finnes`);
    if (!ctx.signNrs.has(sign.nr)) err(`skilt ${sign.nr} finnes ikke i signs.json`);
  }
  for (const arm of s.layout.crosswalks) if (!arms.has(arm)) err(`gangfelt på armen ${arm}, som ikke finnes`);
  for (const arm of s.layout.tram) if (!arms.has(arm)) err(`trikkespor på armen ${arm}, som ikke finnes`);
  for (const arm of Object.keys(s.layout.lights ?? {})) if (!arms.has(arm as never)) err(`trafikklys på armen ${arm}, som ikke finnes`);
  if (s.layout.police && !arms.has(s.layout.police.facing)) err(`politiet vender mot armen ${s.layout.police.facing}, som ikke finnes`);

  for (const a of s.actors) {
    if (!arms.has(a.from)) err(`${a.id} kommer fra armen ${a.from}, som ikke finnes`);
    if (a.kind === 'gaende') {
      if (a.intent !== 'krysser') err(`${a.id} er gående og må ha intent «krysser»`);
      if (!s.layout.crosswalks.includes(a.from)) warn(`${a.id} krysser armen ${a.from}, men det er ikke gangfelt der`);
    } else {
      if (a.intent === 'krysser') err(`${a.id} er kjøretøy og kan ikke ha intent «krysser»`);
      const out = exitArm(a.from, a.intent);
      if (out && !arms.has(out) && a.position !== 'inne-i-rundkjoring') err(`${a.id} skal ${a.intent} fra ${a.from}, men armen ${out} finnes ikke`);
    }
    if (a.bluelight && a.kind !== 'utrykning') err(`${a.id} har blått lys, men er ikke utrykning`);
    if (a.position === 'inne-i-rundkjoring' && s.layout.type !== 'rundkjoring') err(`${a.id} er «inne-i-rundkjoring», men krysset er ikke en rundkjøring`);
  }

  if (s.tier === 'kjerne' && !s.temalisteRef) err('kjernescener må ha temalisteRef');
  for (const t of s.glossaryTerms) if (!ctx.termIds.has(t)) err(`ordet «${t}» finnes ikke i ordlisten`);

  // Fasit
  const order = s.answer.order;
  if (s.question.type === 'rekkefolge' && !order) err('rekkefølge-spørsmål må ha answer.order');
  if (s.question.type === 'ja-nei' && s.answer.yes === undefined) err('ja-nei-spørsmål må ha answer.yes');
  if (s.question.type === 'velg') {
    const opts = s.question.options.map((o) => o.id);
    if (!s.answer.correct || !opts.includes(s.answer.correct)) err('velg-spørsmål må ha answer.correct som peker på et alternativ');
  }
  const groupOf = new Map<string, number>();
  if (order) {
    const flat = order.flat();
    for (const id of flat) if (!idSet.has(id)) err(`answer.order nevner ${id}, som ikke finnes i actors`);
    for (const id of ids) {
      const n = flat.filter((x) => x === id).length;
      if (n !== 1) err(`${id} står ${n} ganger i answer.order (skal stå nøyaktig én gang)`);
    }
    order.forEach((g, i) => g.forEach((id) => groupOf.set(id, i)));
  }
  for (const step of s.answer.steps) {
    if (!idSet.has(step.who)) err(`steg: ${step.who} finnes ikke i actors`);
    for (const y of step.yieldsTo) {
      if (!idSet.has(y)) err(`steg: ${step.who} viker for ${y}, som ikke finnes i actors`);
      if (y === step.who) err(`steg: ${step.who} kan ikke vike for seg selv`);
      // Samsvar mellom steg og rekkefølge (ikke en trafikkregel, bare at fasiten henger sammen).
      const gw = groupOf.get(step.who);
      const gy = groupOf.get(y);
      if (gw !== undefined && gy !== undefined && gy >= gw) err(`steg sier at ${step.who} viker for ${y}, men ${y} står ikke før ${step.who} i answer.order`);
    }
  }

  // ---------- Geometrisk fornuftskontroll (advarsler) ----------
  if (order) {
    for (const g of order)
      for (let i = 0; i < g.length; i++)
        for (let k = i + 1; k < g.length; k++) {
          const a = byId.get(g[i]);
          const b = byId.get(g[k]);
          if (a && b && intentsCross(s.layout, a, b) === 'yes')
            warn(`${a.id} og ${b.id} står i samme gruppe, men intensjonene deres krysser`);
        }
  }
  for (const step of s.answer.steps) {
    const a = byId.get(step.who);
    for (const y of step.yieldsTo) {
      const b = byId.get(y);
      if (a && b && intentsCross(s.layout, a, b) === 'no') warn(`${a.id} viker for ${b.id}, men intensjonene deres krysser ikke`);
    }
  }
  return issues;
}
