// Innstillinger for språk og stillas + «thai-scope» som sporer om thai ble brukt i en oppgave.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { db } from '../db/db';
import type { Lang, Scaffold } from '../domain/types';
import type { ExamLang } from '../config/exam';

export interface Settings {
  scaffold: Scaffold;
  examLang: ExamLang;
  ttsRate: number;
  onboarded: boolean;
  /** Prøveeksamen (Fase 2): thai av som standard. */
  examThaiAllowed: boolean;
  /** Lys eller mørk modus. «auto» følger nettbrettets innstilling. */
  theme: 'auto' | 'light' | 'dark';
}

export const DEFAULT_SETTINGS: Settings = {
  scaffold: 'bro',
  examLang: 'en',
  ttsRate: 1,
  onboarded: false,
  examThaiAllowed: false,
  theme: 'auto',
};

interface SettingsCtx {
  settings: Settings;
  ready: boolean;
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  /** Hovedspråket for tekst akkurat nå. */
  mainLang: Lang;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    db.settings
      .toArray()
      .then((rows) => {
        if (!alive) return;
        const loaded = { ...DEFAULT_SETTINGS };
        for (const r of rows) if (r.key in loaded) (loaded as Record<string, unknown>)[r.key] = r.value;
        setSettings(loaded);
      })
      .catch((e) => console.error('Kunne ikke lese innstillinger', e))
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const set = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    db.settings.put({ key, value }).catch((e) => console.error('Kunne ikke lagre innstilling', e));
  }, []);

  useEffect(() => {
    document.documentElement.lang = settings.scaffold === 'forsta' ? 'th' : settings.examLang;
  }, [settings.scaffold, settings.examLang]);

  useEffect(() => {
    // Fargene ligger i tokens.css. Uten data-theme følger appen nettbrettets lys/mørk-innstilling.
    const el = document.documentElement;
    if (settings.theme === 'auto') el.removeAttribute('data-theme');
    else el.dataset.theme = settings.theme;
  }, [settings.theme]);

  const value = useMemo<SettingsCtx>(
    () => ({ settings, ready, set, mainLang: settings.scaffold === 'forsta' ? 'th' : settings.examLang }),
    [settings, ready, set],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSettings utenfor LangProvider');
  return c;
}

// ---------- Thai-scope ----------
// En oppgave pakkes i <ThaiScope>. Viser eleven thai i oppgaven, regnes den som løst med thai.

interface ThaiScopeCtx {
  revealAll: boolean;
  setRevealAll: (v: boolean) => void;
  markUsed: () => void;
  /** Leses når svaret lagres. */
  usedRef: { current: boolean };
}

const ScopeCtx = createContext<ThaiScopeCtx | null>(null);

export function ThaiScope({ children, scopeKey }: { children: ReactNode; scopeKey: string }) {
  const [revealAll, setRevealAllState] = useState(false);
  const usedRef = useRef(false);
  // Ny oppgave: thai skjules igjen, og bruken nullstilles.
  useEffect(() => {
    setRevealAllState(false);
    usedRef.current = false;
  }, [scopeKey]);
  const markUsed = useCallback(() => {
    usedRef.current = true;
  }, []);
  const setRevealAll = useCallback((v: boolean) => {
    if (v) usedRef.current = true;
    setRevealAllState(v);
  }, []);
  const value = useMemo(() => ({ revealAll, setRevealAll, markUsed, usedRef }), [revealAll, setRevealAll, markUsed]);
  return <ScopeCtx.Provider value={value}>{children}</ScopeCtx.Provider>;
}

const NO_SCOPE: ThaiScopeCtx = { revealAll: false, setRevealAll: () => {}, markUsed: () => {}, usedRef: { current: false } };

export function useThaiScope(): ThaiScopeCtx {
  return useContext(ScopeCtx) ?? NO_SCOPE;
}
