// Oppsett første gang: velkommen → prøvespråk → installer appen → stemmer for opplesning.
import { useState } from 'react';
import { useSettings } from '../../i18n/LangProvider';
import { ui, type UiKey } from '../../i18n/strings';
import { VoiceStatus } from './VoiceStatus';

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;

/** Oppsettet vises før hun har valgt språk: thai først, engelsk og norsk under. */
function Tri({ k, as: Tag = 'p' }: { k: UiKey; as?: 'p' | 'h1' | 'h2' }) {
  const t = ui(k);
  return (
    <div className="tri">
      <Tag lang="th">{t.th}</Tag>
      <p lang="en" className="tri-sub">
        {t.en}
      </p>
      <p lang="nb" className="tri-sub muted">
        {t.nb}
      </p>
    </div>
  );
}

export function SetupWizard() {
  const { settings, set } = useSettings();
  const [step, setStep] = useState(0);
  const steps = ['welcome', 'lang', 'install', 'voices'] as const;
  const last = step === steps.length - 1;
  const next = () => (last ? set('onboarded', true) : setStep(step + 1));

  return (
    <div className="setup">
      <div className="setup-card card stack">
        <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={56} height={56} />
        {steps[step] === 'welcome' && (
          <>
            <Tri k="setup.welcomeTitle" as="h1" />
            <Tri k="setup.welcomeText" />
          </>
        )}
        {steps[step] === 'lang' && (
          <>
            <Tri k="setup.langTitle" as="h1" />
            <div className="choice-list">
              {(['en', 'nb'] as const).map((l) => (
                <button key={l} type="button" className={`choice${settings.examLang === l ? ' is-selected' : ''}`} onClick={() => set('examLang', l)} aria-pressed={settings.examLang === l}>
                  <strong lang={l}>{ui(`lang.${l}`)[l]}</strong>
                  <span lang="th" className="muted">
                    {ui(`lang.${l}`).th}
                  </span>
                </button>
              ))}
            </div>
            <Tri k="setup.langText" />
          </>
        )}
        {steps[step] === 'install' && (
          <>
            <Tri k="setup.installTitle" as="h1" />
            {isStandalone() ? <Tri k="setup.installed" /> : <Tri k={isIos() ? 'setup.installIos' : 'setup.installAndroid'} />}
          </>
        )}
        {steps[step] === 'voices' && (
          <>
            <Tri k="setup.voicesTitle" as="h1" />
            <Tri k="setup.voicesText" />
            <VoiceStatus />
          </>
        )}
        <div className="setup-actions">
          {step > 0 && (
            <button type="button" className="btn" onClick={() => setStep(step - 1)}>
              <span lang="th">{ui('common.back').th}</span> · {ui('common.back').en}
            </button>
          )}
          <button type="button" className="btn btn--primary" onClick={next}>
            <span lang="th">{ui(last ? 'setup.finish' : 'common.next').th}</span> · {ui(last ? 'setup.finish' : 'common.next').en}
          </button>
        </div>
        <div className="dots" aria-hidden>
          {steps.map((s, i) => (
            <span key={s} className={i === step ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </div>
  );
}
