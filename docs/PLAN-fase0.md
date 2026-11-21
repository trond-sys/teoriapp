# Fase 0 – Plan for teoriappen (NO / EN / TH)

**Status:** Godkjent av Trond 21.11.2026. Svarene hans står i §8a. Ingen appkode er skrevet.
**Grunnlag:** `docs/PROMPT.md` og `docs/temaliste/` (temalisten fra august 2020, lastet ned 21.11.2026).

**Kort om eleven og målet:** Hun er thailandsk, og engelsk er hennes sterkeste prøvespråk. Hun har thailandsk førerkort med venstrekjøring. Teoriprøven kan ikke tas på thai, så thai er et stillas som skal trappes ned, og eleven skal bestå på engelsk eller norsk.

---

## 1. Temakart (temalisten fra august 2020, begge sider)

**Kilde:** `docs/temaliste/…English.pdf`. Side 1 er engelsk og side 2 norsk.

**Regler for ID-ene:**
- `temalisteRef` har formen `<gruppe>-<slug>`. ID-en endres aldri, selv om teksten i temalisten endres.
- Gruppeprefiks:
  - `fp`: Fart og plassering
  - `ft`: Fører og andre trafikanter
  - `fa`: Fører og eiers ansvar (formelle forhold)
  - `kj`: Kjøretøyet
  - `lr`: Lover og regler
  - `so`: Skilt og oppmerking
  - `vp`: Vikeplikt

**Totalt er det 41 punkter.** 40 finnes på begge listene. `lr-forbud-offentlig-veg` står bare på den norske listen.

**Tre ting som avviker:**
- Den engelske PDF-en deler «Driver / Assistance Systems» over to linjer. Dette er ett punkt, `kj-forerstotte`.
- Den norske listen sier «Øvelseskjøring», og den engelske sier «Driving practice with an accompanying driver». Det er samme punkt.
- «Signal og tegn» heter «Signals and indicators» på engelsk. Det betyr både blinklys og tegn fra andre trafikanter.

**Trinn (T1–T4)** er læreplanens fire trinn:
- T1: Trafikalt grunnkurs
- T2: Grunnleggende kjøretøy- og kjørekompetanse
- T3: Trafikal del
- T4: Avsluttende opplæring

Koblingen til trinn er et **forslag**. Den må kontrolleres mot læreplanen før den låses.

**Kolonnen ★** viser særnorske temaer eller temaer som ofte feiles (§4.3). De får ekstra vekt. **TH!** betyr at reglene er motsatt av eller annerledes enn i Thailand. Disse punktene skal ha egne forklaringer av typen «I Thailand … – i Norge …».

**MVP / Totalt** er det foreslåtte antallet oppgaver: rundt 120 i Fase 1 og 350 eller flere i Fase 2. Skiltkort og vikeplikt-scener kommer i tillegg (se 1.2).

### Fart og plassering (`fp`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| fp-avstand | Avstand til forankjørende | Distance to vehicle in front | T3 | | 3 | 8 |
| fp-feltvalg | Feltvalg. Kollektivfelt. Rundkjøring. Envegskjøring | Choice of lane. Public transport lane. Roundabout. One-way traffic | T3 | ★ kollektivfelt, TH! rundkjøring | 6 | 18 |
| fp-forbikjoring | Forbikjøring | Overtaking | T3/T4 | ★, TH! | 5 | 15 |
| fp-hest | Hest i trafikken | Horse on the road | T3 | | 1 | 4 |
| fp-planovergang | Planovergang | Level crossing | T3 | | 2 | 6 |
| fp-signal | Signal og tegn | Signals and indicators | T2/T3 | | 2 | 6 |
| fp-sikkerhetssoner | Sikkerhetssoner. Blindsoner | Safety zones. Blind spots | T2/T3 | ★ sykkel | 2 | 7 |
| fp-sikt-lys | Siktforhold. Vær. Mørke. Bruk av lys | Visibility. Weather. Darkness. Use of lights | T1 (mørkekjøring)/T4 | ★ lysbruk, vilt | 5 | 15 |
| fp-stopplengde | Stopplengde. Bremselengde. Reaksjonslengde | Stopping/Braking/Reaction distance | T1/T3 | ★ vinter | 4 | 12 |
| fp-veggrep | Vegforhold. Veggrep | Road conditions. Road grip | T4 (glattkjøring) | ★ vinter | 5 | 14 |
| | | | | **Sum** | **35** | **105** |

