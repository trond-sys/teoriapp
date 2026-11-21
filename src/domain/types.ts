// Felles typer for progresjon. Lagres i Dexie (src/db/db.ts).

export type ItemKind = 'question' | 'sign' | 'scene' | 'glossary';
export type Mode = 'today' | 'practice' | 'exam';
export type Scaffold = 'forsta' | 'bro' | 'eksamen';
export type Lang = 'nb' | 'en' | 'th';

/** Ett svar. Legges bare til (append-only) og har uuid, så synk/import aldri gir konflikt. */
export interface Attempt {
  id: string;
  itemId: string;
  kind: ItemKind;
  temalisteRef: string;
  correct: boolean;
  /** Tid brukt i millisekunder. */
  ms: number;
  /** Thai ble vist eller brukt før svaret. */
  thaiUsed: boolean;
  scaffoldAtTime: Scaffold;
  /** Hovedspråket oppgaven ble vist på. */
  lang: Lang;
  mode: Mode;
  /** Tidspunkt (ms siden epoch). */
  at: number;
}

export interface SrsState {
  itemId: string;
  ease: number;
  /** Dager. */
  interval: number;
  reps: number;
  lapses: number;
  /** Tidspunkt (ms) når kortet forfaller. */
  due: number;
  lastAt: number;
}

/** Et element som kan øves: oppgave, skilt eller scene. */
export interface PoolItem {
  itemId: string;
  kind: ItemKind;
  temalisteRef: string;
  /** Interaktiv oppgave (vikeplikt-krysset). */
  interactive?: boolean;
  /** Ekstra vekt (særnorsk / ofte feilet). */
  weight?: number;
}
