// Vikeplikt-krysset (Endring 01): retter mot fasiten som er lagret i scenen (answer), og forklarer med
// hjemmel per steg. Ingen kode her avgjør vikeplikt.
import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import type { L3, Scenario, ScenarioActor } from '../../content/schema';
import { gradeOrder, type OrderGrade } from '../../domain/scenes/grade';
import { ui } from '../../i18n/strings';
import { T, TLine, TranslateAllButton, U } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { UnverifiedBadge } from '../../components/UnverifiedBadge';
import { SceneView } from '../../scene/SceneView';
import { COLORS } from '../../scene/layout';
import { ACTOR_UI_KEY, scenarioToDrawing } from '../../scene/fromScenario';

const actorName = (a: ScenarioActor) => ui(ACTOR_UI_KEY[a.kind]);

/** «A (bil)» på alle tre språk. */
function labelL3(a: ScenarioActor): L3 {
  const n = actorName(a);
  return { nb: `${a.id} (${n.nb})`, en: `${a.id} (${n.en})`, th: `${a.id} (${n.th})` };
}

function Chip({ a, onClick, onPointerDown, ghost }: { a: ScenarioActor; onClick?: () => void; onPointerDown?: (e: RPointerEvent) => void; ghost?: boolean }) {
  return (
    <button type="button" className={`chip${ghost ? ' chip--ghost' : ''}`} onClick={onClick} onPointerDown={onPointerDown} style={{ ['--chip' as string]: COLORS[a.color] }}>
      <span className="chip-dot">{a.id}</span>
      <span className="chip-name">
        <U k={ACTOR_UI_KEY[a.kind]} />
      </span>
    </button>
  );
}

type Result = { correct: boolean; order?: OrderGrade; chosen?: string };

