// Rett vegstrekning sett ovenfra, til tegninger i flervalg (holdeplass, gangfelt, møtende, motorveg, planovergang).
// Samme bildespråk som SceneView: «du» kjører oppover i høyre felt. Tegningen viser situasjonen, ikke svaret.
import { useState } from 'react';
import type { Actor, StretchActor, StretchIllustration } from '../content/schema';
import { SIGN_BY_NR, signUrl } from '../content/index';
import { COLORS, SIZE } from './layout';
import { FRONT, VehicleShape } from './SceneView';

const KIND: Record<StretchActor['kind'], Actor['kind']> = {
  bil: 'car',
  buss: 'bus',
  lastebil: 'truck',
  trikk: 'tram',
  tog: 'train',
  utrykning: 'emergency',
  gaende: 'pedestrian',
  syklist: 'bicycle',
};

type Pt = [number, number];

/** Høyde (y) for en plassering langs vegen. 0 = nederst, 100 = øverst. */
const yAt = (at: number) => 372 - at * 3.44;

/** Vegens geometri for de tre vegtypene. */
function geometry(road: StretchIllustration['road']) {
  if (road === 'motorveg')
    return {
      left: 90,
      right: 305,
      lanes: { 'eget-felt': 280, 'venstre-felt': 230, motgaende: 115 } as Record<string, number>,
      median: [190, 205] as Pt,
    };
  if (road === 'smal') return { left: 170, right: 230, lanes: { 'eget-felt': 213, motgaende: 187 } as Record<string, number> };
  return { left: 160, right: 240, lanes: { 'eget-felt': 220, motgaende: 180 } as Record<string, number> };
}

