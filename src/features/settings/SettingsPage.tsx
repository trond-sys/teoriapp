import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { exportAll, exportThaiReports } from '../../db/export';
import type { Scaffold } from '../../domain/types';
import { useSettings } from '../../i18n/LangProvider';
import { U } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { VoiceStatus } from './VoiceStatus';

const LEVELS: Scaffold[] = ['forsta', 'bro', 'eksamen'];

export function SettingsPage() {
  const { settings, set } = useSettings();
  const newReports = useLiveQuery(() => db.thReports.where('status').equals('new').count(), [], 0);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted, () => setPersisted(false));
  }, []);

  return (
    <div className="page stack">
      <h1>
        <U k="settings.title" />
      </h1>

      <section className="card stack">
        <h2>
          <U k="settings.scaffold" />
        </h2>
        <div className="choice-list" role="radiogroup">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={settings.scaffold === l}
              className={`choice${settings.scaffold === l ? ' is-selected' : ''}`}
              onClick={() => set('scaffold', l)}
            >
              <strong>
                <U k={`scaffold.${l}` as 'scaffold.bro'} sub />
              </strong>
              <span className="muted small">
                <U k={`scaffold.${l}.desc` as 'scaffold.bro.desc'} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>
          <U k="settings.examLang" />
        </h2>
        <div className="segmented" role="radiogroup">
          {(['en', 'nb'] as const).map((l) => (
            <button key={l} type="button" role="radio" aria-checked={settings.examLang === l} className={settings.examLang === l ? 'is-selected' : ''} onClick={() => set('examLang', l)}>
              <U k={`lang.${l}`} />
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>
          <U k="settings.voices" />
        </h2>
        <VoiceStatus />
        <h3>
          <U k="settings.ttsRate" />
        </h3>
        <div className="segmented" role="radiogroup">
          {[0.8, 1].map((r) => (
            <button key={r} type="button" role="radio" aria-checked={settings.ttsRate === r} className={settings.ttsRate === r ? 'is-selected' : ''} onClick={() => set('ttsRate', r)}>
              <U k={r === 1 ? 'settings.rateNormal' : 'settings.rateSlow'} />
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>
          <U k="settings.data" />
        </h2>
        <p className="muted">
          <U k="settings.exportHint" />
        </p>
        <div className="row-wrap">
          <button type="button" className="btn" onClick={() => void exportAll()}>
            <Icon name="download" size={20} /> <U k="settings.export" />
          </button>
          <button type="button" className="btn" onClick={() => void exportThaiReports()} disabled={!newReports}>
            <Icon name="flag" size={20} /> <U k="settings.exportThai" vars={{ a: newReports ?? 0 }} />
          </button>
        </div>
        {persisted !== null && (
          <p className="muted small">
            <U k="settings.storage" vars={{ a: '' }} />
            <U k={persisted ? 'settings.yes' : 'settings.no'} />
          </p>
        )}
      </section>

      <section className="card stack">
        <button type="button" className="btn" onClick={() => set('onboarded', false)}>
          <U k="settings.setupAgain" />
        </button>
        <Link to="/review" className="muted small">
          <U k="settings.review" />
        </Link>
        <p className="muted small">
          <U k="settings.version" vars={{ a: __APP_VERSION__ }} />
        </p>
      </section>
    </div>
  );
}
