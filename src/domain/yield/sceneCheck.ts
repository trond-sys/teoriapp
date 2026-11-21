// Kryssjekk mellom håndskrevet fasit (expectedOrder) og motoren. Brukes av validate-content.
import type { YieldScene } from '../../content/schema';
import { analyze } from './engine';

const norm = (groups: string[][]) => groups.map((g) => [...g].sort().join('+')).join(' → ');

export function sceneEngineCheck(scene: YieldScene): string[] {
  const a = analyze(scene);
  if (a.error) return [`motoren avviser scenen: ${a.error.message}`];
  const want = norm(scene.expectedOrder);
  const got = norm(a.groups);
  return want === got ? [] : [`expectedOrder (${want}) stemmer ikke med motoren (${got})`];
}
