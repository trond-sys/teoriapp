// npm run apply-verifications -- <teori-b-verifiseringer-ÅÅÅÅ-MM-DD.json>
// Skriver verifiseringer som Trond har gjort på /review inn i scenefilene (verified, verifiedBy, verifiedAt).
// Kjør `npm run validate-content` og commit etterpå. Først da vises scenene for eleven.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

const File = z.object({
  kind: z.literal('scene-verifications'),
  items: z.array(z.object({ id: z.string().regex(/^vp-scene-[a-z0-9-]+-\d{2}$/), verifiedBy: z.string().min(1), verifiedAt: z.string().min(4) })),
});

const path = process.argv[2];
if (!path || !existsSync(path)) {
  console.error('Bruk: npm run apply-verifications -- <fil.json>');
  process.exit(1);
}
const data = File.parse(JSON.parse(readFileSync(path, 'utf8')));
const dir = join(import.meta.dirname, '..', 'src', 'content', 'scenes');
let changed = 0;
for (const it of data.items) {
  const p = join(dir, `${it.id}.json`);
  if (!existsSync(p)) {
    console.error(`✗ ${it.id}: finnes ikke`);
    continue;
  }
  const scene = JSON.parse(readFileSync(p, 'utf8'));
  if (scene.verified && scene.verifiedBy === it.verifiedBy && scene.verifiedAt === it.verifiedAt) continue;
  scene.verified = true;
  scene.verifiedBy = it.verifiedBy;
  scene.verifiedAt = it.verifiedAt;
  writeFileSync(p, JSON.stringify(scene, null, 2) + '\n');
  changed++;
  console.log(`✓ ${it.id}: verifisert av ${it.verifiedBy} ${it.verifiedAt}`);
}
console.log(`\n${changed} scene(r) oppdatert. Kjør npm run validate-content og commit.`);
