// <T>: viser innholdstekst etter stillasnivå, med riktig lang=, thai på trykk, opplesning og rapportknapp.
import { Fragment, useState, type ReactNode } from 'react';
import type { L3 } from '../content/schema';
import { TERM_BY_ID } from '../content/index';
import type { Lang } from '../domain/types';
import { useGlossarySheet } from '../components/GlossarySheet';
import { Icon } from '../components/Icon';
import { ReportThai, type ReportTarget } from '../components/ReportThai';
import { useSettings, useThaiScope } from './LangProvider';
import { speak, useVoices } from './tts';
import { ui, type UiKey } from './strings';

type Tag = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'li' | 'strong';

/** Hvilke språk som vises, og i hvilken rekkefølge. */
export function useLayers(): { main: Lang; under: Lang[]; thaiOnTap: boolean } {
  const { settings } = useSettings();
  const ex = settings.examLang;
  if (settings.scaffold === 'forsta') return { main: 'th', under: ex === 'en' ? ['en', 'nb'] : ['nb'], thaiOnTap: false };
  if (settings.scaffold === 'eksamen') return { main: ex, under: [], thaiOnTap: false };
  return { main: ex, under: [], thaiOnTap: true };
}

export function SpeakButton({ text, lang, small }: { text: string; lang: Lang; small?: boolean }) {
  const voices = useVoices();
  const { settings } = useSettings();
  const v = voices[lang];
  if (!v) return null;
  return (
    <button
      type="button"
      className={`icon-btn${small ? ' icon-btn--small' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang, settings.ttsRate, v);
      }}
      aria-label={ui('speak.play')[lang === 'th' ? 'th' : settings.examLang]}
      title={ui('speak.play')[settings.examLang]}
    >
      <Icon name="speaker" size={small ? 18 : 22} />
    </button>
  );
}

/** Markerer fagord i teksten. Trykk åpner ordlisten uten å forlate oppgaven. */
function withTerms(s: string, lang: Lang, terms: string[] | undefined, open: (id: string) => void): ReactNode {
  if (!terms?.length) return s;
  const hits: { start: number; end: number; id: string }[] = [];
  const lower = s.toLocaleLowerCase();
  for (const id of terms) {
    const term = TERM_BY_ID.get(id);
    if (!term) continue;
    const word = term[lang].toLocaleLowerCase();
    const i = lower.indexOf(word);
    if (i >= 0 && !hits.some((h) => i < h.end && i + word.length > h.start)) hits.push({ start: i, end: i + word.length, id });
  }
  if (!hits.length) return s;
  hits.sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let pos = 0;
  for (const h of hits) {
    out.push(s.slice(pos, h.start));
    out.push(
      <button key={h.id + h.start} type="button" className="term" onClick={(e) => (e.stopPropagation(), open(h.id))}>
        {s.slice(h.start, h.end)}
      </button>,
    );
    pos = h.end;
  }
  out.push(s.slice(pos));
  return out.map((x, i) => <Fragment key={i}>{x}</Fragment>);
}

interface TProps {
  text: L3;
  as?: Tag;
  className?: string;
  /** Vis lydknapp (standard: ja). */
  speakable?: boolean;
  /** Ordliste-ID-er som skal markeres i teksten. */
  terms?: string[];
  /** Hvor teksten kommer fra, for «Rapporter oversettelse». */
  report?: ReportTarget;
}

/** Tekstblokk med verktøy. Bruk ikke inne i en <button> – bruk <TLine> der. */
export function T({ text, as = 'p', className, speakable = true, terms, report }: TProps) {
  const { main, under, thaiOnTap } = useLayers();
  const scope = useThaiScope();
  const sheet = useGlossarySheet();
  const [open, setOpen] = useState(false);
  const showThai = thaiOnTap && (open || scope.revealAll);
  const Tag = as;
  return (
    <div className={`t ${className ?? ''}`}>
      <div className="t-row">
        <Tag lang={main} className="t-main">
          {withTerms(text[main], main, terms, sheet.open)}
        </Tag>
        <span className="t-tools">
          {speakable && <SpeakButton text={text[main]} lang={main} />}
          {main === 'th' && report && <ReportThai target={report} current={text.th} />}
          {thaiOnTap && (
            <button
              type="button"
              className={`thai-btn${showThai ? ' is-on' : ''}`}
              aria-pressed={showThai}
              aria-label={ui('thai.showLabel').en}
              onClick={() => {
                if (!open) scope.markUsed();
                setOpen(!open);
              }}
            >
              <span lang="th">{ui('thai.show').th}</span>
            </button>
          )}
        </span>
      </div>
      {showThai && (
        <div className="t-row t-sub t-th">
          <span lang="th">{withTerms(text.th, 'th', terms, sheet.open)}</span>
          <span className="t-tools">
            {speakable && <SpeakButton text={text.th} lang="th" small />}
            {report && <ReportThai target={report} current={text.th} />}
          </span>
        </div>
      )}
      {under.map((l) => (
        <div key={l} className={`t-row t-sub${l === 'nb' && under.length > 1 ? ' t-sub--muted' : ''}`}>
          <span lang={l}>{withTerms(text[l], l, terms, sheet.open)}</span>
          {speakable && <SpeakButton text={text[l]} lang={l} small />}
        </div>
      ))}
    </div>
  );
}

/** Kort tekst uten verktøy (for knapper og etiketter). Thai vises under når hele oppgaven er oversatt. */
export function TLine({ text, className }: { text: L3; className?: string }) {
  const { main, under, thaiOnTap } = useLayers();
  const scope = useThaiScope();
  return (
    <span className={`tline ${className ?? ''}`}>
      <span lang={main}>{text[main]}</span>
      {thaiOnTap && scope.revealAll && (
        <span className="tline-sub" lang="th">
          {text.th}
        </span>
      )}
      {under.slice(0, 1).map((l) => (
        <span key={l} className="tline-sub" lang={l}>
          {text[l]}
        </span>
      ))}
    </span>
  );
}

/** UI-tekst (meny, knapper). Hovedspråket, og i «Forstå» med prøvespråket under. */
export function U({ k, vars, sub = false }: { k: UiKey; vars?: Record<string, string | number>; sub?: boolean }) {
  const { main, under } = useLayers();
  const t = ui(k, vars);
  return (
    <>
      <span lang={main}>{t[main]}</span>
      {sub && under[0] && (
        <span className="tline-sub" lang={under[0]}>
          {t[under[0]]}
        </span>
      )}
    </>
  );
}

/** UI-tekst som ren streng i hovedspråket (til aria-label, title, placeholder). */
export function useUi() {
  const { main } = useLayers();
  return (k: UiKey, vars?: Record<string, string | number>) => ui(k, vars)[main];
}

/** Knapp som slår thai av og på for hele oppgaven (bare på nivå «Bro»). */
export function TranslateAllButton() {
  const { thaiOnTap } = useLayers();
  const scope = useThaiScope();
  if (!thaiOnTap) return null;
  return (
    <button type="button" className={`btn btn--quiet thai-all${scope.revealAll ? ' is-on' : ''}`} onClick={() => scope.setRevealAll(!scope.revealAll)}>
      <span lang="th">แปล</span> · <U k={scope.revealAll ? 'thai.hideAll' : 'thai.translateAll'} />
    </button>
  );
}
