// App-skall: sidefelt på brede skjermer (nettbrett liggende), bunnfaner på telefon og stående nettbrett.
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { U } from '../i18n/T';
import type { UiKey } from '../i18n/strings';
import { Icon, type IconName } from './Icon';

const TABS: { to: string; icon: IconName; label: UiKey; end?: boolean }[] = [
  { to: '/', icon: 'today', label: 'nav.today', end: true },
  { to: '/practice', icon: 'practice', label: 'nav.practice' },
  { to: '/signs', icon: 'signs', label: 'nav.signs' },
  { to: '/glossary', icon: 'glossary', label: 'nav.glossary' },
  { to: '/progress', icon: 'progress', label: 'nav.progress' },
];

function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div className="banner" role="status">
      <U k="settings.update" />
      <button type="button" className="btn btn--primary btn--small" onClick={() => updateServiceWorker(true)}>
        <U k="settings.updateNow" />
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <nav className="nav" aria-label="Meny">
        <div className="nav-brand">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          <U k="app.name" />
        </div>
        <ul className="nav-list">
          {TABS.map((t) => (
            <li key={t.to}>
              <NavLink to={t.to} end={t.end} className="nav-item">
                <Icon name={t.icon} />
                <span className="nav-label">
                  <U k={t.label} />
                </span>
              </NavLink>
            </li>
          ))}
          <li className="nav-settings">
            <NavLink to="/settings" className="nav-item">
              <Icon name="settings" />
              <span className="nav-label">
                <U k="nav.settings" />
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main">
        <UpdateBanner />
        {children}
      </main>
    </div>
  );
}
