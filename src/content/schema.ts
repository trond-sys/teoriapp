// Zod-skjema for alt innhold. Eneste sannhetskilde for innholdstyper (PLAN-fase0 §3.1).
import { z } from 'zod';
import { TEMALISTE_IDS } from '../config/temaliste';

const text = z.string().trim().min(1, 'tom tekst');

/** Tekst på alle tre språk. Mangler ett språk, feiler valideringen. */
export const L3 = z.strictObject({ nb: text, en: text, th: text });
export type L3 = z.infer<typeof L3>;

export const TemaRef = z.enum(TEMALISTE_IDS);
export const Trinn = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);
export const ThReview = z.enum(['pending', 'ok', 'flagged']);

/** Felles for alt innhold som lærer bort en regel. */
const metaShape = {
  /** Konkret hjemmel: «Trafikkreglene § 7 nr. 2» eller vegvesen.no-lenke. */
  source: z.string().trim().min(3, 'mangler source'),
  sourceUrl: z.url().optional(),
  /** Kontrollert av Trond. */
  verified: z.boolean(),
  thReview: ThReview,
  /** Hva som er usikkert, når verified er false av en grunn. */
  todo: z.string().optional(),
};

export const Option = z.strictObject({
  id: z.string().regex(/^[a-d]$/),
  text: L3,
  /** Hvorfor dette svaret er feil (for de vanligste feilsvarene). */
  whyWrong: L3.optional(),
});

export type Option = z.infer<typeof Option>;

export const Media = z.strictObject({
  /** ID til en vikeplikt-scene i scenes/. Vises som bilde. */
  scene: z.string().optional(),
  /** Skiltnummer i signs.json. */
  sign: z.string().optional(),
});

export const Question = z
  .strictObject({
    id: z.string().regex(/^[a-z0-9-]+-\d{3}$/, 'ID må ende på -NNN'),
    topic: z.string().min(1),
    temalisteRef: TemaRef,
    alsoRefs: z.array(TemaRef).default([]),
    trinn: Trinn,
    type: z.enum(['mc-single', 'mc-image', 'true-false']),
    difficulty: z.number().int().min(1).max(3),
    examEligible: z.boolean().default(true),
    media: Media.optional(),
    prompt: L3,
    options: z.array(Option).min(2).max(4),
    correct: z.string(),
    explanation: L3,
    /** «I Thailand … – i Norge …» på punktene merket TH!. */
    thaiContrast: L3.optional(),
    /** Norske ord fra vegen. Vises alltid på norsk. */
    roadTextNb: z.array(z.string()).default([]),
    glossaryTerms: z.array(z.string()).default([]),
    ...metaShape,
  })
  .refine((q) => q.options.some((o) => o.id === q.correct), { message: 'ugyldig fasit', path: ['correct'] })
  .refine((q) => new Set(q.options.map((o) => o.id)).size === q.options.length, {
    message: 'to svaralternativer har samme id',
    path: ['options'],
  })
  .refine((q) => q.type !== 'mc-image' || !!(q.media?.scene || q.media?.sign), {
    message: 'mc-image må ha media.scene eller media.sign',
    path: ['media'],
  });
export type Question = z.infer<typeof Question>;

export const SignGroup = z.enum([
  'fareskilt',
  'vikepliktskilt',
  'forbudsskilt',
  'pabudsskilt',
  'opplysningsskilt',
  'serviceskilt',
  'underskilt',
  'vegoppmerking',
]);
export type SignGroup = z.infer<typeof SignGroup>;

export const Sign = z.strictObject({
  /** Skiltnummer etter skiltforskriften, f.eks. «202». */
  nr: z.string().regex(/^\d{3}(\.\d+)?$/),
  group: SignGroup,
  name: L3,
  /** Hva skiltet betyr for deg som fører. */
  meaning: L3,
  /** Fil i public/signs/. */
  file: z.string().regex(/^[\w.-]+\.(svg|png)$/),
  credit: z.strictObject({
    page: z.url(),
    /** Zip-filen hos Statens vegvesen som skiltet hentes fra (brukes av npm run import-signs). */
    original: z.url(),
    /** Variant i zip-filen, f.eks. «H» for 516_H.jpg. Standard er «0». */
    variant: z.string().optional(),
    author: z.string().min(1),
    license: z.string().min(1),
  }),
  glossaryTerms: z.array(z.string()).default([]),
  ...metaShape,
});
export type Sign = z.infer<typeof Sign>;

