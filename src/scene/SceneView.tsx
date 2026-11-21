// Felles scenemotor: tegner et kryss ovenfra ut fra en JSON-definert scene (ingen håndtegning per scene).
// Brukes som bilde i flervalg og som spillbrett i vikeplikt-krysset. Gjenbrukes i «Finn faren» (Fase 3).
import { useState } from 'react';
import type { Actor, Arm, Dir, Junction } from '../content/schema';
import { SIGN_BY_NR, signUrl } from '../content/index';
import { ARM_ANGLE, BASE, C, COLORS, HALF, SIZE, actorPose, onArm, rot, type Pt } from './layout';
import { leftOf, rightOf } from '../domain/scenes/geometry';

/** Hvor langt fram kjøretøyets front er i lokale koordinater (kjøretøyet peker oppover). */
const FRONT: Record<string, number> = { car: -22, emergency: -23, bus: -32, truck: -32, tram: -60, bicycle: -15, pedestrian: -10 };

/**
 * Intensjonspil (Endring 01, prinsipp 4): viser bare hvor trafikanten skal – høyre, rett fram eller venstre –
 * ikke den nøyaktige kjørebanen gjennom krysset. Tegnes i trafikantens egne koordinater.
 */
function IntentArrow({ a, marker }: { a: Actor; marker: string }) {
  const f = (FRONT[a.kind] ?? -22) - 4;
  let d = `M 0 ${f} L 0 ${f - 34}`;
  if (a.kind !== 'pedestrian' && a.to) {
    if (a.to === rightOf(a.from)) d = `M 0 ${f} Q 0 ${f - 28} 26 ${f - 30}`;
    else if (a.to === leftOf(a.from)) d = `M 0 ${f} Q 0 ${f - 28} -26 ${f - 30}`;
  }
  return <path d={d} fill="none" stroke={COLORS[a.color] ?? COLORS.blue} strokeWidth={5} strokeLinecap="round" markerEnd={`url(#${marker})`} />;
}

const DIRS: Dir[] = ['N', 'E', 'S', 'W'];

const SIGN_FOR: Partial<Record<Arm['control'], string>> = { yield: '202', stop: '204', priority: '206' };

const poly = (pts: Pt[]) => pts.map((p) => p.join(',')).join(' ');

function ArmRoad({ d, arm, roundabout }: { d: Dir; arm: Arm; roundabout: boolean }) {
  const a = ARM_ANGLE[d];
  const exit = arm.control === 'exit';
  const w = exit ? 34 : HALF;
  const inner = roundabout ? 280 : 240;
  const road = poly([rot([C - w, inner - 2], a), rot([C + w, inner - 2], a), rot([C + w, SIZE], a), rot([C - w, SIZE], a)]);
  return (
    <g>
      <polygon points={road} fill={exit ? 'var(--scene-gravel, #a9a49a)' : 'var(--road)'} />
      {exit && arm.look === 'gardsveg' && (
        // Gårdsveg: smal grusveg med gress på sidene, uten fortau eller parkeringsplass.
        <>
          {[C - w - 3, C + w + 3].map((x) => (
            <line key={x} x1={rot([x, inner], a)[0]} y1={rot([x, inner], a)[1]} x2={rot([x, SIZE], a)[0]} y2={rot([x, SIZE], a)[1]} stroke="#8c8678" strokeWidth={3} strokeDasharray="2 6" />
          ))}
        </>
      )}
      {exit && arm.look !== 'gardsveg' && (
        <>
          {/* Fortau/kantstein som avkjørselen krysser, og en parkeringsplass. */}
          <polygon points={poly([rot([C - 60, 240], a), rot([C + 60, 240], a), rot([C + 60, 252], a), rot([C - 60, 252], a)])} fill="#cfcac0" />
          <polygon points={poly([rot([C - 70, 330], a), rot([C + 70, 330], a), rot([C + 70, SIZE], a), rot([C - 70, SIZE], a)])} fill="#b8b3a8" />
          {[-45, -15, 15, 45].map((x) => (
            <line key={x} x1={rot([C + x, 345], a)[0]} y1={rot([C + x, 345], a)[1]} x2={rot([C + x, SIZE], a)[0]} y2={rot([C + x, SIZE], a)[1]} stroke="#fff" strokeWidth={2} />
          ))}
        </>
      )}
      {!exit && (
        // Midtlinje (stiplet) langs armen.
        <line x1={rot([C, inner + 8], a)[0]} y1={rot([C, inner + 8], a)[1]} x2={rot([C, SIZE], a)[0]} y2={rot([C, SIZE], a)[1]} stroke="var(--marking)" strokeWidth={2} strokeDasharray="12 10" />
      )}
      {arm.tram && (
        <g stroke="#3d3d3d" strokeWidth={1.5}>
          {[C - 6, C + 6].map((x) => (
            <line key={x} x1={rot([x, inner - 40], a)[0]} y1={rot([x, inner - 40], a)[1]} x2={rot([x, SIZE], a)[0]} y2={rot([x, SIZE], a)[1]} />
          ))}
        </g>
      )}
      {arm.crosswalk && !roundabout && (
        <g fill="#fff">
          {Array.from({ length: 7 }, (_, i) => {
            const x = C - HALF + 4 + i * 11.5;
            return <polygon key={i} points={poly([rot([x, BASE.crosswalk.y1], a), rot([x + 6, BASE.crosswalk.y1], a), rot([x + 6, BASE.crosswalk.y2], a), rot([x, BASE.crosswalk.y2], a)])} />;
          })}
        </g>
      )}
      {arm.control === 'stop' && (
        <line x1={rot([C, BASE.stopLine], a)[0]} y1={rot([C, BASE.stopLine], a)[1]} x2={rot([C + HALF, BASE.stopLine], a)[0]} y2={rot([C + HALF, BASE.stopLine], a)[1]} stroke="#fff" strokeWidth={5} />
      )}
      {(arm.control === 'yield' || (roundabout && arm.control !== 'exit')) && (
        // Vikepliktlinje («haitenner») over eget felt.
        <g fill="#fff">
          {[0, 1, 2, 3].map((i) => {
            const x = C + 3 + i * 9.5;
            const y = roundabout ? 290 : BASE.stopLine;
            return <polygon key={i} points={poly([rot([x, y], a), rot([x + 8, y], a), rot([x + 4, y - 8], a)])} />;
          })}
        </g>
      )}
    </g>
  );
}

