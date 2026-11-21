// Progresjon per tema i temalisten (prosent + farge), med og uten thai.
import { useLiveQuery } from 'dexie-react-hooks';
import { POOL } from '../../content/index';
import { TEMA_GRUPPER, TEMALISTE, type TemaGruppe } from '../../config/temaliste';
import { db } from '../../db/db';
import { exportAll } from '../../db/export';
import { masteryColor, topicMastery } from '../../domain/mastery';
import { U, useLayers } from '../../i18n/T';
import { Icon } from '../../components/Icon';

const pct = (x: number) => `${Math.round(x * 100)} %`;

export function ProgressPage() {
  const { main } = useLayers();
  const attempts = useLiveQuery(() => db.attempts.toArray(), [], []);
  const mastery = topicMastery(POOL, attempts ?? []);
  const total = attempts?.length ?? 0;
  const rightNoThai = attempts?.filter((a) => a.correct && !a.thaiUsed).length ?? 0;
  return (
    <div className="page stack">
      <h1>
        <U k="progress.title" sub />
      </h1>
      <p className="muted">
        <U k="progress.intro" />
      </p>
      <p className="muted small">
        <U k="progress.total" vars={{ a: total, b: rightNoThai }} />
      </p>
      <div className="topic-groups">
        {(Object.keys(TEMA_GRUPPER) as TemaGruppe[]).map((g) => (
          <section key={g} className="card stack">
            <h2 lang={main}>{TEMA_GRUPPER[g][main]}</h2>
            <ul className="mastery-list">
              {TEMALISTE.filter((t) => t.gruppe === g).map((t) => {
                const m = mastery.get(t.id);
                const color = m ? masteryColor(m.withoutThai) : 'none';
                return (
                  <li key={t.id} className={`mastery mastery--${color}`}>
                    <div className="mastery-head">
                      <span lang={main}>{t[main]}</span>
                      <strong>{m ? pct(m.withoutThai) : '–'}</strong>
                    </div>
                    <div className="bar" aria-hidden>
                      <div className="bar-fill" style={{ width: m ? pct(m.withoutThai).replace(' ', '') : 0 }} />
                    </div>
                    <span className="muted small">
                      {m ? (
                        <>
                          <U k="progress.practiced" vars={{ a: m.practiced, b: m.items }} /> · <U k="progress.withThai" vars={{ a: pct(m.withThai) }} />
                        </>
                      ) : (
                        <U k="progress.noItems" />
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <section className="card stack">
        <p className="muted">
          <U k="settings.exportHint" />
        </p>
        <button type="button" className="btn" onClick={() => void exportAll()}>
          <Icon name="download" size={20} /> <U k="settings.export" />
        </button>
      </section>
    </div>
  );
}