### Fører og andre trafikanter (`ft`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| ft-samhandling | Forholdet mellom trafikanter | Interaction between road users | T1/T3 | ★ sykkel/gående, smale veger | 5 | 14 |
| ft-begrensninger | Fysiske/psykiske begrensninger | Physical/mental limitations | T1 | | 2 | 6 |
| ft-miljo | Miljøhensyn | Environmental considerations | T1/T4 | | 2 | 6 |
| ft-sanser | Sanser. Reaksjonstid. Uoppmerksomhet | Senses. Reaction time. Inattention | T1 | ★ mobilbruk | 2 | 7 |
| | | | | **Sum** | **11** | **33** |

### Fører og eiers ansvar – formelle forhold (`fa`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| fa-eierforhold | Eierforhold. Registrering. Vognkort. Forsikring | Ownership. Registration. Vehicle Registration Certificate. Insurance | T1 | | 2 | 6 |
| fa-forstehjelp | Førstehjelp | First aid | T1 (obligatorisk) | | 3 | 10 |
| fa-forerrett | Helsekrav. Førerrett. Førerkort. Øvelseskjøring | Health requirements. Driving entitlements. Driving licences. Driving practice | T1 | TH! (utenlandsk førerkort) | 3 | 9 |
| fa-reaksjoner | Offentlige reaksjoner ved overtredelse | Sanctions by authorities against violations | T1 | | 2 | 7 |
| fa-passasjer | Passasjer | Passengers | T1 | | 2 | 6 |
| fa-avhold | Pliktmessig avhold | Compulsory abstinence from alcohol etc. | T1 | ★ rus | 3 | 8 |
| fa-sikt-ruter | Sikt. Isfrie ruter. Snø på tak | Visibility. Ice-free windows. Snow on the roof | T2 | ★ vinter | 3 | 7 |
| fa-trafikkuhell | Trafikkuhell. Sikringsutstyr. Tunnelsikkerhet | Traffic accidents. Safety equipment. Tunnel safety | T1 (obligatorisk) | ★ tunnel | 4 | 12 |
| fa-tretthet-rus | Tretthet. Rus | Fatigue. Intoxication | T1 | ★ | 4 | 12 |
| | | | | **Sum** | **26** | **77** |

### Kjøretøyet (`kj`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| kj-betjening | Betjeningsorganer. Instrumentpanel | Control devices. Dashboard | T2 | | 2 | 6 |
| kj-dekk-bremser-lys | Dekk. Styring. Bremser. Kjetting. Lys | Tyres. Steering. Brakes. Chains. Lights | T2 | ★ vinterdekk, kjetting | 4 | 12 |
| kj-drivstoff-miljo | Drivstoff. Energikilde. Eksos. Miljø | Fuel. Power source. Exhaust. Environment | T2 | | 1 | 5 |
| kj-forerstotte | Førerstøttesystemer | Driver Assistance Systems | T2/T4 | | 1 | 6 |
| kj-sikkerhetskontroll | Sikkerhetskontroll | Safety checks | T2 (og oppkjøring) | | 2 | 8 |
| | | | | **Sum** | **10** | **37** |

### Lover og regler (`lr`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| **lr-forbud-offentlig-veg** | Forbud på offentlig veg *(bare NO)* | *(Prohibitions on public roads – egen oversettelse)* | T1 | | 1 | 5 |
| lr-bruksforskrift | Forskrift om bruk av kjøretøy | Regulations relating to the Use of Vehicles | T1/T2 | | 2 | 6 |
| lr-trafikkregler | Trafikkregler | Traffic Rules | T1/T3 | TH! høyrekjøring | 2 | 8 |
| lr-vtl-3-21 | Vegtrafikkloven § 3 og § 21 | Road Traffic Act §§ 3 and 21 | T1 | | 2 | 6 |
| | | | | **Sum** | **7** | **25** |

