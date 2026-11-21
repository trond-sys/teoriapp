import type { Lang } from '../../domain/types';
import { useSettings } from '../../i18n/LangProvider';
import { ui } from '../../i18n/strings';
import { U } from '../../i18n/T';
import { speak, ttsSupported, useVoices } from '../../i18n/tts';
import { Icon } from '../../components/Icon';

const SAMPLE: Record<Lang, string> = {
  nb: 'Vikeplikt. Se til høyre før du kjører inn i krysset.',
  en: 'Give way. Look to the right before you enter the junction.',
  th: 'ให้ทาง มองขวาก่อนเข้าทางแยก',
};

export function VoiceStatus() {
  const voices = useVoices();
  const { settings } = useSettings();
  if (!ttsSupported())
    return (
      <p className="muted">
        <U k="settings.noTts" />
      </p>
    );
  return (
    <div className="voice-list">
      {(['th', 'en', 'nb'] as Lang[]).map((l) => {
        const v = voices[l];
        return (
          <div key={l} className="voice-row">
            <span className="voice-lang">
              <U k={`lang.${l}` as 'lang.nb'} />
            </span>
            <span className={`pill ${v ? 'pill--ok' : 'pill--bad'}`}>
              <U k={v ? 'settings.voiceOk' : 'settings.voiceMissing'} />
            </span>
            <span className="muted small voice-name">{v ? `${v.name} (${v.lang})` : ''}</span>
            {v && (
              <button type="button" className="btn btn--small" onClick={() => speak(SAMPLE[l], l, settings.ttsRate, v)}>
                <Icon name="speaker" size={18} /> {ui('settings.voiceTest')[settings.examLang]}
              </button>
            )}
          </div>
        );
      })}
      {!voices.th && (
        <div className="note">
          <p lang="th">{ui('settings.voiceHelp').th}</p>
          <p lang={settings.examLang} className="muted small">
            {ui('settings.voiceHelp')[settings.examLang]}
          </p>
        </div>
      )}
    </div>
  );
}
