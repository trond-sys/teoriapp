// Skriver public/signs/LICENSES.md ut fra src/content/signs.json (kilde og lisens per fil).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const signs = JSON.parse(readFileSync(join(root, 'src/content/signs.json'), 'utf8'));
const rows = signs
  .map((s) => `| ${s.file} | ${s.nr} ${s.name.nb} | ${s.credit.page} | ${s.credit.author} | ${s.credit.license} |`)
  .join('\n');
writeFileSync(
  join(root, 'public/signs/LICENSES.md'),
  `# Skiltgrafikk – kilde og lisens

Alle skilt er SVG-filer fra Wikimedia Commons, lastet ned uendret med \`npm run fetch-signs\`.
Lisensen er kontrollert på filsiden for hver fil (21.11.2026). Skiltnummer følger skiltforskriften.
Tabellen lages av \`node scripts/write-licenses.mjs\` ut fra src/content/signs.json.

| Fil | Skilt | Commons-side | Forfatter | Lisens |
|---|---|---|---|---|
${rows}
`,
);
console.log(`LICENSES.md: ${signs.length} skilt`);