export function YieldBoard({ scene, onChecked }: { scene: Scenario; onChecked?: (correct: boolean) => void }) {
  const drawing = useMemo(() => scenarioToDrawing(scene), [scene]);
  const byId = useMemo(() => new Map(scene.actors.map((a) => [a.id, a])), [scene]);
  const [order, setOrder] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const slotsRef = useRef<HTMLOListElement>(null);
  const q = scene.question;
  const done = result !== null;
  const isOrder = q.type === 'rekkefolge';

  const finish = (r: Result) => {
    setResult(r);
    onChecked?.(r.correct);
  };

  const place = (id: string, at?: number) => {
    if (done || !isOrder) return;
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
      slotsRef.current?.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => {
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

  const remaining = scene.actors.filter((a) => !order.includes(a.id));
  const badges = Object.fromEntries(order.map((id, i) => [id, String(i + 1)]));
  const highlight = result?.order ? result.order.violations.map(([x]) => x) : [];

  return (
    <div className="qcard qcard--media yield">
      <div className="qcard-media">
        <SceneView
          scene={drawing}
          signs={scene.layout.signs}
          label={scene.question.prompt.en}
          onActorClick={done || !isOrder ? undefined : (id) => (order.includes(id) ? remove(id) : place(id))}
          badges={badges}
          highlight={highlight}
        />
      </div>
      <div className="qcard-main stack">
        <div className="qcard-top">
          {!scene.verified && <UnverifiedBadge />}
          <TranslateAllButton />
        </div>
        <T as="h2" text={q.prompt} terms={scene.glossaryTerms} report={{ itemId: scene.id, field: 'question.prompt' }} />

        {q.type === 'rekkefolge' && (
          <>
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
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={order.length !== scene.actors.length}
                  onClick={() => {
                    const g = gradeOrder(scene.answer.order ?? [], order);
                    finish({ correct: g.correct, order: g });
                  }}
                >
                  <U k="yield.check" />
                </button>
              </div>
            )}
          </>
        )}

        {q.type === 'ja-nei' && (
          <div className="row-wrap">
            {(['ja', 'nei'] as const).map((v) => {
              const yes = v === 'ja';
              const state = !done ? '' : yes === scene.answer.yes ? ' is-correct' : result?.chosen === v ? ' is-wrong' : ' is-dim';
              return (
                <button key={v} type="button" className={`option option--yesno${state}`} disabled={done} onClick={() => finish({ correct: yes === scene.answer.yes, chosen: v })}>
                  <U k={yes ? 'yield.yes' : 'yield.no'} sub />
                </button>
              );
            })}
          </div>
        )}

        {q.type === 'velg' && (
          <ul className="options" role="list">
            {q.options.map((o) => {
              const isCorrect = o.id === scene.answer.correct;
              const state = !done ? '' : isCorrect ? ' is-correct' : result?.chosen === o.id ? ' is-wrong' : ' is-dim';
              return (
                <li key={o.id} className="option-row">
                  <button type="button" className={`option${state}`} disabled={done} onClick={() => finish({ correct: isCorrect, chosen: o.id })}>
                    <span className="option-letter" aria-hidden>
                      {o.id.toUpperCase()}
                    </span>
                    <TLine text={o.text} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {result && <ScenarioFeedback scene={scene} result={result} byId={byId} />}
      </div>
      {drag && byId.get(drag.id) && (
        <div className="drag-ghost" style={{ left: drag.x, top: drag.y }}>
          <Chip a={byId.get(drag.id)!} />
        </div>
      )}
    </div>
  );
}

function ScenarioFeedback({ scene, result, byId }: { scene: Scenario; result: Result; byId: Map<string, ScenarioActor> }) {
  const report = (field: string) => ({ itemId: scene.id, field });
  const name = (id: string) => labelL3(byId.get(id)!);
  const join3 = (ids: string[]): L3 => {
    const tog = ui('yield.together');
    const parts = ids.map(name);
    const j = (l: keyof L3) => parts.map((p) => p[l]).join(' + ') + (ids.length > 1 ? ` (${tog[l]})` : '');
    return { nb: j('nb'), en: j('en'), th: j('th') };
  };
  /** Forklaringen fra fasiten for at x ikke kan kjøre før y, hvis den finnes. */
  const why = (x: string, y: string) => scene.answer.steps.findIndex((s) => s.who === x && s.yieldsTo.includes(y));
  const wrongOpt = scene.question.type === 'velg' ? scene.question.options.find((o) => o.id === result.chosen) : undefined;

  return (
    <div className={`feedback ${result.correct ? 'feedback--ok' : 'feedback--bad'} stack`} role="status">
      <p className="feedback-head">
        <Icon name={result.correct ? 'check' : 'cross'} /> <U k={result.correct ? 'quiz.correct' : 'quiz.wrong'} sub />
      </p>

      {!result.correct &&
        (() => {
          // Én forklaring per steg i fasiten, selv om eleven brøt flere av vikepliktene i samme steg.
          const steps = new Set<number>();
          const loose: [string, string][] = [];
          for (const [x, y] of result.order?.violations ?? []) {
            const i = why(x, y);
            if (i >= 0) steps.add(i);
            else loose.push([x, y]);
          }
          return (
            <>
              {[...steps].map((i) => (
                <T key={i} text={scene.answer.steps[i].explanation} speakable={false} report={report(`answer.steps.${i}.explanation`)} />
              ))}
              {loose.map(([x, y]) => (
                <p key={x + y}>
                  <U k="yield.mistake" vars={{ a: x, b: y }} />
                </p>
              ))}
            </>
          );
        })()}
      {!result.correct && wrongOpt?.whyWrong && <T text={wrongOpt.whyWrong} report={report(`question.options.${wrongOpt.id}.whyWrong`)} />}

      {scene.answer.order && (
        <section>
          <h3 className="small-head">
            <U k="yield.correctOrder" />
          </h3>
          <ol className="order-list">
            {scene.answer.order.map((g) => (
              <li key={g.join()}>
                <T as="span" text={join3(g)} speakable={false} />
              </li>
            ))}
          </ol>
          {result.correct &&
            result.order?.simultaneous.map(([a, b]) => (
              <p key={a + b} className="muted small">
                <U k="yield.simultaneous" vars={{ a, b }} />
              </p>
            ))}
        </section>
      )}

      <section>
        <h3 className="small-head">
          <U k="yield.whoYields" />
        </h3>
        <ol className="steps">
          {scene.answer.steps.map((st, i) => (
            <li key={i} className="stack">
              <T text={st.explanation} terms={scene.glossaryTerms} report={report(`answer.steps.${i}.explanation`)} />
              <blockquote className="quote small">
                <span lang="nb">«{st.source.quote}»</span>
                <br />
                <span className="muted">
                  —{' '}
                  {st.source.url ? (
                    <a href={st.source.url} target="_blank" rel="noreferrer">
                      {st.source.ref}
                    </a>
                  ) : (
                    st.source.ref
                  )}
                </span>
              </blockquote>
            </li>
          ))}
        </ol>
      </section>

      {scene.thaiContrast && (
        <section className="contrast">
          <h3 className="small-head">
            <U k="quiz.thaiContrast" />
          </h3>
          <T text={scene.thaiContrast} report={report('thaiContrast')} />
        </section>
      )}
    </div>
  );
}

