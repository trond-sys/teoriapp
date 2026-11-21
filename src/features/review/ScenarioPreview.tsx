// Forhåndsvisning av et håndlagd scenario for redaktøren (/review): tegning med intensjonspiler,
// spørsmål og fasit på alle tre språk, hjemmel per steg og advarsler fra validatoren.
// Siden er for Trond, så teksten er på norsk.
import { useMemo } from 'react';
import { GLOSSARY, SIGNS } from '../../content/index';
import type { L3, Scenario } from '../../content/schema';
import { validateScenario } from '../../domain/scenes/validate';
import { SceneView } from '../../scene/SceneView';
import { scenarioToDrawing } from '../../scene/fromScenario';

const KIND_NB: Record<string, string> = { bil: 'bil', buss: 'buss', lastebil: 'lastebil', trikk: 'trikk', utrykning: 'utrykning', gaende: 'gående', syklist: 'syklist' };
const INTENT_NB: Record<string, string> = { 'rett-fram': 'rett fram', hoyre: 'til høyre', venstre: 'til venstre', krysser: 'krysser' };

function Tri({ t }: { t: L3 }) {
  return (
    <div className="tri-preview">
      <p lang="nb">{t.nb}</p>
      <p lang="en" className="muted">
        {t.en}
      </p>
      <p lang="th" className="muted">
        {t.th}
      </p>
    </div>
  );
}

export function ScenarioPreview({ s }: { s: Scenario }) {
  const ctx = useMemo(() => ({ signNrs: new Set(SIGNS.map((x) => x.nr)), termIds: new Set(GLOSSARY.map((g) => g.id)) }), []);
  const issues = useMemo(() => validateScenario(s, ctx), [s, ctx]);
  const drawing = useMemo(() => scenarioToDrawing(s), [s]);
  return (
    <article className="card scenario-preview">
      <div className="scenario-preview-media">
        <SceneView scene={drawing} arrows="intent" signs={s.layout.signs} label={s.question.prompt.nb} />
      </div>
      <div className="stack scenario-preview-body">
        <header>
          <h3>
            <code>{s.id}</code>
          </h3>
          <p className="small muted">
            {s.tier} · {s.subtopic} · {s.temalisteRef ?? 'ingen temalisteRef'} · vanskelighet {s.difficulty} ·{' '}
            <strong>{s.verified ? `verifisert av ${s.verifiedBy ?? '?'} ${s.verifiedAt ?? ''}` : 'ikke verifisert'}</strong>
          </p>
        </header>

        {issues.length > 0 && (
          <ul className="plain-list">
            {issues.map((i, k) => (
              <li key={k} className={i.level === 'error' ? 'issue issue--error' : 'issue issue--warn'}>
                {i.level === 'error' ? 'Feil' : 'Advarsel'}: {i.message}
              </li>
            ))}
          </ul>
        )}

        <section>
          <h4 className="small-head">Trafikanter</h4>
          <ul className="plain-list small">
            {s.actors.map((a) => (
              <li key={a.id}>
                <strong>{a.id}</strong>: {KIND_NB[a.kind]} fra {a.from}, {INTENT_NB[a.intent]}
                {a.position ? `, ${a.position}` : ''}
                {a.bluelight ? ', blått lys' : ''}
              </li>
            ))}
            {s.layout.signs.map((sg) => (
              <li key={sg.arm + sg.nr} className="muted">
                Skilt {sg.nr} på armen {sg.arm}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="small-head">Spørsmål ({s.question.type})</h4>
          <Tri t={s.question.prompt} />
        </section>

        <section>
          <h4 className="small-head">Fasit</h4>
          {s.answer.order && (
            <p>
              <strong>Rekkefølge:</strong> {s.answer.order.map((g) => g.join(' + ') + (g.length > 1 ? ' (samtidig)' : '')).join(' → ')}
            </p>
          )}
          <ol className="steps">
            {s.answer.steps.map((st, k) => (
              <li key={k} className="stack">
                <p>
                  <strong>{st.who}</strong> {st.yieldsTo.length ? `viker for ${st.yieldsTo.join(', ')}` : 'viker ikke'}
                </p>
                <Tri t={st.explanation} />
                <blockquote className="quote small">
                  «{st.source.quote}»
                  <br />
                  <span className="muted">
                    — {st.source.url ? (
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

        {s.thaiContrast && (
          <section>
            <h4 className="small-head">Thailand og Norge</h4>
            <Tri t={s.thaiContrast} />
          </section>
        )}
        {s.todo && <p className="todo small">TODO: {s.todo}</p>}
      </div>
    </article>
  );
}
