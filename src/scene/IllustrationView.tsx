// Tegning til en oppgave: et kryss (samme motor som scenene) eller en rett vegstrekning.
import type { Illustration } from '../content/schema';
import { scenarioToDrawing } from './fromScenario';
import { SceneView } from './SceneView';
import { StretchView } from './StretchView';

export function IllustrationView({ ill, id, label }: { ill: Illustration; id: string; label?: string }) {
  if (ill.type === 'strekning') return <StretchView ill={ill} id={id} label={label} />;
  return <SceneView scene={scenarioToDrawing({ id, layout: ill.layout, actors: ill.actors })} signs={ill.layout.signs} label={label} />;
}