**Paragrafene, kontrollert mot Lovdata 21.11.2026.** Dette er sammendrag. Ordlyden må kontrolleres før innholdet låses.
- **Vtl § 3, «Grunnregler for trafikk»:** Alle skal ferdes hensynsfullt, være aktpågivende og varsomme.
- **Vtl § 21, «Alminnelige plikter»:** Ingen skal kjøre når de ikke er skikket til det, for eksempel på grunn av rus, sykdom eller tretthet. Teksten ble lest som sammendrag og er **ikke kontrollert ordrett**.

**Hvordan jeg tolker «Forbud på offentlig veg»:** Jeg tror punktet handler om forbudene i vtl § 7 («Særlige forbud mot trafikk»), § 5 (det er forbudt å skade skilt) og § 23 b (elektronisk utstyr), og om forbudene i trafikkreglene: kjøring på fortau og gangveg (§ 4), rygging og vending på motorveg (§ 11), stans og parkering (§ 17) og unødig tomgang (§ 16). **Dette er en tolkning som Trond må bekrefte** (se spørsmål 4).

### Skilt og oppmerking (`so`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| so-fletting | Fletting | Merging (zipper) | T3 | | 2 | 5 |
| so-skilt | Skilt. Skiltgrupper | Signs. Sign groups | T1/T3 | ★, TH! | 6 | 20 |
| so-oppmerking | Vegoppmerking | Road marking | T3 | TH! (gul/hvit linje) | 4 | 12 |
| | | | | **Sum** | **12** | **37** |

### Vikeplikt (`vp`)
| temalisteRef | NO | EN | Trinn | ★ / TH! | MVP | Tot |
|---|---|---|---|---|---|---|
| vp-hoyreregel | Høyreregel. Ut fra parkering. Bussholdeplass. Skilt | Right-hand rule. Exiting parking area. Bus stop. Signs | T3 | ★★, TH! | 10 | 22 |
| vp-lysregulering | Lysregulering. Politimannens tegn | Traffic lights. Police officer's signals | T3 | | 3 | 8 |
| vp-rygging-vending | Rygging. Vending | Reversing. Turning around | T2/T3 | | 2 | 5 |
| vp-samhandling | Samhandling | Interaction | T3 | ★ møteplass, gangfelt (trafikkreglene § 9) | 2 | 7 |
| vp-stoppeplikt | Stoppeplikt | Obligation to stop | T3 | | 1 | 4 |
| vp-tr-10 | Trafikkreglene § 10 («Fri veg»: utrykning, sporvogn, tog) | Traffic Rules § 10 | T3 | ★ trikk | 3 | 8 |
| | | | | **Sum** | **21** | **54** |

**Sum for alle temaene: 122 oppgaver i MVP og 368 i alt.** De første 20 vikepliktoppgavene er den første batchen som Trond skal kontrollere grundig (§10).

### 1.1 Særnorske temaer (`topic`) og hvordan de kobles til temalisten
`topic` er appens egen faglige gruppering, brukt til leksjoner, interleaving og øvelsesplan. `temalisteRef` er koblingen til dekningskartet. En oppgave har én primær `temalisteRef` og kan ha flere sekundære i `alsoRefs`.

| topic | Primær temalisteRef | Sekundære |
|---|---|---|
| vinter | fp-veggrep | fp-stopplengde, kj-dekk-bremser-lys, fa-sikt-ruter |
| vilt | fp-sikt-lys | ft-sanser, fa-trafikkuhell |
| tunnel | fa-trafikkuhell | fp-sikt-lys, fp-avstand |
| smale-veger | vp-samhandling | ft-samhandling, fp-feltvalg |
| kollektivfelt | fp-feltvalg | so-skilt |
| sykkel-gange | ft-samhandling | vp-samhandling, fp-sikkerhetssoner |
| forbikjoring | fp-forbikjoring | so-oppmerking |
| lys | fp-sikt-lys | kj-dekk-bremser-lys |
| rus-trotthet | fa-tretthet-rus | fa-avhold, lr-vtl-3-21 |
| vikeplikt | vp-* | so-skilt |

