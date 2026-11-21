// Terskler for mestring, nedtrapping av thai og (fra Fase 2) trafikklyset for eksamensklarhet.

export const READINESS = {
  /** Mestring per tema regnes av de siste N forsøkene per oppgave. */
  lastAttemptsPerItem: 3,
  /** Farger i temalisten. */
  topicGreen: 0.85,
  topicYellow: 0.6,
  /** Foreslå «Prøv uten thai» når mestring uten thai er minst dette over de siste forsøkene. */
  suggestNoThai: { minShare: 0.8, lastAttempts: 30 },
  /** Fase 2: grønt lys. */
  green: { lastExams: 3, minScore: 40, allTopicsMin: 0.85, signsMin: 0.95 },
} as const;

export const SESSION = {
  /** «Dagens økt»: omtrent 10–15 minutter. */
  targetItems: 15,
  maxNew: 6,
  interactivePerSession: 1,
} as const;
