// npm run validate-scenes
// Kontrollerer de håndlagde scenariene i src/content/scenes/ (Endring 01 §4): struktur (feil) og
// geometrisk fornuft (advarsler). Avgjør IKKE vikeplikt. Kjøres også som en del av validate-content.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Scenario, Sign, GlossaryTerm } from '../src/content/schema';
import { validateScenario } from '../src/domain/scenes/validate';
import { CATALOG } from '../src/domain/scenes/catalog';

const root = join(import.meta.dirname, '..');
const dir = join(root, 'src', 'content', 'scenes');
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

const signNrs = new Set((read(join(root, 'src/content/signs.json')) as unknown[]).map((s) => Sign.parse(s).nr));
const termIds = new Set((read(join(root, 'src/content/glossary.json')) as unknown[]).map((g) => GlossaryTerm.parse(g).id));

let errors = 0;
let warnings = 0;
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
for (const f of files) {
  const r = Scenario.safeParse(read(join(dir, f)));
  if (!r.success) {
    errors += r.error.issues.length;
    console.error(`✗ ${f}`);
    r.error.issues.forEach((i) => console.error(`    feil: ${i.path.join('.')}: ${i.message}`));
    continue;
  }
  const s = r.data;
  const issues = validateScenario(s, { signNrs, termIds });
  if (s.id !== f.replace(/\.json$/, '')) issues.push({ id: s.id, level: 'error', message: 'ID må være lik filnavnet' });
  const e = issues.filter((i) => i.level === 'error');
  const w = issues.filter((i) => i.level === 'warning');
  errors += e.length;
  warnings += w.length;
  const status = e.length ? '✗' : w.length ? '!' : '✓';
  console.log(`${status} ${s.id}  [${s.tier}, ${s.subtopic}, ${s.verified ? 'verifisert' : 'ikke verifisert'}]`);
  e.forEach((i) => console.log(`    feil: ${i.message}`));
  w.forEach((i) => console.log(`    advarsel: ${i.message}`));
}
// Dekning av kjernekatalogen (Endring 01 §6).
const parsed = files.map((f) => Scenario.safeParse(read(join(dir, f)))).flatMap((r) => (r.success ? [r.data] : []));
console.log('\nKjernekatalog (kjerne-scener per undertema):');
for (const c of CATALOG) {
  const made = parsed.filter((s) => s.tier === 'kjerne' && s.subtopic === c.subtopic);
  const ver = made.filter((s) => s.verified).length;
  console.log(`  ${c.subtopic.padEnd(16)} ${String(made.length).padStart(2)} / ${c.target}  (verifisert ${ver})  ${made.length >= c.target ? '✓' : ''}`);
}
const total = CATALOG.reduce((n, c) => n + c.target, 0);
console.log(`  ${'sum'.padEnd(16)} ${String(parsed.filter((s) => s.tier === 'kjerne').length).padStart(2)} / ${total}`);

console.log(`\n${files.length} scener, ${errors} feil, ${warnings} advarsler.`);
if (errors) process.exit(1);