Vilt har ikke et eget punkt i temalisten. Derfor kobles vilt til `fp-sikt-lys` som primær. Hvis Trond vil, kan vi gjøre det annerledes.

### 1.2 Innhold utenom oppgavebanken
| Type | MVP (Fase 1) | Totalt |
|---|---|---|
| Skiltkort (flashcards og quiz, med skiltnummer) | ~70 kjerneskilt | ~150 |
| Vikeplikt-scener (dra i rekkefølge) | 12 | 30 |
| Leksjoner (2–5 min) | 1 per temagruppe (7) og 6 for vikeplikt | ~45 |
| Ordliste | ~120 begreper | ~250 |
| Kommandoparlør | – | ~25 (Fase 3) |

---

## 2. Mappestruktur

```
teoriapp/
├─ docs/                    PROMPT.md, PLAN-fase0.md, temaliste/
├─ PROGRESS.md
├─ public/
│  ├─ fonts/                Noto Sans, Noto Sans Thai (woff2, selvhostet)
│  ├─ signs/                <skiltnr>.svg + LICENSES.md
│  └─ icons/                PWA-ikoner
├─ scripts/
│  └─ validate-content.ts   npm run validate-content (tsx)
├─ src/
│  ├─ config/
│  │  ├─ exam.ts            45/90/38, språk, kildelenke og dato
│  │  ├─ readiness.ts       terskler for trafikklyset
│  │  └─ temaliste.ts       de 41 punktene: id, gruppe, nb, en, th, trinn, ★
│  ├─ content/
│  │  ├─ schema.ts          Zod-skjema (eneste sannhetskilde for innholdstyper)
│  │  ├─ questions/<temalisteRef>.json
│  │  ├─ lessons/<id>.json
│  │  ├─ scenes/<id>.json   vikeplikt-scener (JSON-definert)
│  │  ├─ signs.json         skiltmetadata (nr., gruppe, tekst, fil)
│  │  ├─ glossary.json
│  │  ├─ ui/strings.json    all UI-tekst nb/en/th
│  │  └─ index.ts           laster alt via import.meta.glob og validerer i dev
│  ├─ db/
│  │  ├─ db.ts              Dexie-klasse og versjoner
│  │  └─ export.ts          eksport og import av JSON (v1-synk)
│  ├─ domain/               ren TS, ingen React; testes med Vitest
│  │  ├─ srs.ts             forenklet SM-2
│  │  ├─ session.ts         «Dagens økt»-trekk (interleaving)
│  │  ├─ exam.ts            eksamenstrekk og skåring
│  │  ├─ mastery.ts         mestring per tema, med og uten thai
│  │  ├─ readiness.ts       trafikklys
│  │  └─ yield/             vikeplikt-motor: regler → riktig rekkefølge
│  ├─ i18n/
│  │  ├─ LangProvider.tsx   stillasnivå, prøvespråk, thai-avsløring
│  │  ├─ T.tsx              <T text={…}> med riktig lang=, thai-knapp og TTS
│  │  └─ tts.ts             Web Speech: finne stemmer, fallback
│  ├─ components/           UI-byggeklosser
│  ├─ features/             én mappe per modul (skjermer og logikk)
│  │  ├─ home/  today/  quiz/  signs/  yield/  glossary/
│  │  ├─ progress/  settings/  review/        (Fase 1)
│  │  ├─ exam/  sims/                          (Fase 2)
│  │  └─ driving/  safetycheck/  hazard/      (Fase 3)
│  ├─ styles/               tokens.css, layout.css
│  ├─ App.tsx  main.tsx  routes.tsx
│  └─ test/
└─ vite.config.ts           vite-plugin-pwa (precache alt, også JSON og fonter)
```

---

## 3. Datamodell

