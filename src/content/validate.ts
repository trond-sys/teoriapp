// Ren valideringslogikk for innholdet. Brukes av scripts/validate-content.ts og av tester.
import { z } from 'zod';
import { TEMALISTE } from '../config/temaliste';
import { validateScenario } from '../domain/scenes/validate';
import { GlossaryTerm, Question, Scenario, Sign, UiStrings, type Illustration } from './schema';

/** Sjekker at en tegning til en oppgave henger sammen (bare utseende, ingen fasit). */
export function illustrationIssues(ill: Illustration, signNrs: Set<string>): string[] {
  const out: string[] = [];
  const ids = ill.actors.map((a) => a.id);
  if (new Set(ids).size !== ids.length) out.push('to trafikanter har samme ID');
  if (ill.type === 'kryss') {
    const arms = new Set(ill.layout.arms);
    const want = ill.layout.type === 't-kryss' ? 3 : 4;
    if (ill.layout.arms.length !== want) out.push(`${ill.layout.type} skal ha ${want} armer`);
    for (const a of ill.actors) if (!arms.has(a.from)) out.push(`${a.id} kommer fra armen ${a.from}, som ikke finnes`);
    for (const s of ill.layout.signs) {
      if (!arms.has(s.arm)) out.push(`skilt ${s.nr} står på armen ${s.arm}, som ikke finnes`);
      if (!signNrs.has(s.nr)) out.push(`skilt ${s.nr} finnes ikke i signs.json`);
    }
    for (const d of Object.keys(ill.layout.lights ?? {})) if (!arms.has(d as never)) out.push(`trafikklys på armen ${d}, som ikke finnes`);
    return out;
  }
  for (const a of ill.actors) {
    if (a.lane === 'holdeplass' && !ill.busStop) out.push(`${a.id} står på holdeplassen, men busStop er ikke satt`);
    if (a.lane === 'rampe' && !(ill.exitRamp && ill.road === 'motorveg')) out.push(`${a.id} er på rampen, men vegen har ingen avkjøringsrampe`);
    if (a.lane === 'venstre-felt' && ill.road !== 'motorveg') out.push(`${a.id} er i venstre felt, som bare finnes på motorveg`);
    if (a.lane === 'spor' && (!ill.railway || a.kind !== 'tog')) out.push(`${a.id}: bare tog kan stå på sporet, og vegen må ha planovergang`);
    if (a.kind === 'tog' && a.lane !== 'spor') out.push(`${a.id}: toget må stå på sporet`);
    if (a.lane === 'fortau' && !(ill.sidewalks || ill.crosswalk)) out.push(`${a.id} står på fortauet, men vegen har ikke fortau`);
    if (a.lane === 'fortau' && a.kind !== 'gaende' && a.kind !== 'syklist') out.push(`${a.id}: bare gående og syklende kan stå på fortauet`);
  }
  if (ill.crosswalk && !signNrs.has('516')) out.push('gangfelt krever skilt 516 i signs.json');
  return out;
}

export interface RawFile {
  file: string;
  data: unknown;
}

export interface RawContent {
  questions: RawFile[];
  /** Håndlagde scenarier (Endring 01), én fil per scene i src/content/scenes/. */
  scenarios?: RawFile[];
  signs: RawFile;
  glossary: RawFile;
  ui: RawFile;
  /** Filnavn som finnes i public/signs/. */
  signFiles: string[];
  /** Innholdet i public/signs/LICENSES.md. */
  licensesMd: string;
}

export interface Content {
  questions: Question[];
  scenarios: Scenario[];
  signs: Sign[];
  glossary: GlossaryTerm[];
  ui: UiStrings;
}

export interface CoverageRow {
  ref: string;
  made: number;
  verified: number;
  thOk: number;
  mvp: number;
  total: number;
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  content: Content;
  coverage: CoverageRow[];
  unverified: { id: string; todo?: string }[];
}

function fmtZod(file: string, where: string, err: z.ZodError): string[] {
  return err.issues.map((i) => `${file}: ${where}${i.path.length ? ' → ' + i.path.join('.') : ''}: ${i.message}`);
}

function parseArray<T>(raw: RawFile, schema: z.ZodType<T>, errors: string[], idOf: (x: unknown, i: number) => string): T[] {
  if (!Array.isArray(raw.data)) {
    errors.push(`${raw.file}: må være en JSON-liste`);
    return [];
  }
  const out: T[] = [];
  raw.data.forEach((item, i) => {
    const r = schema.safeParse(item);
    if (r.success) out.push(r.data);
    else errors.push(...fmtZod(raw.file, idOf(item, i), r.error));
  });
  return out;
}

const idOf = (x: unknown, i: number) =>
  x && typeof x === 'object' && 'id' in x ? String((x as { id: unknown }).id) : x && typeof x === 'object' && 'nr' in x ? `skilt ${(x as { nr: unknown }).nr}` : `#${i}`;

