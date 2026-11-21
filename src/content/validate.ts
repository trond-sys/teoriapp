// Ren valideringslogikk for innholdet. Brukes av scripts/validate-content.ts og av tester.
import { z } from 'zod';
import { TEMALISTE } from '../config/temaliste';
import { GlossaryTerm, Question, Sign, UiStrings, YieldScene } from './schema';

export interface RawFile {
  file: string;
  data: unknown;
}

export interface RawContent {
  questions: RawFile[];
  scenes: RawFile[];
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
  scenes: YieldScene[];
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

/** Ekstra kontroller som krever motoren (vikeplikt). Kobles inn av kalleren. */
export type SceneCheck = (scene: YieldScene) => string[];

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

export function validateContent(raw: RawContent, sceneCheck?: SceneCheck): ValidationResult {
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
  const scenes = raw.scenes.flatMap((f) => {
    const ss = parseArray(f, YieldScene, errors, idOf);
    const expected = f.file.replace(/^.*[\\/]/, '').replace(/\.json$/, '');
    for (const s of ss) if (s.id !== expected) errors.push(`${f.file}: scene-ID ${s.id} må være lik filnavnet`);
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
  scenes.forEach((s) => claim(s.id, 'scene'));
  signs.forEach((s) => claim(`sign-${s.nr}`, 'skilt'));
  glossary.forEach((g) => claim(`term-${g.id}`, 'ordliste'));

  const termIds = new Set(glossary.map((g) => g.id));
  const sceneIds = new Set(scenes.map((s) => s.id));
  const signNrs = new Set(signs.map((s) => s.nr));
  const checkTerms = (owner: string, terms: string[]) => {
    for (const t of terms) if (!termIds.has(t)) errors.push(`${owner}: ordet «${t}» finnes ikke i ordlisten`);
  };

  for (const q of questions) {
    checkTerms(q.id, q.glossaryTerms);
    if (q.media?.scene && !sceneIds.has(q.media.scene)) errors.push(`${q.id}: scenen «${q.media.scene}» finnes ikke`);
    if (q.media?.sign && !signNrs.has(q.media.sign)) errors.push(`${q.id}: skiltet «${q.media.sign}» finnes ikke`);
    if (q.alsoRefs.includes(q.temalisteRef)) warnings.push(`${q.id}: alsoRefs gjentar temalisteRef`);
    if (q.type === 'true-false' && q.options.length !== 2) errors.push(`${q.id}: sant/usant må ha 2 alternativer`);
  }
  for (const s of signs) {
    checkTerms(`skilt ${s.nr}`, s.glossaryTerms);
    if (!raw.signFiles.includes(s.file)) errors.push(`skilt ${s.nr}: filen public/signs/${s.file} finnes ikke`);
    if (!raw.licensesMd.includes(s.file)) errors.push(`skilt ${s.nr}: ${s.file} mangler i public/signs/LICENSES.md`);
  }
  for (const s of scenes) {
    checkTerms(s.id, s.glossaryTerms);
    const ids = s.actors.map((a) => a.id);
    if (new Set(ids).size !== ids.length) errors.push(`${s.id}: to aktører har samme bokstav`);
    const flat = s.expectedOrder.flat();
    if (flat.length !== ids.length || !ids.every((id) => flat.includes(id)))
      errors.push(`${s.id}: expectedOrder må inneholde hver aktør nøyaktig én gang`);
    for (const a of s.actors) {
      if (!s.junction.arms[a.from]) errors.push(`${s.id}: ${a.id} kommer fra armen ${a.from}, som ikke finnes`);
      if (a.kind !== 'pedestrian') {
        if (!a.to) errors.push(`${s.id}: ${a.id} mangler «to»`);
        else if (!s.junction.arms[a.to]) errors.push(`${s.id}: ${a.id} skal til armen ${a.to}, som ikke finnes`);
        else if (a.to === a.from) errors.push(`${s.id}: ${a.id} kan ikke snu i krysset`);
      } else if (!s.junction.arms[a.from]?.crosswalk) errors.push(`${s.id}: gående ${a.id} står ved armen ${a.from} uten gangfelt`);
    }
    if (sceneCheck) errors.push(...sceneCheck(s).map((e) => `${s.id}: ${e}`));
  }

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
    ...scenes.filter((s) => !s.verified).map((s) => ({ id: s.id, todo: s.todo })),
    ...signs.filter((s) => !s.verified).map((s) => ({ id: `skilt ${s.nr}`, todo: s.todo })),
  ];

  return { errors, warnings, content: { questions, scenes, signs, glossary, ui }, coverage, unverified };
}