### 3.1 Innhold (Zod, `src/content/schema.ts`)
```ts
const L3 = z.object({ nb: z.string().min(1), en: z.string().min(1), th: z.string().min(1) });
const TemaRef = z.enum(TEMALISTE_IDS);               // fra config/temaliste.ts
const Meta = z.object({
  source: z.string().min(3),                          // «Trafikkreglene § 7 nr. 2» eller URL
  sourceUrl: z.string().url().optional(),
  verified: z.boolean(),                              // kontrollert av Trond
  thReview: z.enum(['pending','ok','flagged']),
  todo: z.string().optional(),                        // når usikker på regelen
});

const Option = z.object({ id: z.string(), text: L3, whyWrong: L3.optional() });

const Question = Meta.extend({
  id: z.string().regex(/^[a-z0-9-]+-\d{3}$/),
  topic: z.string(), temalisteRef: TemaRef, alsoRefs: z.array(TemaRef).default([]),
  trinn: z.union([z.literal(1),z.literal(2),z.literal(3),z.literal(4)]),
  type: z.enum(['mc-single','mc-image','true-false']),
  difficulty: z.number().int().min(1).max(3),
  examEligible: z.boolean().default(true),           // kan trekkes til prøveeksamen
  media: z.object({ scene: z.string().optional(), sign: z.string().optional(), svg: z.string().optional() }).optional(),
  prompt: L3, options: z.array(Option).min(2).max(4), correct: z.string(),
  explanation: L3, thaiContrast: L3.optional(),       // «I Thailand … – i Norge …»
  roadTextNb: z.array(z.string()).default([]),        // norske ord fra vegen; vises alltid på norsk
  glossaryTerms: z.array(z.string()).default([]),
}).refine(q => q.options.some(o => o.id === q.correct), 'ugyldig fasit');
```
Disse skjemaene bygges på samme måte: `Lesson` (seksjoner, SVG og kontrollspørsmål-ID-er), `Sign` (`nr`, `group`, `name: L3`, `file`, `license`), `GlossaryTerm` (`id`, `nb`, `en`, `th`, `def: L3`) og `YieldScene` (veger, kjøretøy med posisjon og retning, skilt og lys, `expectedOrder: string[][]` der kjøretøy som kan kjøre samtidig grupperes). Scenene bygges på samme motor som Fase 3 bruker til «Finn faren».

`validate-content` feiler hvis:
- et av språkene mangler,
- fasiten er ugyldig,
- `source` eller `temalisteRef` mangler,
- en ID finnes to ganger,
- et ord i `glossaryTerms` ikke finnes i ordlisten,
- en `scene` eller et `sign` ikke finnes.

Til slutt skriver skriptet ut en dekningstabell per `temalisteRef` og hvor mye som er uverifisert.

### 3.2 Dexie (`src/db/db.ts`)
| Tabell | Nøkkel og indekser | Innhold |
|---|---|---|
| `settings` | `key` | scaffold (`forsta` \| `bro` \| `eksamen`), examLang (`en` \| `nb`), ttsRate, examThaiAllowed, dailyGoalMin |
| `attempts` | `id` (uuid), `itemId`, `[temalisteRef+at]`, `at` | itemId, kind (`question` \| `sign` \| `scene` \| `glossary`), correct, ms, **thaiUsed**, scaffoldAtTime, lang, mode (`today` \| `practice` \| `exam`) |
| `srs` | `itemId`, `due` | ease, interval, reps, lapses, due, lastAt (cache som kan **avledes fra attempts**) |
| `exams` | `id`, `at` | itemIds, answers, score, lang, durationMs, thaiUsed |
| `thReports` | `id`, `itemId`, `status` | felt, eksisterende tekst, forslag, kommentar, at |
| `driveLog` | `id`, `date` | Fase 3 |
| `skills` | `id` | Fase 3 |

**Valg som gjør synk enkelt:** `attempts` og `exams` bare legges til (append-only) og har uuid. `srs` og mestring regnes ut fra dem. Da kan import og flettede data aldri komme i konflikt: vi tar unionen av alle forsøk og regner `srs` ut på nytt.

### 3.3 SRS (`src/domain/srs.ts`)
- **Algoritme:** forenklet SM-2.
  - Feil svar: `reps = 0`, `interval = 1 dag`, `ease −0,2` (minst 1,3), og kortet kommer tilbake i samme økt.
  - Riktig svar: intervallene blir 1 → 3 → `interval × ease` dager.