export const GlossaryTerm = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nb: text,
  en: text,
  th: text,
  def: L3,
  /** Står på skilt eller oppmerking ute i trafikken. */
  onRoad: z.boolean().default(false),
  source: z.string().optional(),
  verified: z.boolean(),
  thReview: ThReview,
});
export type GlossaryTerm = z.infer<typeof GlossaryTerm>;

// ---------- Vikeplikt-scener ----------

export const Dir = z.enum(['N', 'E', 'S', 'W']);
export type Dir = z.infer<typeof Dir>;

/**
 * Hva som gjelder for trafikk som kommer inn i krysset fra denne armen.
 * none = ingen skilt (høyreregelen), priority = forkjørsveg, yield = vikepliktskilt (202),
 * stop = stoppskilt (204), exit = avkjørsel / parkeringsplass / gårdsveg (avkjørselsregelen).
 */
export const ArmControl = z.enum(['none', 'priority', 'yield', 'stop', 'exit']);
export type ArmControl = z.infer<typeof ArmControl>;

export const Arm = z.strictObject({
  control: ArmControl,
  /** Gangfelt over denne armen, like ved krysset. */
  crosswalk: z.boolean().default(false),
  /** Trikkespor i denne armen. */
  tram: z.boolean().default(false),
});
export type Arm = z.infer<typeof Arm>;

export const ActorKind = z.enum(['car', 'bus', 'truck', 'bicycle', 'tram', 'emergency', 'pedestrian']);
export type ActorKind = z.infer<typeof ActorKind>;

export const ActorColor = z.enum(['red', 'blue', 'yellow', 'green', 'white', 'black', 'orange']);

export const Actor = z.strictObject({
  /** Kort etikett som vises på kjøretøyet: A, B, C … */
  id: z.string().regex(/^[A-Z]$/),
  kind: ActorKind,
  color: ActorColor.default('blue'),
  /** Armen kjøretøyet kommer fra. For gående: armen der gangfeltet er. */
  from: Dir,
  /** Armen kjøretøyet skal ut av. Ikke for gående. */
  to: Dir.optional(),
  /** Utrykningskjøretøy med blått blinklys (og sirene). */
  siren: z.boolean().default(false),
  /** Rundkjøring: kjøretøyet er allerede inne i rundkjøringen ved armen `from`. */
  circulating: z.boolean().default(false),
});
export type Actor = z.infer<typeof Actor>;

export const Junction = z.strictObject({
  kind: z.enum(['cross', 't', 'roundabout']),
  arms: z.partialRecord(Dir, Arm),
});
export type Junction = z.infer<typeof Junction>;

export const YieldScene = z.strictObject({
  id: z.string().regex(/^scene-[a-z0-9-]+-\d{2}$/),
  topic: z.string().min(1),
  temalisteRef: TemaRef,
  alsoRefs: z.array(TemaRef).default([]),
  trinn: Trinn,
  difficulty: z.number().int().min(1).max(3),
  junction: Junction,
  actors: z.array(Actor).min(1).max(5),
  prompt: L3,
  explanation: L3,
  thaiContrast: L3.optional(),
  /** Håndskrevet fasit i grupper; de i samme gruppe kan kjøre samtidig. Kryssjekkes mot motoren. */
  expectedOrder: z.array(z.array(z.string()).min(1)).min(1),
  roadTextNb: z.array(z.string()).default([]),
  glossaryTerms: z.array(z.string()).default([]),
  ...metaShape,
});
export type YieldScene = z.infer<typeof YieldScene>;

// ---------- UI-tekst ----------
export const UiStrings = z.record(z.string(), L3);
export type UiStrings = z.infer<typeof UiStrings>;
