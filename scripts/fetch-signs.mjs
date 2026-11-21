// npm run fetch-signs
// Laster ned skilt-SVG-er fra Wikimedia Commons for alle skilt i src/content/signs.json som mangler fil.
// Kjører langsomt (én fil om gangen, med pause) og med ærlig User-Agent, slik Wikimedia ber om.
// Får vi 429 (for mange forespørsler), stopper skriptet – prøv igjen senere.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const signs = JSON.parse(readFileSync(join(root, 'src/content/signs.json'), 'utf8'));
const UA = 'TeoriB/0.1 (privat, offline øvingsapp for teoriprøven; engangsnedlasting av offentlige skilt)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let fetched = 0;
for (const s of signs) {
  const out = join(root, 'public/signs', s.file);
  if (existsSync(out)) continue;
  const url = s.credit?.original;
  if (!url) {
    console.log(`${s.nr}: mangler credit.original`);
    continue;
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (res.status === 429) {
    console.error(`429 fra Wikimedia ved skilt ${s.nr}. Stopper – prøv igjen om en stund.`);
    process.exit(2);
  }
  const text = await res.text();
  if (!res.ok || !text.includes('<svg')) {
    console.error(`${s.nr}: HTTP ${res.status}, ikke SVG`);
    continue;
  }
  if (/<script|onload=|javascript:|<foreignObject/i.test(text)) {
    console.error(`${s.nr}: filen inneholder skript – lagres ikke`);
    continue;
  }
  writeFileSync(out, text);
  fetched++;
  console.log(`${s.nr}: lagret ${s.file} (${text.length} byte)`);
  await sleep(5000);
}
console.log(`Ferdig. ${fetched} nye filer.`);