- **Thai påvirker ikke planleggingen** (forfall), bare statistikken, slik at hun får gjentakelse uansett.
- **Mestring per tema** = andel riktige av de siste N forsøkene per oppgave, vektet mot dekning. Den regnes i to varianter: `withThai` og `withoutThai`. Klarhetsindikatoren bruker bare `withoutThai` på prøvespråket.

---

## 4. Komponentstruktur

- **Skall:** `AppShell` har bunnfaner på telefon og sidefelt i liggende format på nettbrett. Fanene er I dag / Øv / Skilt / Ordliste / Fremgang. Innstillinger ligger bak et tannhjul.
- **Språk:**
  - `<T>` viser hovedtekst etter nivå og setter `lang` på elementet.
  - `<ThaiToggle>` er «แปล / Oversett til thai». Den kan vises per tekst og per oppgave, og bruk logges som `thaiUsed`.
  - `<SpeakButton>` skjules når stemme mangler.
  - `<RoadTerm>` viser alltid det norske ordet.
  - `<GlossaryLink>` åpner et ark nederfra uten å forlate oppgaven.
  - `<ReportThai>` er knappen for å rapportere oversettelse.
- **Oppgaver:** `QuestionCard` → `OptionList` → `Feedback` (hvorfor riktig, hvorfor feil, thai-kontrast). `QuestionRunner` styrer en økt, uansett modus.
- **Skilt:** `SignCard`, `SignQuiz` (hva betyr skiltet / finn skiltet) og `SignSort`.
- **Vikeplikt:** `SceneView` (SVG-renderer, felles motor), `YieldBoard` (dra og slipp med pointer events, fungerer med berøring) og `domain/yield` (regelmotor og validering).
- **Fremgang:** `TopicMasteryList` (temalisten med prosent og farge) og `ReadinessLight` (vises fra Fase 2).
- **Redaktør:** `/review`, skjult side med uverifiserte elementer, thai-flagg og dekning.
- **Ruting:** `HashRouter`. Den fungerer på all statisk hosting uten omskrivingsregler.

---

## 5. Stillas og thai

- **Standard:** nivå **Bro** og prøvespråk **engelsk**. Begge kan endres i Innstillinger.
- **Forstå:** thai er hovedtekst, og prøvespråket og norsk står under. Alle forsøk logges som `thaiUsed = true`.
- **Bro:** prøvespråket er hovedtekst. På alle tekstblokker vises et lite «ไทย»-trykk som legger thai under teksten.
  - Fra hun trykker til oppgaven er besvart, regnes oppgaven som `thaiUsed = true`.
  - Thai er alltid skjult når hun kommer til en ny oppgave.
- **Eksamen:** bare prøvespråket. Thai er ikke tilgjengelig. I prøveeksamen er thai av som standard. Det kan slås på i Innstillinger, men da merkes prøven som «med thai» og teller ikke mot klarhet.
- **Språkbytte:** under prøveeksamen kan hun bytte mellom engelsk og norsk når som helst, slik som på den ekte prøven.
- **Forslag om nedtrapping:** når `withoutThai`-mestringen er minst 80 % over de siste 30 forsøkene, foreslår appen «Prøv uten thai» (terskelen ligger i konfig). Appen foreslår bare. Eleven bestemmer.
- **Norske vegord:** ord i `roadTextNb` og skilttekster vises alltid på norsk med oversettelse ved siden av.
- **Kontrast til Thailand:** `thaiContrast` vises i forklaringen på punktene merket TH!.

---

## 6. Enheter og layout

**Hovedmål:** Android-nettbrett med Chrome. Appen installeres som PWA. Vi ber om `navigator.storage.persist()`, som Chrome normalt godtar for installerte apper.

