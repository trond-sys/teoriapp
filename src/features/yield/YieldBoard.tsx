// Vikeplikt-krysset: eleven setter trafikantene i rekkefølge (trykk eller dra), og motoren retter.
import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { Actor, YieldScene } from '../../content/schema';
import { analyze, grade, type Grade } from '../../domain/yield/engine';
import { RULES } from '../../domain/yield/rules';
import { fmtL3, ui } from '../../i18n/strings';
import { T, TranslateAllButton, U } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { UnverifiedBadge } from '../../components/UnverifiedBadge';
import { SceneView } from '../../scene/SceneView';
import { COLORS } from '../../scene/layout';

const actorName = (a: Actor) => ui(`actor.${a.kind}` as 'actor.car');

/** «A (bil)» på alle tre språk. */
function labelL3(a: Actor) {
  const n = actorName(a);
  return { nb: `${a.id} (${n.nb})`, en: `${a.id} (${n.en})`, th: `${a.id} (${n.th})` };
}

function Chip({ a, onClick, onPointerDown, ghost }: { a: Actor; onClick?: () => void; onPointerDown?: (e: RPointerEvent) => void; ghost?: boolean }) {
  return (
    <button type="button" className={`chip${ghost ? ' chip--ghost' : ''}`} onClick={onClick} onPointerDown={onPointerDown} style={{ ['--chip' as string]: COLORS[a.color] }}>
      <span className="chip-dot">{a.id}</span>
      <span className="chip-name">
        <U k={`actor.${a.kind}` as 'actor.car'} />
      </span>
    </button>
  );
}

export function YieldBoard({ scene, onChecked }: { scene: YieldScene; onChecked?: (correct: boolean) => void }) {
  const analysis = useMemo(() => analyze(scene), [scene]);
  const byId = useMemo(() => new Map(scene.actors.map((a) => [a.id, a])), [scene]);
  const [order, setOrder] = useState<string[]>([]);
  const [result, setResult] = useState<Grade | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const slotsRef = useRef<HTMLOListElement>(null);

  const remaining = scene.actors.filter((a) => !order.includes(a.id));
  const done = result !== null;

  const place = (id: string, at?: number) => {
    if (done) return;
    setOrder((o) => {
      const without = o.filter((x) => x !== id);
      const i = at === undefined ? without.length : Math.min(at, without.length);
      return [...without.slice(0, i), id, ...without.slice(i)];
    });
  };
  const remove = (id: string) => !done && setOrder((o) => o.filter((x) => x !== id));

  // Dra og slipp med pointer events (virker med berøring). Slippes brikken over en plass, settes den inn der.
  const startDrag = (id: string) => (e: RPointerEvent) => {
    if (done || e.button > 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    let moved = false;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
      moved = true;
      ev.preventDefault();
      setDrag({ id, x: ev.clientX, y: ev.clientY });
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      setDrag(null);
      if (!moved) return; // vanlig trykk håndteres av onClick
      const slots = slotsRef.current?.querySelectorAll<HTMLElement>('[data-slot]');
      slots?.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) place(id, Number(el.dataset.slot));
      });
      // Klikket som følger etter et dra skal ikke også plassere brikken.
      const swallow = (ce: MouseEvent) => {
        ce.stopPropagation();
        ce.preventDefault();
      };
      window.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 50);
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const check = () => {
    const g = grade(analysis, order);
    setResult(g);
    onChecked?.(g.correct);
  };

  const badges = Object.fromEntries(order.map((id, i) => [id, String(i + 1)]));

  if (analysis.error) return <p className="feedback feedback--bad">Scenen er ugyldig: {analysis.error.message}</p>;

  return (
    <div className="qcard qcard--media yield">
      <div className="qcard-media">
        <SceneView scene={scene} label={scene.prompt.en} onActorClick={done ? undefined : (id) => (order.includes(id) ? remove(id) : place(id))} badges={badges} highlight={result ? result.violations.map((v) => v.yielder) : []} />
      </div>
      <div className="qcard-main stack">
        <div className="qcard-top">
          {!scene.verified && <UnverifiedBadge />}
          <TranslateAllButton />
        </div>
        <T as="h2" text={scene.prompt} terms={scene.glossaryTerms} report={{ itemId: scene.id, field: 'prompt' }} />
        {!done && (
          <p className="muted small">
            <U k="yield.instruction" />
          </p>
        )}

        <ol className="slots" ref={slotsRef}>
          {scene.actors.map((_, i) => {
            const id = order[i];
            const a = id ? byId.get(id) : undefined;
            return (
              <li key={i} className={`slot${a ? ' is-filled' : ''}`} data-slot={i}>
                <span className="slot-nr">{i + 1}</span>
                {a ? <Chip a={a} onClick={() => remove(a.id)} onPointerDown={startDrag(a.id)} /> : <span className="slot-empty" aria-hidden />}
              </li>
            );
          })}
        </ol>

        {!done && remaining.length > 0 && (
          <div className="chip-tray">
            {remaining.map((a) => (
              <Chip key={a.id} a={a} onClick={() => place(a.id)} onPointerDown={startDrag(a.id)} ghost={drag?.id === a.id} />
            ))}
          </div>
        )}

        {!done && (
          <div className="row-wrap">
            <button type="button" className="btn" onClick={() => setOrder([])} disabled={!order.length}>
              <Icon name="reset" size={20} /> <U k="yield.reset" />
            </button>
            <button type="button" className="btn btn--primary" onClick={check} disabled={order.length !== scene.actors.length}>
              <U k="yield.check" />
            </button>
          </div>
        )}

        {result && <YieldFeedback scene={scene} result={result} groups={analysis.groups} byId={byId} />}
      </div>
      {drag && byId.get(drag.id) && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <Chip a={byId.get(drag.id)!} />
        </div>
      )}
    </div>
  );
}