function SignPost({ d, nr }: { d: Dir; nr: string }) {
  const s = SIGN_BY_NR.get(nr);
  // Mangler SVG-filen (ikke lastet ned ennå), vises skiltnummeret som plassholder.
  const [missing, setMissing] = useState(false);
  if (!s) return null;
  const [x, y] = onArm(d, BASE.sign);
  return (
    <g>
      <circle cx={x} cy={y} r={18} fill="#fff" opacity={0.85} stroke={missing ? '#888' : 'none'} />
      {missing ? (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700} fill="#333">
          {nr}
        </text>
      ) : (
        <image href={signUrl(s.file)} x={x - 15} y={y - 15} width={30} height={30} onError={() => setMissing(true)} />
      )}
    </g>
  );
}

function VehicleShape({ a }: { a: Actor }) {
  const fill = COLORS[a.color] ?? COLORS.blue;
  const stroke = a.color === 'white' || a.color === 'yellow' ? '#555' : 'rgba(0,0,0,.35)';
  switch (a.kind) {
    case 'bicycle':
      return (
        <g>
          <rect x={-4} y={-15} width={8} height={30} rx={4} fill="#333" />
          <circle r={7} fill={fill} stroke={stroke} />
        </g>
      );
    case 'bus':
    case 'truck':
      return (
        <g>
          <rect x={-14} y={-32} width={28} height={64} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={-11} y={-29} width={22} height={a.kind === 'bus' ? 8 : 14} rx={2} fill="#cfe3f5" />
        </g>
      );
    case 'tram':
      return (
        <g>
          <rect x={-15} y={-60} width={30} height={58} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={-15} y={2} width={30} height={58} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={-12} y={-57} width={24} height={8} rx={2} fill="#cfe3f5" />
        </g>
      );
    case 'emergency':
      return (
        <g>
          <rect x={-13} y={-23} width={26} height={46} rx={6} fill="#fff" stroke="#c62828" strokeWidth={2} />
          <rect x={-13} y={-2} width={26} height={6} fill="#c62828" />
          {a.siren && (
            <g className="siren">
              <rect x={-11} y={-10} width={10} height={5} rx={1} fill="#1e5aa8" />
              <rect x={1} y={-10} width={10} height={5} rx={1} fill="#1e5aa8" />
              <circle r={26} fill="none" stroke="#1e5aa8" strokeOpacity={0.35} strokeWidth={3} />
            </g>
          )}
        </g>
      );
    case 'pedestrian':
      return (
        <g>
          <circle r={9} fill={fill} stroke="#fff" strokeWidth={2} />
          <circle cy={-1} r={4} fill="#f2d2b6" />
        </g>
      );
    default:
      return (
        <g>
          <rect x={-13} y={-22} width={26} height={44} rx={7} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={-10} y={-15} width={20} height={9} rx={2} fill="#cfe3f5" />
          <rect x={-10} y={9} width={20} height={6} rx={2} fill="#cfe3f5" opacity={0.8} />
        </g>
      );
  }
}