**Risikoer på iPhone (Safari):**
1. **Lagrede data kan bli slettet.** Safari kan slette IndexedDB etter 7 dager uten bruk hvis appen *ikke* er lagt til på hjemskjermen. Tiltak:
   - En egen veiviser «Legg til på Hjem-skjerm» som vises første gang appen åpnes på iOS i Safari, og så lenge appen ikke kjører installert (`display-mode: standalone`).
   - En påminnelse om eksport hver uke.
   - Eksport-knapp på fremgangssiden.
2. **Opplesning.** Web Speech er tilgjengelig, men stemmene varierer. Thai-stemme (th-TH) finnes ofte på iOS, men ikke alltid. På Android må thai-stemmen ofte lastes ned i Google- eller Samsung-TTS. Tiltak:
   - Appen finner stemmene ved oppstart og ved `voiceschanged`.
   - Lydknappen skjules for språk uten stemme.
   - Innstillinger viser hvilke stemmer som finnes, med en hjelpetekst om hvordan thai-stemmen installeres.
   - Opplesning starter bare når eleven trykker på knappen (iOS krever det).
3. **Mindre risikoer.** iOS-PWA-er har ikke push-varsler (vi trenger dem ikke). Lyd i standalone-modus kan stoppe opp. Vi tester tidlig på hennes iPhone.

**Layout:**
- Mobil først, med CSS-breakpoints på omtrent 600 og 900 px og `orientation`.
- Nettbrett i liggende format har to kolonner: oppgaven til venstre og scene eller skilt til høyre. Stående format har én kolonne.
- Trykkflater på minst 48 px. Hovedknappene ligger nederst, slik at de kan nås med én hånd.
- `env(safe-area-inset-*)` for skjermer med hakk og avrundede hjørner.
- Thai får høyere linjehøyde (1,7). Teksten skal kunne vises i 200 % størrelse uten at layouten brekker.
- **Test i Fase 1:** Chrome DevTools-emulering av nettbrett og telefon i begge retninger, og deretter de ekte enhetene.

---

## 7. Hosting og synk

**v1, anbefalt: GitHub Pages med GitHub Actions.**
- Det er gratis, og Trond har allerede GitHub-brukeren `trond-sys`.
- Hver push til `main` bygger og publiserer appen.
- Med HashRouter og `base` i Vite trengs det ingen ekstra oppsett.
- **Forutsetning:** repoet må være offentlig (Pages på private repoer krever betalt plan).
- **Alternativ hvis repoet skal være privat:** Cloudflare Pages eller Netlify koblet til det private repoet. Det er like enkelt og også gratis.

**v1-synk:** eksport og import av JSON med alle tabeller og skjemaversjon. Ved import flettes dataene som union på `id`, og `srs` regnes ut på nytt. Filen kan deles mellom nettbrett og iPhone med AirDrop, e-post eller Google Drive.

**v2-skisse:**
- En liten Cloudflare Worker med D1 (eller Supabase).
- Enhetene pares med en 6-sifret kode, og ingen konto trengs.
- Hver enhet sender sine nye `attempts`, `exams` og `thReports` siden siste synk og henter de andre enhetenes data.
- Fordi alt bare legges til og har uuid, trengs det ingen konfliktløsning. `settings` bruker last-write-wins med `updatedAt`.
- Synk starter når appen åpnes og når nettet kommer tilbake.

---

## 8. Spørsmål til Trond

