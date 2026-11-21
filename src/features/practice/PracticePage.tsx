import { Link } from 'react-router-dom';
import { QUESTIONS, STUDENT_SCENARIOS } from '../../content/index';
import { TEMA_GRUPPER, TEMALISTE, type TemaGruppe } from '../../config/temaliste';
import { useLayers, U } from '../../i18n/T';
import { Icon } from '../../components/Icon';

export function PracticePage() {
  const { main } = useLayers();
  const count = (ref: string) => QUESTIONS.filter((q) => q.temalisteRef === ref).length;
  const groups = Object.keys(TEMA_GRUPPER) as TemaGruppe[];
  return (
    <div className="page stack">
      <h1>
        <U k="practice.title" sub />
      </h1>
      {STUDENT_SCENARIOS.length > 0 && (
        <Link to="/practice/yield" className="card link-card">
          <Icon name="today" size={32} />
          <div>
            <h2>
              <U k="practice.yield" sub />
            </h2>
            <p className="muted">
              <U k="practice.yieldIntro" />
            </p>
          </div>
          <Icon name="next" />
        </Link>
      )}
      <h2>
        <U k="practice.byTopic" />
      </h2>
      <div className="topic-groups">
        {groups.map((g) => {
          const topics = TEMALISTE.filter((t) => t.gruppe === g && count(t.id) > 0);
          if (!topics.length) return null;
          return (
            <section key={g} className="card stack">
              <h3 lang={main}>{TEMA_GRUPPER[g][main]}</h3>
              <ul className="plain-list">
                {topics.map((t) => (
                  <li key={t.id}>
                    <Link to={`/practice/topic/${t.id}`} className="topic-link">
                      <span lang={main}>{t[main]}</span>
                      <span className="muted small">
                        <U k="practice.questions" vars={{ a: count(t.id) }} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