export interface SceneViewProps {
  /** Tegnemodellen. Lag den med scenarioToDrawing() i src/scene/fromScenario.ts. */
  scene: { junction: Junction; actors: Actor[]; id?: string };
  /** Etikett for skjermlesere. */
  label?: string;
  /** Trykk på en trafikant (vikeplikt-krysset). */
  onActorClick?: (id: string) => void;
  /** Rekkefølgenummer som vises på trafikantene. */
  badges?: Record<string, string>;
  /** Trafikanter som tones ned. */
  dimmed?: string[];
  highlight?: string[];
  /** Skilt som skal tegnes. Når den er satt, brukes den i stedet for skilt utledet av armtypen. */
  signs?: { arm: Dir; nr: string }[];
}

export function SceneView({ scene, label, onActorClick, badges = {}, dimmed = [], highlight = [], signs }: SceneViewProps) {
  const j = scene.junction;
  const roundabout = j.kind === 'roundabout';
  const idSafe = (scene.id ?? 'scene').replace(/[^a-z0-9-]/gi, '');
  return (
    <svg className="scene" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
      <defs>
        {Object.entries(COLORS).map(([k, c]) => (
          <marker key={k} id={`arr-${idSafe}-${k}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} stroke="#222" strokeWidth={0.6} />
          </marker>
        ))}
      </defs>
      <rect width={SIZE} height={SIZE} fill="var(--grass)" />
      {DIRS.filter((d) => j.arms[d]).map((d) => (
        <ArmRoad key={d} d={d} arm={j.arms[d]!} roundabout={roundabout} />
      ))}
      {roundabout ? (
        <g>
          <circle cx={C} cy={C} r={95} fill="var(--road)" />
          <circle cx={C} cy={C} r={38} fill="var(--grass)" stroke="#fff" strokeWidth={3} />
        </g>
      ) : (
        <rect x={C - HALF} y={C - HALF} width={HALF * 2} height={HALF * 2} fill="var(--road)" />
      )}
      {signs
        ? signs.map((sg) => <SignPost key={sg.arm + sg.nr} d={sg.arm} nr={sg.nr} />)
        : DIRS.filter((d) => j.arms[d]).map((d) => {
            const c = j.arms[d]!.control;
            const nr = roundabout && c !== 'exit' ? '202' : SIGN_FOR[c];
            return nr ? <SignPost key={d} d={d} nr={nr} /> : null;
          })}
      {roundabout && !signs && <SignPost d="S" nr="406" />}

      {scene.actors.map((a) => {
        const pose = actorPose(a, j.kind);
        const clickable = !!onActorClick;
        const [lx, ly] = a.kind === 'pedestrian' ? [pose.at[0], pose.at[1] - 20] : pose.at;
        return (
          <g
            key={a.id}
            className={`actor${clickable ? ' actor--clickable' : ''}${highlight.includes(a.id) ? ' actor--hl' : ''}`}
            opacity={dimmed.includes(a.id) ? 0.35 : 1}
            onClick={clickable ? () => onActorClick(a.id) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={clickable ? a.id : undefined}
            onKeyDown={clickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onActorClick(a.id) : undefined}
          >
            <g transform={`translate(${pose.at[0]} ${pose.at[1]}) rotate(${pose.angle})`}>
              <VehicleShape a={a} />
              <IntentArrow a={a} marker={`arr-${idSafe}-${a.color}`} />
            </g>
            {clickable && <circle cx={pose.at[0]} cy={pose.at[1]} r={34} fill="transparent" />}
            <g transform={`translate(${lx} ${ly})`}>
              <circle r={11} fill="#fff" stroke="#222" strokeWidth={1.5} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#111">
                {a.id}
              </text>
            </g>
            {badges[a.id] && (
              <g transform={`translate(${lx + 16} ${ly - 14})`}>
                <circle r={10} fill="var(--accent)" />
                <text textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700} fill="#fff">
                  {badges[a.id]}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