1. **Hosting:** Kan repoet være offentlig, slik at vi kan bruke GitHub Pages? Hvis ikke, bruker vi Cloudflare Pages eller Netlify.
2. **Temakart:** Er koblingene til trinn og fordelingen av oppgaver i tabellene greie? Vil du vekte noe annerledes?
3. **Vilt** har ikke et eget punkt i temalisten. Er det greit å koble det til `fp-sikt-lys`?
4. **«Forbud på offentlig veg»:** Stemmer det at punktet betyr forbudene i vtl § 7 og trafikkreglene (fortau, motorveg, stans og parkering, tomgang), eller vet du om en annen betydning?
5. **Skilt:** Skal vi bruke Wikimedia Commons-grafikk for norske skilt (sjekkes per fil) eller tegne egne SVG-er? Wikimedia gir mest korrekte skilt og er raskest.
6. **Kontroll:** Hvor mange oppgaver rekker du å kontrollere per batch? Skal uverifiserte oppgaver vises for henne med et lite merke, eller holdes skjult til de er kontrollert?
7. **Thai-kontroll:** Hvem ser over thai-teksten? Henne selv via rapportknappen, eller har dere noen andre som kan gjøre det?
8. **Lyd:** Holder det med opplesning fra enheten (TTS), eller vil du ha innspilt lyd for kommandoparløren (Fase 3)?
9. **Enheter:** Hvilken modell og Android-versjon har nettbrettet, og hvilken iOS-versjon har iPhonen? Det avgjør hvilke TTS-stemmer som finnes.
10. **Tidsplan:** Har hun en ønsket dato for teoriprøven? Det avgjør om vi skal prioritere Fase 2 (prøveeksamen) før noe annet.
11. **Nynorsk:** Jeg antar at vi ikke trenger det. Stemmer det?
12. **Navn på appen:** Har du et forslag, eller skal jeg bruke arbeidstittelen «Teori B»?


### 8a. Svar fra Trond (21.11.2026) og hva de betyr

| # | Svar | Beslutning |
|---|---|---|
| 1 | Ja | Repoet kan være offentlig. Appen hostes på GitHub Pages med GitHub Actions. |
| 2 | Ja | Temakartet, koblingene til trinn og fordelingen (122 / 368) låses slik de står. |
| 3 | Ja | Vilt kobles til `fp-sikt-lys` som primært punkt. |
| 4 | Ja, men usikker | Tolkningen brukes. Oppgavene i `lr-forbud-offentlig-veg` får `verified: false` og en `todo` til tolkningen er bekreftet. |
| 5 | Wikimedia | Skiltene hentes fra Wikimedia Commons. Lisensen kontrolleres per fil og føres i `public/signs/LICENSES.md`. |
| 6 | Vises med merke | Uverifiserte elementer vises for eleven med et diskret merke («ikke kontrollert»). |
| 7 | Kona rapporterer | Thai-teksten kontrolleres via knappen «Rapporter oversettelse». Ingen egen thai-korrekturleser. |
| 8 | Usikker, lyd fra appen er trolig bedre enn fra enheten | Fase 1 bruker opplesning fra enheten (Web Speech) med fallback. Det **vurderes** å lage lydfiler på forhånd og pakke dem med appen, først for kommandoparløren og ordlisten (der tekstene er korte og faste), siden kanskje for flere tekster. Det avgjøres i planen for Fase 3. Hovedpunktene: lydkvalitet på thai, appens størrelse offline, og at lydfilene må lages på nytt når teksten endres. |
| 9 | Nettbrettet er en **Xiaomi Pad 5** (modell 21051182G) med Android 11 (RKQ1.200826.002). Skjermen er 1600 × 2560 px på 360 dpi, som er omtrent 1067 × 1707 CSS-px. iPhonen er omtrent 3 år gammel. | **Layout:** Hovedmålet er nettbrettet liggende, omtrent 1707 × 1067 CSS-px, med to kolonner. Appen skal fortsatt fungere stående og på telefon ned til 375 px bredde. **Thai-stemme:** Xiaomi/MIUI har ofte ikke thai-stemme installert. Første gang appen åpnes, får hun et oppsettssteg: hun installerer Google Speech Services med thai-stemme og velger den som TTS-motor. Deretter kontrollerer appen at `speechSynthesis.getVoices()` finner `th-TH`, `nb-NO` og `en` (en-GB eller en-US). Status vises i Innstillinger. **Installering:** På Android 11 skal appen installeres fra Chrome («Legg til på startskjermen» eller «Installer app»), ikke fra MIUI-nettleseren. Oppsettet sier dette tydelig. **iPhone:** En modell som er omtrent 3 år gammel har trolig iOS 17 eller nyere, og det støtter PWA og IndexedDB. |
| 10 | Ubestemt | Rekkefølgen på fasene beholdes: MVP først, deretter prøveeksamen. |
| 11 | Nei | Ingen nynorsk. |
| 12 | «Teori B» | Appen heter «Teori B» inntil videre. |
