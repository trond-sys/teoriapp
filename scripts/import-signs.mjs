// npm run import-signs
// Henter skiltbilder fra Statens vegvesens offisielle skiltfiler (zip per skiltgruppe, NLOD 2.0) for alle
// skilt i src/content/signs.json som mangler fil i public/signs/. Bildene konverteres fra CMYK-JPG til
// sRGB-PNG (maks 480 px, hvit kant fjernet) med sharp.
//
// Kilde: https://www.vegvesen.no/fag/veg-og-gate/trafikkskilt-og-vegoppmerking/filer-og-fargekoder-for-trafikkskilt/
// Lisens: Norsk lisens for offentlige data (NLOD) 2.0 – se public/signs/LICENSES.md.
//
// Skiltet finnes i zip-filen i credit.original som «<nr>_0.jpg» (eller «<nr>_H.jpg» for skilt med variant).
// Valgfritt: credit.variant (f.eks. «H») velger variant.
// Bruk --force for å lage alle filene på nytt.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const root = join(import.meta.dirname, '..');
const force = process.argv.includes('--force');
const signs = JSON.parse(readFileSync(join(root, 'src/content/signs.json'), 'utf8'));
const cache = join(tmpdir(), 'teori-b-skilt');
mkdirSync(cache, { recursive: true });

// Windows 10+ har bsdtar i System32, som kan pakke ut zip. Ellers brukes «tar» fra PATH.
const tarBin = process.platform === 'win32' && existsSync('C:\\Windows\\System32\\tar.exe') ? 'C:\\Windows\\System32\\tar.exe' : 'tar';

async function zipDir(url) {
  const name = basename(new URL(url).pathname, '.zip');
  const zip = join(cache, `${name}.zip`);
  const dir = join(cache, name);
  if (!existsSync(zip)) {
    console.log(`Laster ned ${url}`);
    const res = await fetch(url, { headers: { 'User-Agent': 'TeoriB/0.1 (privat oevingsapp)' } });
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
  }
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    execFileSync(tarBin, ['-xf', zip, '-C', dir]);
  }
  return dir;
}

function findFile(dir, nr, variant) {
  const want = new RegExp(`^${nr.replace('.', '\\.')}_${variant ?? '(0|H)'}\\.jpe?g$`, 'i');
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) stack.push(p);
      else if (want.test(f)) return p;
    }
  }
  return undefined;
}

let made = 0;
for (const s of signs) {
  const out = join(root, 'public/signs', s.file);
  if (existsSync(out) && !force) continue;
  if (!s.credit?.original?.endsWith('.zip')) {
    console.log(`${s.nr}: credit.original er ikke en zip fra vegvesen.no – hoppes over`);
    continue;
  }
  const dir = await zipDir(s.credit.original);
  const src = findFile(dir, s.nr, s.credit.variant);
  if (!src) {
    console.error(`${s.nr}: fant ikke skiltet i ${basename(s.credit.original)}`);
    process.exitCode = 1;
    continue;
  }
  await sharp(src)
    .toColourspace('srgb')
    .trim({ background: '#ffffff', threshold: 20 })
    .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  made++;
  console.log(`${s.nr}: ${basename(src)} → public/signs/${s.file} (${statSync(out).size} byte)`);
}
console.log(`Ferdig. ${made} skilt laget.`);
