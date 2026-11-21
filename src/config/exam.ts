// Fakta om teoriprøven klasse B. Oppdateres når reglene endres.
// Kilde: vegvesen.no, kontrollert november 2026 (se docs/PROMPT.md §2).

export const EXAM = {
  questions: 45,
  minutes: 90,
  passMin: 38,
  /** Språk prøven tilbys på for klasse B. Appen støtter nb og en. */
  officialLanguages: ['nb', 'nn', 'se', 'en', 'ar', 'ckb', 'tr'],
  appExamLanguages: ['en', 'nb'] as const,
  waitAfterFailDays: 14,
  drivingTestWithinYears: 3,
  source: 'https://www.vegvesen.no/en/driving-licences/driver-training/theory-test/taking-the-theory-test/',
  checked: '2026-11-21',
} as const;

export type ExamLang = (typeof EXAM.appExamLanguages)[number];
