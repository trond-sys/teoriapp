// Skjult redaktørside (/review) for Trond: uverifiserte elementer, thai-rapporter og dekning mot temalisten.
// Siden er bare for redaktøren og vises på norsk med engelsk for UI-overskrifter.
import { useLiveQuery } from 'dexie-react-hooks';
import { QUESTIONS, SCENARIOS, SCENES, SIGNS } from '../../content/index';
import { ScenarioPreview } from './ScenarioPreview';
import { TEMALISTE } from '../../config/temaliste';
import { db } from '../../db/db';
import { exportThaiReports } from '../../db/export';
import { RULES } from '../../domain/yield/rules';
import { U } from '../../i18n/T';

export function ReviewPage() {
  const reports = useLiveQuery(() => db.thReports.orderBy('id').toArray(), [], []);
  const unverified = [
    ...QUESTIONS.filter((q) => !q.verified).map((q) => ({ id: q.id, what: q.prompt.nb, source: q.source, todo: q.todo })),
    ...SCENES.filter((s) => !s.verified).map((s) => ({ id: s.id, what: s.prompt.nb, source: s.source, todo: s.todo })),
    ...SIGNS.filter((s) => !s.verified).map((s) => ({ id: `skilt ${s.nr}`, what: s.name.nb, source: s.source, todo: s.todo })),
    ...Object.values(RULES)
      .filter((r) => !r.verified)
      .map((r) => ({ id: `motorregel ${r.id}`, what: r.why.nb, source: r.source, todo: r.todo })),
  ];
  return (
    <div className="page stack" lang="nb">
      <h1>
        <U k="review.title" />
      </h1>

      <section className="stack">
        <h2>Håndlagde scenarier – Endring 01 ({SCENARIOS.length})</h2>
        <p className="muted small">
          Fasit og hjemmel er data i src/content/scenes/. Pilene viser bare hvor hver trafikant skal, ikke kjørebanen. Advarslene kommer fra
          validatoren (geometri, ingen trafikkregler). Scenene vises ikke for eleven ennå.
        </p>
        {SCENARIOS.map((sc) => (
          <ScenarioPreview key={sc.id} s={sc} />
        ))}
      </section>

      <section className="card stack">
        <h2>
          <U k="review.reports" vars={{ a: reports?.length ?? 0 }} />
        </h2>
        {reports?.length ? (
          <>
            <table className="table">
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <code>{r.itemId}</code>
                      <br />
                      <span className="muted small">{r.field}</span>
                    </td>
                    <td lang="th">{r.current}</td>
                    <td lang="th">{r.suggestion}</td>
                    <td>{r.comment}</td>
                    <td className="small">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="btn" onClick={() => void exportThaiReports()}>
              <U k="settings.exportThai" vars={{ a: reports.filter((r) => r.status === 'new').length }} />
            </button>
          </>
        ) : (
          <U k="review.none" />
        )}
      </section>

      <section className="card stack">
        <h2>
          <U k="review.unverified" vars={{ a: unverified.length }} />
        </h2>
        <table className="table">
          <tbody>
            {unverified.map((u) => (
              <tr key={u.id}>
                <td>
                  <code>{u.id}</code>
                </td>
                <td>
                  {u.what}
                  {u.todo && <div className="todo">TODO: {u.todo}</div>}
                </td>
                <td className="small muted">{u.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card stack">
        <h2>
          <U k="review.coverage" />
        </h2>
        <table className="table table--compact">
          <thead>
            <tr>
              <th>
                <U k="review.colRef" />
              </th>
              <th>
                <U k="review.colMade" />
              </th>
              <th>
                <U k="review.colVerified" />
              </th>
              <th>
                <U k="review.colGoal" />
              </th>
            </tr>
          </thead>
          <tbody>
            {TEMALISTE.map((t) => {
              const qs = QUESTIONS.filter((q) => q.temalisteRef === t.id);
              return (
                <tr key={t.id} className={qs.length >= t.mvp ? 'ok' : ''}>
                  <td>
                    <code>{t.id}</code> {t.nb}
                  </td>
                  <td>{qs.length}</td>
                  <td>{qs.filter((q) => q.verified).length}</td>
                  <td>
                    {t.mvp} / {t.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted small">
          Skilt: {SIGNS.length} · Scener: {SCENES.length}
        </p>
      </section>
    </div>
  );
}