function YieldFeedback({ scene, result, groups, byId }: { scene: YieldScene; result: Grade; groups: string[][]; byId: Map<string, Actor> }) {
  const report = (field: string) => ({ itemId: scene.id, field });
  const analysisEdges = useMemo(() => analyze(scene).edges, [scene]);
  const name = (id: string) => labelL3(byId.get(id)!);
  const join3 = (ids: string[]) => {
    const tog = ui('yield.together');
    const parts = ids.map(name);
    return {
      nb: parts.map((p) => p.nb).join(' + ') + (ids.length > 1 ? ` (${tog.nb})` : ''),
      en: parts.map((p) => p.en).join(' + ') + (ids.length > 1 ? ` (${tog.en})` : ''),
      th: parts.map((p) => p.th).join(' + ') + (ids.length > 1 ? ` (${tog.th})` : ''),
    };
  };
  return (
    <div className={`feedback ${result.correct ? 'feedback--ok' : 'feedback--bad'} stack`} role="status">
      <p className="feedback-head">
        <Icon name={result.correct ? 'check' : 'cross'} /> <U k={result.correct ? 'quiz.correct' : 'quiz.wrong'} sub />
      </p>
      {!result.correct &&
        result.violations.map((v) => (
          <T key={v.yielder + v.priority} text={fmtL3(RULES[v.rule].why, { a: v.yielder, b: v.priority })} speakable={false} />
        ))}
      <section>
        <h3 className="small-head">
          <U k="yield.correctOrder" />
        </h3>
        <ol className="order-list">
          {groups.map((g) => (
            <li key={g.join()}>
              <T as="span" text={join3(g)} speakable={false} />
            </li>
          ))}
        </ol>
        {result.correct &&
          result.simultaneous.map(([a, b]) => (
            <p key={a + b} className="muted small">
              <U k="yield.simultaneous" vars={{ a, b }} />
            </p>
          ))}
      </section>
      <section>
        <h3 className="small-head">
          <U k="yield.whoYields" />
        </h3>
        <ul className="plain-list">
          {analysisEdges.map((e) => (
            <li key={e.yielder + e.priority}>
              <T as="span" text={fmtL3(RULES[e.rule].why, { a: e.yielder, b: e.priority })} speakable={false} />
              <span className="muted small"> — {RULES[e.rule].source}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="small-head">
          <U k="quiz.why" />
        </h3>
        <T text={scene.explanation} terms={scene.glossaryTerms} report={report('explanation')} />
      </section>
      {scene.thaiContrast && (
        <section className="contrast">
          <h3 className="small-head">
            <U k="quiz.thaiContrast" />
          </h3>
          <T text={scene.thaiContrast} report={report('thaiContrast')} />
        </section>
      )}
      <p className="muted small source">
        <U k="quiz.source" />: {scene.source}
      </p>
    </div>
  );
}
