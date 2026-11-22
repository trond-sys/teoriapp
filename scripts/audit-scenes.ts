// npm run audit-scenes
// Revisjon (Endring 01, steg 5): kjører den gamle regelmotoren mot hver håndlagde scene og skriver
// docs/scene-audit.md med uenighetene mellom motor og fasit. Rapporten er et hjelpemiddel for Trond når han
// kontrollerer scenene – ikke en dommer. Fasiten i scenen gjelder alltid.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Scenario } from '../src/content/schema';
import { scenarioToDrawing } from '../src/scene/fromScenario';
import { analyze, grade } from './audit/engine';
import { RULES } from './audit/rules';

const root = join(import.meta.dirname, '..');
const dir = join(root, 'src', 'content', 'scenes');
const out = join(root, 'docs', 'scene-audit.md');

const norm = (groups: string[][]) => groups.map((g) => [...g].sort().join(' + ')).join(' → ');
const pairs = (edges: { yielder: string; priority: string }[]) => new Set(edges.map((e) => `${e.yielder}>${e.priority}`));

interface Row {
  id: string;
  verified: boolean;
  fasit: string;
  motor: string;
  agree: boolean;
  notes: string[];
}

const rows: Row[] = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  const s = Scenario.parse(JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const notes: string[] = [];
  const fasitOrder = s.answer.order ?? [];

  // Det motoren ikke kan se, nevnes, så Trond vet at enighet ikke sier noe om det.
  if (s.layout.lights) notes.push('Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.');
  if (s.layout.police) notes.push('Scenen har politi. Motoren kjenner ikke politiets tegn.');
  if (s.actors.some((a) => a.position === 'pa-holdeplass')) notes.push('Buss fra holdeplass (§ 7 nr. 5) finnes ikke i motoren.');
  if (s.layout.signs.some((x) => !['202', '204', '206'].includes(x.nr))) notes.push('Motoren leser bare skilt 202, 204 og 206. Andre skilt i scenen er ikke med.');
  if (s.actors.some((a) => a.intent === 'rygger')) notes.push('Scenen har rygging. Motoren kjenner ikke rygging.');
  const fromArms = s.actors.filter((a) => a.kind !== 'gaende' && a.position !== 'inne-i-rundkjoring').map((a) => a.from);
  if (new Set(fromArms).size !== fromArms.length) notes.push('Flere trafikanter kommer fra samme arm. Motoren støtter ikke det.');

  const a = analyze(scenarioToDrawing(s));
  if (a.error) {
    rows.push({ id: s.id, verified: s.verified, fasit: norm(fasitOrder), motor: `feil: ${a.error.message}`, agree: false, notes });
    continue;
  }

  const motorOrder = norm(a.groups);
  const sameOrder = s.question.type !== 'rekkefolge' || motorOrder === norm(fasitOrder);
  if (!sameOrder) {
    const g = grade(a, fasitOrder.flat());
    notes.push(
      g.violations.length
        ? `Etter motoren bryter fasitens rekkefølge disse vikepliktene: ${g.violations.map((v) => `${v.yielder} før ${v.priority} (${RULES[v.rule].source})`).join('; ')}.`
        : 'Fasitens rekkefølge bryter ingen vikeplikt etter motoren, men grupperingen (hvem som kan kjøre samtidig) er ulik.',
    );
  }

  // Hvem viker for hvem: fasitens steg mot motorens kanter.
  const fasitPairs = new Set(s.answer.steps.flatMap((st) => st.yieldsTo.map((y) => `${st.who}>${y}`)));
  const motorPairs = pairs(a.edges);
  for (const e of a.edges)
    if (!fasitPairs.has(`${e.yielder}>${e.priority}`))
      notes.push(`Motoren mener ${e.yielder} viker for ${e.priority} (regel «${e.rule}», ${RULES[e.rule].source}), men fasiten har ikke dette steget.`);
  for (const p of fasitPairs)
    if (!motorPairs.has(p)) {
      const [x, y] = p.split('>');
      notes.push(`Fasiten sier ${x} viker for ${y}, men motoren finner ingen vikeplikt mellom dem.`);
    }

  const agree = sameOrder && notes.every((n) => !n.startsWith('Motoren mener') && !n.startsWith('Fasiten sier'));
  rows.push({ id: s.id, verified: s.verified, fasit: norm(fasitOrder), motor: motorOrder, agree, notes });
}

const today = new Date().toLocaleDateString('sv-SE'); // lokal dato, ÅÅÅÅ-MM-DD
const disagree = rows.filter((r) => !r.agree);
const md = `# Revisjon av vikeplikt-scenene

**Laget:** ${today} med \`npm run audit-scenes\` (Endring 01, steg 5).
**Scener:** ${rows.length}. **Uenige med motoren:** ${disagree.length}.

Rapporten sammenligner fasiten i hver scene (\`src/content/scenes/\`) med den gamle regelmotoren (\`scripts/audit/engine.ts\`).
Den er et hjelpemiddel når scenene kontrolleres, **ikke en dommer**: fasiten i scenen gjelder alltid.

**Kjente svakheter i motoren** (fra \`docs/TODO-kontroll-batch1.md\`), så enighet er ikke bevis:
- B1: Motoren gir trikken alltid fri veg, også mot trafikklys og når trikken svinger mot grønn fotgjenger. Det er feil i de to tilfellene.
- B2: Motoren lar alle vike for utrykning, også trafikanter som ikke er i vegen.
- B5: Motoren antar vikepliktskilt ved alle innkjøringer til rundkjøring, og at to som kjører inn fra ulike armer, ikke er i konflikt.
- B6: Motoren regner to møtende venstresvingere som uten konflikt. Det samme gjør den geometriske kontrollen, med hjemmel i § 6 nr. 4.
- Motoren kjenner ikke trafikklys, politi, buss fra holdeplass eller andre skilt enn 202, 204 og 206.

## Oversikt

| Scene | Verifisert | Fasit | Motor | Enig |
|---|---|---|---|---|
${rows.map((r) => `| \`${r.id}\` | ${r.verified ? 'ja' : 'nei'} | ${r.fasit} | ${r.motor} | ${r.agree ? 'ja' : '**nei**'} |`).join('\n')}

## Merknader per scene

${
  rows.filter((r) => r.notes.length).length
    ? rows
        .filter((r) => r.notes.length)
        .map((r) => `### \`${r.id}\`${r.agree ? '' : ' – uenig'}\n${r.notes.map((n) => `- ${n}`).join('\n')}`)
        .join('\n\n')
    : 'Ingen merknader.'
}
`;
writeFileSync(out, md);
console.log(`docs/scene-audit.md: ${rows.length} scener, ${disagree.length} uenige.`);
for (const r of disagree) console.log(`  uenig: ${r.id} (fasit ${r.fasit} / motor ${r.motor})`);
