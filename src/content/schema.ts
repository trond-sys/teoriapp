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

// ---------- Tegnemodell for kryss ----------
// Brukes av SceneView (via src/scene/fromScenario.ts) og av den gamle motoren til den flyttes til scripts/ (Endring 01, steg 5).

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
  /** Utseende for avkjørsel (control: exit): parkeringsplass (standard) eller gårdsveg. */
  look: z.enum(['parkering', 'gardsveg']).optional(),
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

// ---------- Håndlagde scenarier (Endring 01) ----------
// Fasiten er data, ikke beregning. Hver scene lagres med fasit og hjemmel per steg, kontrollert av et menneske.
// Koden sjekker bare at scenen henger sammen (src/domain/scenes/validate.ts). Se docs/endringer/ENDRING-01-handlagde-scenarier.md.

export const ScenarioKind = z.enum(['bil', 'buss', 'lastebil', 'trikk', 'utrykning', 'gaende', 'syklist']);
export type ScenarioKind = z.infer<typeof ScenarioKind>;

/** Hvor trafikanten skal. Tegnes som en pil, ikke som en kjørebane (prinsipp 4). «krysser» er for gående. */
export const Intent = z.enum(['rett-fram', 'hoyre', 'venstre', 'krysser']);
export type Intent = z.infer<typeof Intent>;

/** Posisjoner angis på trafikanten, ikke ved at koden tolker kartet. */
export const ActorPosition = z.enum(['fra-parkering', 'fra-gardsveg', 'fra-sykkelveg', 'inne-i-rundkjoring', 'pa-holdeplass']);
export type ActorPosition = z.infer<typeof ActorPosition>;

export const LightState = z.enum(['rod', 'gul', 'rod-gul', 'gronn', 'gronn-pil-venstre', 'gronn-pil-hoyre', 'gul-blink', 'av']);

/** Undertemaene i kjernekatalogen (Endring 01 §6). Brukes til å telle dekning. */
export const ScenarioSubtopic = z.enum([
  'hoyreregel',
  'avkjorsel',
  'fra-sykkelveg',
  'bussholdeplass',
  'skilt',
  'lysregulering',
  'politi',
  'venstresving',
  'svinging-gaende',
  'rygging-vending',
  'fri-veg',
  'rundkjoring',
]);
export type ScenarioSubtopic = z.infer<typeof ScenarioSubtopic>;

const actorId = z.string().regex(/^[A-Z]$/, 'trafikant-ID må være én stor bokstav');

export const ScenarioActor = z.strictObject({
  id: actorId,
  kind: ScenarioKind,
  /** Armen trafikanten kommer fra. For gående: armen der hen krysser. */
  from: Dir,
  intent: Intent,
  position: ActorPosition.optional(),
  /** Utrykning med blinkende blått lys. */
  bluelight: z.boolean().default(false),
  color: ActorColor.default('blue'),
});
export type ScenarioActor = z.infer<typeof ScenarioActor>;

export const ScenarioLayout = z.strictObject({
  type: z.enum(['x-kryss', 't-kryss', 'rundkjoring']),
  arms: z.array(Dir).min(3).max(4),
  /** Skilt som står på en arm og gjelder trafikk som kommer derfra. */
  signs: z.array(z.strictObject({ arm: Dir, nr: z.string() })).default([]),
  /** Gangfelt over armen, like ved krysset. */
  crosswalks: z.array(Dir).default([]),
  /** Trikkespor i armen. */
  tram: z.array(Dir).default([]),
  /** Trafikklys per arm, eller null når krysset ikke er lysregulert. */
  lights: z.partialRecord(Dir, LightState).nullable().default(null),
  police: z.strictObject({ gesture: z.enum(['arm-opp', 'arm-ut']), facing: Dir }).nullable().default(null),
});
export type ScenarioLayout = z.infer<typeof ScenarioLayout>;

export const StepSource = z.strictObject({
  /** Hjemmel: «Trafikkreglene § 7 nr. 2» eller en side på vegvesen.no. */
  ref: z.string().trim().min(3, 'mangler source.ref'),
  /** Kort, ordrett sitat fra hjemmelen. */
  quote: z.string().trim().min(10, 'mangler source.quote'),
  url: z.url().optional(),
});

export const ScenarioStep = z.strictObject({
  who: actorId,
  /** Hvem `who` har vikeplikt for. Tom liste når steget forklarer at ingen viker. */
  yieldsTo: z.array(actorId),
  explanation: L3,
  source: StepSource,
});
export type ScenarioStep = z.infer<typeof ScenarioStep>;

export const ScenarioQuestion = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('rekkefolge'), prompt: L3 }),
  z.strictObject({ type: z.literal('ja-nei'), prompt: L3 }),
  z.strictObject({ type: z.literal('velg'), prompt: L3, options: z.array(Option).min(2).max(4) }),
]);

export const ScenarioAnswer = z.strictObject({
  /** Grupper i rekkefølge. Trafikanter i samme gruppe kan kjøre samtidig. */
  order: z.array(z.array(actorId).min(1)).min(1).optional(),
  steps: z.array(ScenarioStep).min(1),
  /** Fasit for «ja-nei». */
  yes: z.boolean().optional(),
  /** Fasit for «velg» (id til et alternativ). */
  correct: z.string().optional(),
});

export const Scenario = z.strictObject({
  id: z.string().regex(/^vp-scene-[a-z0-9-]+-\d{2}$/, 'ID må ha formen vp-scene-<navn>-NN'),
  topic: z.string().min(1),
  subtopic: ScenarioSubtopic,
  /** Påkrevd for kjernescener (sjekkes i validatoren). */
  temalisteRef: TemaRef.optional(),
  alsoRefs: z.array(TemaRef).default([]),
  /** kjerne = prøverelevant og i temalisten. dybde = kanttilfelle, teller ikke mot klarhet og er ikke med i prøveeksamen. */
  tier: z.enum(['kjerne', 'dybde']),
  difficulty: z.number().int().min(1).max(3),
  layout: ScenarioLayout,
  actors: z.array(ScenarioActor).min(1).max(6),
  question: ScenarioQuestion,
  answer: ScenarioAnswer,
  thaiContrast: L3.optional(),
  roadTextNb: z.array(z.string()).default([]),
  glossaryTerms: z.array(z.string()).default([]),
  verified: z.boolean(),
  verifiedBy: z.string().nullable().default(null),
  verifiedAt: z.string().nullable().default(null),
  thReview: ThReview,
  todo: z.string().optional(),
});
export type Scenario = z.infer<typeof Scenario>;

// ---------- UI-tekst ----------
export const UiStrings = z.record(z.string(), L3);
export type UiStrings = z.infer<typeof UiStrings>;
