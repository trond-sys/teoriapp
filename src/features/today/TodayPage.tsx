import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { POOL } from '../../content/index';
import { db } from '../../db/db';
import { suggestLessThai } from '../../domain/mastery';
import { planSession } from '../../domain/session';
import { useSettings } from '../../i18n/LangProvider';
import { U } from '../../i18n/T';
import { QuestionRunner, type Entry } from '../quiz/QuestionRunner';
import { toEntries } from '../quiz/entries';

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function TodayPage() {
  const { settings, set } = useSettings();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const data = useLiveQuery(async () => {
    const [srsRows, today, recent] = await Promise.all([
      db.srs.toArray(),
      db.attempts.where('at').aboveOrEqual(startOfDay()).count(),
      db.attempts.orderBy('at').reverse().limit(40).toArray(),
    ]);
    return { srs: new Map(srsRows.map((s) => [s.itemId, s])), today, recent };
  }, []);

  const plan = useMemo(() => (data ? planSession(POOL, data.srs, { now: Date.now() }) : []), [data]);

  if (!data) return null;

  if (entries) {
    return (
      <div className="page">
        <QuestionRunner entries={entries} mode="today" onExit={() => setEntries(null)} />
      </div>
    );
  }

  const due = plan.filter((p) => p.reason === 'due').length;
  const fresh = plan.filter((p) => p.reason === 'new').length;
  const showSuggest = settings.scaffold !== 'eksamen' && suggestLessThai(data.recent);

  return (
    <div className="page stack">
      <section className="card hero stack">
        <h1>
          <U k="today.title" sub />
        </h1>
        <p>
          <U k="today.intro" sub />
        </p>
        <p className="muted">
          <U k="today.plan" vars={{ a: due, b: fresh }} />
        </p>
        {data.today > 0 && (
          <p className="muted small">
            <U k="today.doneToday" vars={{ a: data.today }} />
          </p>
        )}
        <button type="button" className="btn btn--primary btn--big" disabled={!plan.length} onClick={() => setEntries(toEntries(plan))}>
          <U k="common.start" />
        </button>
        {!plan.length && (
          <p className="muted">
            <U k="quiz.noItems" />
          </p>
        )}
      </section>
      {showSuggest && (
        <section className="card note stack">
          <p>
            <U k="today.suggestLessThai" sub />
          </p>
          <button type="button" className="btn" onClick={() => set('scaffold', 'eksamen')}>
            <U k="today.tryExamLevel" />
          </button>
        </section>
      )}
    </div>
  );
}
