import raw from '../content/ui/strings.json';
import type { L3 } from '../content/schema';

export type UiKey = keyof typeof raw;
export const UI: Record<UiKey, L3> = raw;

/** Bytter ut {a}, {b} … i en tekst. */
export function fmt(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Formaterer alle tre språk i en L3. */
export function fmtL3(t: L3, vars?: Record<string, string | number>): L3 {
  return { nb: fmt(t.nb, vars), en: fmt(t.en, vars), th: fmt(t.th, vars) };
}

export function ui(key: UiKey, vars?: Record<string, string | number>): L3 {
  return fmtL3(UI[key], vars);
}
