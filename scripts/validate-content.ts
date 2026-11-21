// npm run validate-content
// Feiler (exit 1) hvis innhold mangler et språk, har ugyldig fasit, mangler source/tema,
// har doble ID-er, ukjente ordlisteord, skilt eller scener – eller en scene der fasiten
// ikke stemmer med vikeplikt-motoren. Skriver ut dekning per temalisteRef til slutt.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { validateContent, type RawFile } from '../src/content/validate';
import { sceneEngineCheck } from '../src/domain/yield/sceneCheck';

const root = join(import.meta.dirname, '..');
const contentDir = join(root, 'src', 'content');
const signsDir = join(root, 'public', 'signs');

function readJson(path: string): RawFile {
  const file = relative(root, path).replaceAll('\\', '/');
  try {
    return { file, data: JSON.parse(readFileSync(path, 'utf8')) };
  } catch (e) {
    return { file, data: { __parseError: String(e) } };
  }
}

function readDir(dir: string): RawFile[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => readJson(join(dir, f)));
}

const raw = {
  questions: readDir(join(contentDir, 'questions')),
  scenes: readDir(join(contentDir, 'scenes-legacy')).map((f) => ({ ...f, data: [f.data] })),
  scenarios: readDir(join(contentDir, 'scenes')),
  signs: readJson(join(contentDir, 'signs.json')),
  glossary: readJson(join(contentDir, 'glossary.json')),
  ui: readJson(join(contentDir, 'ui', 'strings.json')),
  signFiles: existsSync(signsDir) ? readdirSync(signsDir) : [],
  licensesMd: existsSync(join(signsDir, 'LICENSES.md')) ? readFileSync(join(signsDir, 'LICENSES.md'), 'utf8') : '',
};

const res = validateContent(raw, sceneEngineCheck);
const c = res.content;

console.log(
  `Innhold: ${c.questions.length} oppgaver, ${c.scenes.length} gamle scener, ${c.scenarios.length} håndlagde scenarier, ${c.signs.length} skilt, ` +
    `${c.glossary.length} ordlisteord, ${Object.keys(c.ui).length} UI-tekster.\n`,
);

const pad = (s: string | number, n: number) => String(s).padEnd(n);
console.log(pad('temalisteRef', 26) + pad('laget', 7) + pad('verif.', 8) + pad('thai ok', 9) + 'mål (MVP/tot)');
let sum = { made: 0, verified: 0, thOk: 0, mvp: 0, total: 0 };
for (const r of res.coverage) {
  console.log(pad(r.ref, 26) + pad(r.made, 7) + pad(r.verified, 8) + pad(r.thOk, 9) + `${r.mvp} / ${r.total}`);
  sum = { made: sum.made + r.made, verified: sum.verified + r.verified, thOk: sum.thOk + r.thOk, mvp: sum.mvp + r.mvp, total: sum.total + r.total };
}
console.log(pad('SUM', 26) + pad(sum.made, 7) + pad(sum.verified, 8) + pad(sum.thOk, 9) + `${sum.mvp} / ${sum.total}`);
console.log(`\nUverifisert: ${res.unverified.length} element(er).`);
for (const u of res.unverified.filter((u) => u.todo)) console.log(`  TODO ${u.id}: ${u.todo}`);

if (res.warnings.length) {
  console.log(`\n${res.warnings.length} advarsel(er):`);
  res.warnings.forEach((w) => console.log('  ! ' + w));
}
if (res.errors.length) {
  console.error(`\n${res.errors.length} FEIL:`);
  res.errors.forEach((e) => console.error('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ Innholdet er gyldig.');