/** Avkjøringsrampen som en kurve fra høyre kant og opp mot høyre. */
const RAMP = { p0: [300, 372] as Pt, c1: [318, 280] as Pt, c2: [340, 200] as Pt, p1: [410, 120] as Pt };
function onRamp(t: number): { at: Pt; angle: number } {
  const { p0, c1, c2, p1 } = RAMP;
  const m = 1 - t;
  const x = m ** 3 * p0[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t ** 3 * p1[0];
  const y = m ** 3 * p0[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t ** 3 * p1[1];
  const dx = 3 * m * m * (c1[0] - p0[0]) + 6 * m * t * (c2[0] - c1[0]) + 3 * t * t * (p1[0] - c2[0]);
  const dy = 3 * m * m * (c1[1] - p0[1]) + 6 * m * t * (c2[1] - c1[1]) + 3 * t * t * (p1[1] - c2[1]);
  return { at: [x, y], angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90 };
}

const RAIL_Y = 150;

function pose(a: StretchActor, ill: StretchIllustration): { at: Pt; angle: number } {
  const g = geometry(ill.road);
  switch (a.lane) {
    case 'rampe':
      return onRamp(a.at / 100);
    case 'spor': {
      const x = 30 + a.at * 3.4;
      return { at: [x, RAIL_Y], angle: a.at > 50 ? -90 : 90 };
    }
    case 'holdeplass':
      return { at: [g.right + 15, yAt(a.at)], angle: 0 };
    case 'fortau':
      return { at: [g.right + 13, yAt(a.at)], angle: a.intent === 'krysser' ? -90 : 0 };
    case 'motgaende':
      return { at: [g.lanes.motgaende, yAt(a.at)], angle: 180 };
    default:
      return { at: [g.lanes[a.lane] ?? g.lanes['eget-felt'], yAt(a.at)], angle: a.intent === 'rygger' ? 180 : 0 };
  }
}

function Arrow({ a, marker }: { a: StretchActor; marker: string }) {
  const kind = KIND[a.kind];
  const f = (FRONT[kind] ?? -22) - 4;
  const color = COLORS[a.color] ?? COLORS.blue;
  if (a.intent === 'star') return null;
  if (a.intent === 'rygger') {
    const r = -f;
    return <path d={`M 0 ${r} L 0 ${r + 30}`} fill="none" stroke={color} strokeWidth={5} strokeDasharray="6 4" strokeLinecap="round" markerEnd={`url(#${marker})`} />;
  }
  const d = a.intent === 'kjorer-ut' ? `M 0 ${f} Q 0 ${f - 26} -30 ${f - 34}` : `M 0 ${f} L 0 ${f - 34}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" markerEnd={`url(#${marker})`} />;
}

/** Blinklys foran og bak på den siden kjøretøyet skal svinge mot. */
function Blinker({ a }: { a: StretchActor }) {
  if (!a.blink) return null;
  const kind = KIND[a.kind];
  const half = kind === 'bus' || kind === 'truck' ? 14 : 13;
  const len = -(FRONT[kind] ?? -22);
  const x = a.blink === 'venstre' ? -half : half;
  return (
    <g className="blink" fill="#ffab00" stroke="#7a4b00" strokeWidth={1}>
      <circle cx={x} cy={-len + 3} r={4} />
      <circle cx={x} cy={len - 3} r={4} />
    </g>
  );
}

function SignAt({ x, y, nr }: { x: number; y: number; nr: string }) {
  const s = SIGN_BY_NR.get(nr);
  const [missing, setMissing] = useState(false);
  if (!s || missing) return null;
  return (
    <g>
      <line x1={x} y1={y + 14} x2={x} y2={y + 30} stroke="var(--post)" strokeWidth={3} />
      <circle cx={x} cy={y} r={18} fill="#fff" opacity={0.9} />
      <image href={signUrl(s.file)} x={x - 15} y={y - 15} width={30} height={30} onError={() => setMissing(true)} />
    </g>
  );
}

/** Fartsgrenseskilt (rød ring med tall), tegnet direkte. */
function SpeedSign({ x, y, kmh }: { x: number; y: number; kmh: number }) {
  return (
    <g>
      <line x1={x} y1={y + 16} x2={x} y2={y + 32} stroke="var(--post)" strokeWidth={3} />
      <circle cx={x} cy={y} r={17} fill="#fff" stroke="#c8102e" strokeWidth={5} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fontSize={kmh >= 100 ? 12 : 14} fontWeight={700} fill="#1b1f23">
        {kmh}
      </text>
    </g>
  );
}

/** Holdeplass-skilt (blått med buss), tegnet direkte. */
function BusStopSign({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y + 12} x2={x} y2={y + 30} stroke="var(--post)" strokeWidth={3} />
      <rect x={x - 12} y={y - 12} width={24} height={24} rx={3} fill="#0b4f9c" stroke="#fff" strokeWidth={2} />
      <rect x={x - 7} y={y - 6} width={14} height={10} rx={2} fill="#fff" />
      <circle cx={x - 4} cy={y + 6} r={1.8} fill="#fff" />
      <circle cx={x + 4} cy={y + 6} r={1.8} fill="#fff" />
    </g>
  );
}

/** Andreaskors (planovergang), med eller uten lyssignal. */
function RailCross({ x, y, lights }: { x: number; y: number; lights: boolean }) {
  return (
    <g>
      <line x1={x} y1={y - 4} x2={x} y2={y + 34} stroke="var(--post)" strokeWidth={3} />
      <g transform={`translate(${x} ${y - 8})`}>
        {[45, -45].map((r) => (
          <rect key={r} x={-18} y={-4} width={36} height={8} rx={1} fill="#fff" stroke="#c8102e" strokeWidth={2} transform={`rotate(${r})`} />
        ))}
      </g>
      {lights && (
        <g transform={`translate(${x} ${y + 18})`}>
          <rect x={-14} y={-6} width={28} height={12} rx={6} fill="#1f1f1f" />
          <circle cx={-7} r={4} fill="#3a3a3a" />
          <circle cx={7} r={4} fill="#3a3a3a" />
        </g>
      )}
    </g>
  );
}

export function StretchView({ ill, label, id = 'strekning' }: { ill: StretchIllustration; label?: string; id?: string }) {
  const g = geometry(ill.road);
  const idSafe = id.replace(/[^a-z0-9-]/gi, '');
  const walk = (ill.sidewalks || ill.crosswalk) && ill.road !== 'motorveg';
  const cwY = 150; // gangfeltet
  return (
    <svg className="scene" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
      <defs>
        {Object.entries(COLORS).map(([k, c]) => (
          <marker key={k} id={`sarr-${idSafe}-${k}`} viewBox="0 0 10 10" refX={6} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={c} stroke="#222" strokeWidth={0.6} />
          </marker>
        ))}
      </defs>
      <rect width={SIZE} height={SIZE} fill="var(--grass)" />

      {/* Fortau og busslomme ligger under kjørebanen. */}
      {walk && (
        <g fill="var(--curb)">
          <rect x={g.right} y={0} width={26} height={SIZE} />
          <rect x={g.left - 26} y={0} width={26} height={SIZE} />
        </g>
      )}
      {ill.exitRamp && <path d={`M ${RAMP.p0.join(' ')} C ${RAMP.c1.join(' ')} ${RAMP.c2.join(' ')} ${RAMP.p1.join(' ')}`} fill="none" stroke="var(--road)" strokeWidth={42} />}

      <rect x={g.left} y={0} width={g.right - g.left} height={SIZE} fill="var(--road)" />

      {ill.busStop && (
        <g>
          <polygon points={`${g.right},250 ${g.right + 30},222 ${g.right + 30},110 ${g.right},84`} fill="var(--road)" />
          <line x1={g.right + 6} y1={222} x2={g.right + 6} y2={110} stroke="var(--marking)" strokeWidth={2} strokeDasharray="8 6" />
          <BusStopSign x={g.right + (walk ? 40 : 46)} y={108} />
        </g>
      )}

      {/* Oppmerking */}
      {ill.road === 'vanlig' && <line x1={200} y1={0} x2={200} y2={SIZE} stroke="var(--marking)" strokeWidth={2.5} strokeDasharray="16 12" />}
      {ill.road === 'motorveg' && g.median && (
        <g>
          <rect x={g.median[0]} y={0} width={g.median[1] - g.median[0]} height={SIZE} fill="var(--grass)" />
          <line x1={(g.median[0] + g.median[1]) / 2} y1={0} x2={(g.median[0] + g.median[1]) / 2} y2={SIZE} stroke="var(--post)" strokeWidth={3} />
          <line x1={255} y1={0} x2={255} y2={SIZE} stroke="var(--marking)" strokeWidth={2.5} strokeDasharray="16 12" />
          <line x1={140} y1={0} x2={140} y2={SIZE} stroke="var(--marking)" strokeWidth={2.5} strokeDasharray="16 12" />
          {[g.median[1] + 3, g.right - 3, g.left + 3, g.median[0] - 3].map((x) => (
            <line key={x} x1={x} y1={0} x2={x} y2={SIZE} stroke="var(--marking)" strokeWidth={2} />
          ))}
        </g>
      )}

      {ill.crosswalk && (
        <g fill="var(--marking)">
          {Array.from({ length: Math.floor((g.right - g.left - 6) / 11.5) }, (_, i) => (
            <rect key={i} x={g.left + 5 + i * 11.5} y={cwY} width={6} height={22} />
          ))}
        </g>
      )}
      {ill.crosswalk && <SignAt x={g.right + 40} y={cwY - 22} nr="516" />}

      {ill.railway && (
        <g>
          <rect x={0} y={RAIL_Y - 16} width={SIZE} height={32} fill="var(--ballast)" />
          <rect x={g.left} y={RAIL_Y - 14} width={g.right - g.left} height={28} fill="var(--road)" />
          {Array.from({ length: 29 }, (_, i) => i * 14 + 4)
            .filter((x) => x < g.left - 4 || x > g.right + 4)
            .map((x) => (
              <rect key={x} x={x} y={RAIL_Y - 13} width={6} height={26} fill="var(--sleeper)" />
            ))}
          {[RAIL_Y - 7, RAIL_Y + 7].map((y) => (
            <line key={y} x1={0} y1={y} x2={SIZE} y2={y} stroke="var(--rail)" strokeWidth={3} />
          ))}
          <RailCross x={g.right + 34} y={RAIL_Y + 58} lights={ill.railway.lights} />
          {ill.railway.barrier && <rect x={g.right - 70} y={RAIL_Y + 28} width={70} height={7} rx={3} fill="#fff" stroke="#c8102e" strokeWidth={2} strokeDasharray="10 8" />}
        </g>
      )}

      {ill.speed && <SpeedSign x={ill.road === 'motorveg' ? 345 : g.right + (walk ? 46 : 32)} y={ill.road === 'motorveg' ? 36 : 318} kmh={ill.speed} />}

      {ill.actors.map((a) => {
        const p = pose(a, ill);
        const kind = KIND[a.kind];
        const [lx, ly] = kind === 'pedestrian' ? [p.at[0], p.at[1] - 20] : p.at;
        return (
          <g key={a.id} className="actor">
            <g transform={`translate(${p.at[0]} ${p.at[1]}) rotate(${p.angle})`}>
              <VehicleShape a={{ kind, color: a.color, siren: a.bluelight }} />
              <Blinker a={a} />
              <Arrow a={a} marker={`sarr-${idSafe}-${a.color}`} />
            </g>
            <g transform={`translate(${lx} ${ly})`}>
              <circle r={11} fill="#fff" stroke="#222" strokeWidth={1.5} />
              <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill="#111">
                {a.id}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