export function validateContent(raw: RawContent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const questions = raw.questions.flatMap((f) => {
    const qs = parseArray(f, Question, errors, idOf);
    const expected = f.file.replace(/^.*[\\/]/, '').replace(/\.json$/, '');
    for (const q of qs) {
      if (q.temalisteRef !== expected) errors.push(`${f.file}: ${q.id} har temalisteRef ${q.temalisteRef}, men ligger i ${expected}.json`);
    }
    return qs;
  });
  const scenarios = (raw.scenarios ?? []).flatMap((f) => {
    const ss = parseArray({ ...f, data: [f.data] }, Scenario, errors, idOf);
    const expected = f.file.replace(/^.*[\\/]/, '').replace(/\.json$/, '');
    for (const sc of ss) if (sc.id !== expected) errors.push(`${f.file}: scene-ID ${sc.id} må være lik filnavnet`);
    return ss;
  });
  const signs = parseArray(raw.signs, Sign, errors, idOf);
  const glossary = parseArray(raw.glossary, GlossaryTerm, errors, idOf);

  let ui: UiStrings = {};
  const uiR = UiStrings.safeParse(raw.ui.data);
  if (uiR.success) ui = uiR.data;
  else errors.push(...fmtZod(raw.ui.file, 'UI-tekst', uiR.error));

  // Unike ID-er på tvers av alt som kan få forsøk (attempts.itemId).
  const seen = new Map<string, string>();
  const claim = (id: string, where: string) => {
    if (seen.has(id)) errors.push(`dobbel ID «${id}» (${seen.get(id)} og ${where})`);
    else seen.set(id, where);
  };
  questions.forEach((q) => claim(q.id, 'oppgave'));
  scenarios.forEach((s) => claim(s.id, 'scenario'));
  signs.forEach((s) => claim(`sign-${s.nr}`, 'skilt'));
  glossary.forEach((g) => claim(`term-${g.id}`, 'ordliste'));

  const termIds = new Set(glossary.map((g) => g.id));
  const sceneIds = new Set(scenarios.map((s) => s.id));
  const signNrs = new Set(signs.map((s) => s.nr));
  const checkTerms = (owner: string, terms: string[]) => {
    for (const t of terms) if (!termIds.has(t)) errors.push(`${owner}: ordet «${t}» finnes ikke i ordlisten`);
  };

  for (const q of questions) {
    checkTerms(q.id, q.glossaryTerms);
    if (q.media?.scene && !sceneIds.has(q.media.scene)) errors.push(`${q.id}: scenen «${q.media.scene}» finnes ikke`);
    if (q.media?.sign && !signNrs.has(q.media.sign)) errors.push(`${q.id}: skiltet «${q.media.sign}» finnes ikke`);
    if (q.media?.illustration) for (const m of illustrationIssues(q.media.illustration, signNrs)) errors.push(`${q.id}: tegningen – ${m}`);
    if (q.alsoRefs.includes(q.temalisteRef)) warnings.push(`${q.id}: alsoRefs gjentar temalisteRef`);
    if (q.type === 'true-false' && q.options.length !== 2) errors.push(`${q.id}: sant/usant må ha 2 alternativer`);
  }
  for (const s of signs) {
    checkTerms(`skilt ${s.nr}`, s.glossaryTerms);
    // Manglende bildefil er en advarsel: appen viser skiltnummeret som plassholder til filen er hentet (npm run import-signs).
    if (!raw.signFiles.includes(s.file)) warnings.push(`skilt ${s.nr}: filen public/signs/${s.file} mangler – kjør npm run import-signs`);
    if (!raw.licensesMd.includes(s.file)) errors.push(`skilt ${s.nr}: ${s.file} mangler i public/signs/LICENSES.md`);
  }
  const scenarioCtx = { signNrs, termIds };
  for (const sc of scenarios)
    for (const issue of validateScenario(sc, scenarioCtx))
      (issue.level === 'error' ? errors : warnings).push(`${issue.id}: ${issue.message}`);

  // UI-tekst: nøkler som brukes i koden sjekkes av TypeScript (se src/i18n/strings.ts).

  // Dekning og uverifisert.
  const coverage: CoverageRow[] = TEMALISTE.map((t) => {
    const items = [...questions.filter((q) => q.temalisteRef === t.id)];
    return {
      ref: t.id,
      made: items.length,
      verified: items.filter((q) => q.verified).length,
      thOk: items.filter((q) => q.thReview === 'ok').length,
      mvp: t.mvp,
      total: t.total,
    };
  });
  const unverified = [
    ...questions.filter((q) => !q.verified).map((q) => ({ id: q.id, todo: q.todo })),
    ...signs.filter((s) => !s.verified).map((s) => ({ id: `skilt ${s.nr}`, todo: s.todo })),
    ...scenarios.filter((s) => !s.verified).map((s) => ({ id: s.id, todo: s.todo })),
  ];

  return { errors, warnings, content: { questions, scenarios, signs, glossary, ui }, coverage, unverified };
}
