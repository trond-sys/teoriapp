// Lokale verifiseringer fra /review (Endring 01, steg 7). Trond markerer en scene som kontrollert i appen.
// Markeringen lagres lokalt (IndexedDB) og eksporteres som JSON. `npm run apply-verifications -- <fil>`
// skriver den inn i scenefilene, og Trond committer. Først da vises scenen for eleven.
import { db } from '../../db/db';
import { downloadJson } from '../../db/export';

export interface Verification {
  verifiedBy: string;
  verifiedAt: string;
}

const KEY = 'sceneVerifications';
const NAME_KEY = 'reviewerName';

export async function loadVerifications(): Promise<Record<string, Verification>> {
  const row = await db.settings.get(KEY);
  return (row?.value as Record<string, Verification>) ?? {};
}

export async function setVerification(id: string, v: Verification | null) {
  const all = await loadVerifications();
  if (v) all[id] = v;
  else delete all[id];
  await db.settings.put({ key: KEY, value: all });
  if (v) await db.settings.put({ key: NAME_KEY, value: v.verifiedBy });
}

export async function loadReviewerName(): Promise<string> {
  const row = await db.settings.get(NAME_KEY);
  return (row?.value as string) ?? 'Trond';
}

export async function exportVerifications() {
  const all = await loadVerifications();
  const items = Object.entries(all).map(([id, v]) => ({ id, ...v }));
  const date = new Date().toLocaleDateString('sv-SE');
  downloadJson({ app: 'teori-b', kind: 'scene-verifications', exportedAt: new Date().toISOString(), items }, `teori-b-verifiseringer-${date}.json`);
}
