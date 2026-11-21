import { U, useUi } from '../i18n/T';

/** Diskret merke på innhold Trond ikke har kontrollert ennå (PLAN-fase0 §8a, svar 6). */
export function UnverifiedBadge() {
  const t = useUi();
  return (
    <span className="badge badge--warn" title={t('badge.unverifiedHelp')}>
      <U k="badge.unverified" />
    </span>
  );
}
