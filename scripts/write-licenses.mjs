// Skriver public/signs/LICENSES.md ut fra src/content/signs.json (kilde og lisens per fil).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const signs = JSON.parse(readFileSync(join(root, 'src/content/signs.json'), 'utf8'));
const rows = signs
  .map((s) => `| ${s.file} | ${s.nr} ${s.name.nb} | ${s.credit.original.split('/').pop()}${s.credit.variant ? ` (variant ${s.credit.variant})` : ''} | ${s.credit.author} | ${s.credit.license} |`)
  .join('\n');
writeFileSync(
  join(root, 'public/signs/LICENSES.md'),
  `# Skiltgrafikk – kilde og lisens

Skiltbildene kommer fra Statens vegvesens offisielle skiltfiler:
https://www.vegvesen.no/fag/veg-og-gate/trafikkskilt-og-vegoppmerking/filer-og-fargekoder-for-trafikkskilt/

Inneholder data under Norsk lisens for offentlige data (NLOD) 2.0, tilgjengeliggjort av Statens vegvesen.
Lisens: https://data.norge.no/nlod/no/2.0 (datasett: https://data.norge.no/en/datasets/62cd16c5-91ad-3083-8f56-cef0d7bd18de).

Filene er konvertert fra CMYK-JPG til sRGB-PNG (maks 480 px, hvit kant fjernet) med \`npm run import-signs\`.
Skiltnummer følger skiltforskriften. Tabellen lages av \`node scripts/write-licenses.mjs\` ut fra src/content/signs.json.

| Fil | Skilt | Zip-fil hos vegvesen.no | Kilde | Lisens |
|---|---|---|---|---|
${rows}
`,
);
console.log(`LICENSES.md: ${signs.length} skilt`);
