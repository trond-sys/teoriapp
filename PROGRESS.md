# PROGRESS

Denne filen viser status for prosjektet, slik at en ny økt kan fortsette uten å lese hele historikken. Planen for Fase 0 ligger i `docs/PLAN-fase0.md`. Planen for Fase 1 ble godkjent av Trond 21.11.2026 (se «Avvik fra PLAN-fase0» under).

## Status per fase
- [x] Fase 0 – plan (`docs/PLAN-fase0.md`), **godkjent 21.11.2026** (svarene står i §8a)
- [ ] Fase 1 – MVP: **all kode er ferdig. Innholdsbatch 1 (vikeplikt) er laget og kontrollert av en egen søkeøkt** (funn i `docs/TODO-kontroll-batch1.md`).
- [x] **Endring 01 – håndlagde scenarier** (`docs/endringer/ENDRING-01-handlagde-scenarier.md`): steg 1–8 er ferdige (22.11.2026). Alle 41 kjernescener er laget. **Alle har `verified: false` og venter på Tronds kontroll på `/review`.** Til de er verifisert, ser ikke eleven vikeplikt-krysset.
- [ ] Fase 2 – Eksamensklar
- [ ] Fase 3 – Øvelseskjøring og oppkjøring
- [ ] Fase 4 – Kvalitet

## Slik kjører du appen
```
npm install
npm run dev               # http://localhost:5173
npm run check             # validate-content + typecheck + tester (kjøres før hver commit)
npm run build             # produksjonsbygg med service worker (dist/)
npm run import-signs      # henter manglende skilt fra Statens vegvesens zip-filer og skriver LICENSES.md
npm run validate-scenes   # struktur og geometriske advarsler for de håndlagde scenariene (også en del av validate-content)
npm run audit-scenes      # revisjon: den gamle motoren mot hver scene → docs/scene-audit.md (hjelpemiddel, ikke dommer)
npm run apply-verifications -- fil.json   # skriver markeringer fra /review inn i scenefilene
```
Git: repoet har lokal `user.email` = GitHub noreply for `trond-sys`. **Ikke bruk BT Flyt-adressen her.** Ingenting er pushet. `.github/workflows/pages.yml` publiserer til GitHub Pages når repoet er pushet til `trond-sys/teoriapp` (offentlig) og Pages er satt til «GitHub Actions».

## Hva Fase 1 inneholder (kode)
| Del | Filer | Tester |
|---|---|---|
| Temaliste og konfig | `src/config/temaliste.ts`, `exam.ts`, `readiness.ts` | – |
| Innholdsskjema og validering | `src/content/schema.ts`, `validate.ts`, `scripts/validate-content.ts` | `validate.test.ts` |
| Vikeplikt-motor | `src/domain/yield/` (geometri, regler med hjemmel, rekkefølge, retting) | `engine.test.ts` (38 tester) |
| SRS, Dagens økt, mestring | `src/domain/srs.ts`, `session.ts`, `mastery.ts` | `domain.test.ts` |
| Lagring | `src/db/db.ts` (Dexie), `export.ts` (JSON-eksport) | `db.test.ts` |
| Språk og stillas | `src/i18n/` (`LangProvider`, `<T>`, `tts.ts`, `strings.ts`), `src/content/ui/strings.json` | – |
| Scenemotor | `src/scene/` (`SceneView` tegner kryss fra JSON) | via motor + validering |
| Moduler | `src/features/` (today, practice, quiz, yield, signs, glossary, progress, settings, review) | – |

Testet i nettleser (21.11.2026): liggende nettbrett 1707 × 1067, stående 1067 × 1707 og telefon 375 × 812. Ingen vannrett rulling på noen side. Dra-og-slipp i vikeplikt-krysset er testet med simulerte berøringshendelser. **Ikke testet på ekte Xiaomi Pad 5 eller iPhone ennå.**

## Innhold per tema
Mål = MVP (Fase 1) / totalt (Fase 2).

| temalisteRef | Laget | Verifisert | Thai ok | Mål |
|---|---|---|---|---|
| fp-avstand | 0 | 0 | 0 | 3 / 8 |
| fp-feltvalg | 0 | 0 | 0 | 6 / 18 |
| fp-forbikjoring | 0 | 0 | 0 | 5 / 15 |
| fp-hest | 0 | 0 | 0 | 1 / 4 |
| fp-planovergang | 0 | 0 | 0 | 2 / 6 |
| fp-signal | 0 | 0 | 0 | 2 / 6 |
| fp-sikkerhetssoner | 0 | 0 | 0 | 2 / 7 |
| fp-sikt-lys | 0 | 0 | 0 | 5 / 15 |
| fp-stopplengde | 0 | 0 | 0 | 4 / 12 |
| fp-veggrep | 0 | 0 | 0 | 5 / 14 |
| ft-samhandling | 0 | 0 | 0 | 5 / 14 |
| ft-begrensninger | 0 | 0 | 0 | 2 / 6 |
| ft-miljo | 0 | 0 | 0 | 2 / 6 |
| ft-sanser | 0 | 0 | 0 | 2 / 7 |
| fa-eierforhold | 0 | 0 | 0 | 2 / 6 |
| fa-forstehjelp | 0 | 0 | 0 | 3 / 10 |
| fa-forerrett | 0 | 0 | 0 | 3 / 9 |
| fa-reaksjoner | 0 | 0 | 0 | 2 / 7 |
| fa-passasjer | 0 | 0 | 0 | 2 / 6 |
| fa-avhold | 0 | 0 | 0 | 3 / 8 |
| fa-sikt-ruter | 0 | 0 | 0 | 3 / 7 |
| fa-trafikkuhell | 0 | 0 | 0 | 4 / 12 |
| fa-tretthet-rus | 0 | 0 | 0 | 4 / 12 |
| kj-betjening | 0 | 0 | 0 | 2 / 6 |
| kj-dekk-bremser-lys | 0 | 0 | 0 | 4 / 12 |
| kj-drivstoff-miljo | 0 | 0 | 0 | 1 / 5 |
| kj-forerstotte | 0 | 0 | 0 | 1 / 6 |
| kj-sikkerhetskontroll | 0 | 0 | 0 | 2 / 8 |
| lr-forbud-offentlig-veg | 0 | 0 | 0 | 1 / 5 |
| lr-bruksforskrift | 0 | 0 | 0 | 2 / 6 |
| lr-trafikkregler | 0 | 0 | 0 | 2 / 8 |
| lr-vtl-3-21 | 0 | 0 | 0 | 2 / 6 |
| so-fletting | 0 | 0 | 0 | 2 / 5 |
| so-skilt | 0 | 0 | 0 | 6 / 20 |
| so-oppmerking | 0 | 0 | 0 | 4 / 12 |
| vp-hoyreregel | 9 | 0 | 0 | 10 / 22 |
| vp-lysregulering | 3 | 0 | 0 | 3 / 8 |
| vp-rygging-vending | 2 | 0 | 0 | 2 / 5 |
| vp-samhandling | 2 | 0 | 0 | 2 / 7 |
| vp-stoppeplikt | 1 | 0 | 0 | 1 / 4 |
| vp-tr-10 | 3 | 0 | 0 | 3 / 8 |
| **Sum** | 20 | 0 | 0 | 122 / 368 |

Innhold utenom oppgavebanken: 12 av ~70 kjerneskilt, 4 av 12 vikeplikt-scener, 0 leksjoner og 21 ordlisteoppslag.

## Batch 1 – vikeplikt (venter på Tronds kontroll)
- **Oppgaver:** `src/content/questions/vp-*.json` (vikeplikt-001 til -020). Alle har `source`, `verified: false` og `thReview: "pending"`.
- **Scener:** de 4 scenene fra batch 1 er konvertert til det håndlagde formatet i Endring 01 (se under).
- **Skilt:** `src/content/signs.json` – 202, 204, 206, 208, 210, 212, 124, 126, 132, 139, 406, 516. Bildene kommer fra Statens vegvesens offisielle skiltfiler (NLOD 2.0) og ligger som PNG i `public/signs/`.
- **Ordliste:** `src/content/glossary.json` (21 begreper).
- **Kilder:** trafikkreglene (FOR-1986-03-21-747, sist endret FOR-2022-06-17-1049) og skiltforskriften (FOR-2005-10-07-1219) er lest på Lovdata 21.11.2026. Paragrafene §§ 3, 7, 8, 9, 10 og 11 i trafikkreglene og skilt 124, 202, 204, 206, 210, 212 og 516 i skiltforskriften er lest ordrett. Skiltforskriften §§ 23–25 (lys og politi) er bare lest som sammendrag.

## Endring 01 – håndlagde scenarier
Målet er at fasiten er data, ikke beregning: ingen kode i `src/` skal avgjøre vikeplikt når appen kjører.

**Ferdig (steg 1–3, 22.11.2026):**
- **Steg 1, kartlegging:**
  - Motoren brukes av `YieldBoard` (retting), `sceneCheck` (validate-content), `/review` (`RULES`) og `SceneView` (kjørebaner).
  - Den brukes av 4 scener. Flervalgsoppgavene vikeplikt-001 og -003 viser en scene som bilde, men bruker ikke motoren.
- **Steg 2, skjema og validator:**
  - Zod-skjema `Scenario` i `src/content/schema.ts`.
  - Validator i `src/domain/scenes/validate.ts` (struktur = feil, geometri = advarsler).
  - Ren geometri uten trafikkregler i `src/domain/scenes/geometry.ts`. To møtende venstresvingere regnes som ikke kryssende (§ 6 nr. 4).
  - `npm run validate-scenes`, også kalt fra `validate-content`.
  - 19 tester i `validate.test.ts`.
- **Steg 3, tre eksempelscener** i `src/content/scenes/`, alle `verified: false`:
  - `vp-scene-hoyreregel-01`
  - `vp-scene-parkering-01`, med vikepliktskilt på B (funn B4)
  - `vp-scene-venstre-venstre-01`, med `order: [["A","B"]]` (funn B6)
  - De vises med intensjonspiler på `/review` (`ScenarioPreview`), med knappen «Prøv i krysset».
- **Steg 4, konvertering (22.11.2026):**
  - De 4 gamle scenene er skrevet om, med fasit ut fra funnene (ikke fra motoren). Alle er `verified: false`.
    - `scene-hoyreregel-01` var identisk med `vp-scene-hoyreregel-01` og er slått sammen med den.
    - `scene-hoyreregel-02` er blitt `vp-scene-venstresving-01`.
    - `scene-forkjorsveg-01` er blitt `vp-scene-forkjorsveg-01`, med skilt 202 og 206 tegnet eksplisitt.
    - `scene-avkjorsel-01` er blitt `vp-scene-parkering-02`.
  - Flervalgsoppgavene vikeplikt-001 og -003 peker nå på de nye scenene.
  - YieldBoard retter mot `answer` med `src/domain/scenes/grade.ts`. Funksjonen sammenligner bare med de lagrede gruppene og har 4 tester. Forklaringen viser hjemmel og sitat per steg.
  - `ja-nei` og `velg` har eget skjermbilde, men er ikke prøvd i nettleseren, fordi ingen scener bruker dem ennå.
  - SceneView tegner bare intensjonspiler. Kjørebanene (`vehiclePath`) er fjernet.
  - Uverifiserte scener vises ikke for eleven (`STUDENT_SCENARIOS`). Bare verifiserte kjernescener er med i «Dagens økt» og i mestringen.
  - Det gamle formatet (`YieldScene`, `scenes-legacy/`, `sceneCheck`) er fjernet. `decide()` brukes ikke lenger av noe i `src/`. Bare `/review` importerer fortsatt `RULES`, og det fjernes i steg 5.
- **Steg 5, revisjon (22.11.2026):**
  - Den gamle motoren ligger i `scripts/audit/` (`engine.ts`, `rules.ts`, `geometry.ts` og 38 tester).
  - `npm run audit-scenes` kjører motoren mot hver scene og skriver `docs/scene-audit.md`.
  - Resultat 22.11.2026: 6 scener, **0 uenige**. Det er ventet, siden ingen av scenene treffer motorens kjente svakheter (trikk, utrykning, rundkjøring, lys, politi). Rapporten lister svakhetene.
  - Jeg testet med en bevisst feil fasit: revisjonen viste da hvilke vikeplikter rekkefølgen bryter, og hvilke steg som mangler.
  - **Ingen fil i `src/` importerer motoren lenger.** `src/domain/yield/` er fjernet, også `RULES` på `/review`.

- **Steg 6, kjernekatalogen (22.11.2026): 41 av 41.** Status kommer fra `npm run validate-scenes`, og målene står i `src/domain/scenes/catalog.ts`.

  | Undertema | Scener |
  |---|---|
  | Høyreregel | `hoyreregel-01..04` |
  | Avkjørsel | `parkering-01/-02`, `gardsveg-01`, `bensinstasjon-01` (ja-nei) |
  | Fra sykkelveg | `sykkelveg-01`, `sykkelveg-02` (ja-nei) |
  | Bussholdeplass | `buss-01` (50 km/t), `buss-02` (80 km/t, ja-nei) |
  | Skilt | `forkjorsveg-01`, `skilt-202-01`, `skilt-204-01` (velg), `skilt-206-01`, `skilt-208-01`, `skilt-210-01` |
  | Lysregulering | `lys-01..05` (venstresving på grønt, rødt mot grønt, lys foran skilt, gult blink, grønn pil) |
  | Politi | `politi-01` (velg), `politi-02`, `politi-03` (velg) |
  | Venstresving | `venstresving-01`, `venstresving-02`, `venstre-venstre-01` |
  | Svinging mot gående og syklende | `gangfelt-01`, `hoyresving-syklist-01`, `venstresving-syklist-01` |
  | Rygging | `rygging-01`, `rygging-02` (velg) |
  | Fri veg (§ 10) | `utrykning-01`, `trikk-01`, `trikk-gangfelt-01`, `utrykning-trikk-01` |
  | Rundkjøring | `rundkjoring-01..03` (02 er ja-nei) |

  - **Tegningen** kan nå vise trafikklys, politi, busslomme, gårdsveg, sykkelveg, flere fra samme arm og rygging. Bilene har front- og baklys.
  - **Revisjonen:** 41 scener, 9 uenige. Alle 9 er scener motoren ikke kan regne på: lys (4), politi (1), samme arm (3) eller rygging (2). Se `docs/scene-audit.md` eller `/review`.
  - **Ikke dekket:** vegskulder (krever rett vegstrekning), feltskifte inne i rundkjøring (krever tofelts rundkjøring) og tog ved planovergang. Dybdescener (`tier: "dybde"`) er ikke laget.
- **Steg 7, verifisering (22.11.2026):**
  - `/review` har knappen «Marker som kontrollert» (navn og dato, lagret lokalt) for hver scene, og knappen «Angre».
  - «Eksporter markeringer (JSON)» lager en fil. `npm run apply-verifications -- fil.json` skriver `verified`, `verifiedBy` og `verifiedAt` inn i filene.
  - Revisjonen vises for hver scene (`src/content/audit/scene-audit.json`).
- **Steg 8 (22.11.2026):** `docs/PROMPT.md` §4.3 punkt 1 og §6 beskriver nå modellen med håndlagde scenarier.
- **Når alle kjernescener er verifisert:** slett `scripts/audit/`, `scripts/audit-scenes.ts`, `docs/scene-audit.md` og `src/content/audit/`, og noter det her (Endring 01 §4).

**Kildekontroll 22.11.2026** (se `docs/KILDEKONTROLL-2026-11-22.md`):
- Trafikkreglene, skiltforskriften og vegtrafikkloven § 2 er lest ordrett på Lovdata. Alle 50 sitater i innholdet står ordrett.
- Slutningene som var åpne, er sjekket mot Statens vegvesen, signalnormalen N303, fagkilder og forum, og alle holdt:
  - sykkel er kjøretøy
  - høyreregelen gjelder i T-kryss
  - gult blink betyr at skiltene gjelder
  - grønn pil betyr at møtende har rødt
  - gående i gangfelt viker for trikk
- Ingen fasit er endret. Rettet:
  - Hjemmelen i buss-02 er nå § 7 nr. 4 («holdeplass»), ikke § 8 nr. 1.
  - Kilden i skilt-208-01: forskriften har bare tittelen for 208.
  - Forklaringene i vikeplikt-013, vikeplikt-020, skilt 204, skilt 139 og venstresving-01.
  - **Thai-teksten er endret i alle disse og må leses på nytt.**
  - Funnene A1–A4 og skilt 139 er dermed gjort.
- Fortsatt en tolkning: venstre-venstre-01 (to møtende som svinger til venstre). Lovteksten og forum støtter fasiten, men ingen offisiell kilde viser det med figur.

## Uverifiserte elementer og åpne spørsmål
Alt innhold er `verified: false` til Trond har kontrollert det. Dette er det jeg er mest usikker på:
- **vikeplikt-011, -012, -013, -015 og -020 og skilt 204:** Sjekket ordrett på Lovdata 22.11.2026 (se `docs/KILDEKONTROLL-2026-11-22.md`). Det som er sjekket, står i `todo`.
- **Skilt 126, 132, 139, 208 og 406:** Skiltforskriften har bare tittelen for disse skiltene (sjekket på Lovdata). Forklaringene bygger på trafikkreglene og Statens vegvesen.
- **Rundkjøring:** Trafikkreglene har ingen egen regel. Scenene tegner skilt 202 ved hver innkjøring (funn B5, bekreftet av Statens vegvesen og Store norske leksikon).
- **venstre-venstre-01:** Fortsatt en tolkning av § 6 nr. 4 og § 7 nr. 2 (se kildekontrollen).
- **Den gamle motoren** ligger i `scripts/audit/` og brukes bare til revisjonen. Funn B1, B2, B5 og B6 beskriver svakhetene.
- Fra Fase 0 (uendret): vtl § 21 er ikke kontrollert ordrett. Tolkningen av «Forbud på offentlig veg» er ikke bekreftet. Koblingen fra temalisten til trinn T1–T4 er ikke kontrollert mot læreplanen.
- **Thai:** All thai-tekst er mitt utkast. Kona flagger feil med «Rapporter oversettelse». Rapportene eksporteres fra Innstillinger eller `/review`.

## Kjente begrensninger
- **Skiltbilder:** Skiltene er PNG (maks 480 px), konvertert fra vegvesenets CMYK-JPG, fordi vegvesenet bare tilbyr EPS og JPG og maskinen ikke har verktøy for EPS → SVG. Utenfor runde og trekantede skilt er hjørnene hvite, ikke gjennomsiktige. Mangler en bildefil, viser appen skiltnummeret som plassholder, og `validate-content` gir en advarsel.
- Scenene viser bare kryss (X, T og rundkjøring). Rette vegstrekninger (vegskulder, forbikjøring) og planovergang med tog kan ikke tegnes ennå.
- Leksjoner (4.1) er ikke laget. Visningen bygges sammen med første leksjonsbatch.
- Import av eksportfil kommer i Fase 4. Eksport finnes i Innstillinger og på Fremgang.

## Avvik fra PLAN-fase0 (godkjent med Fase 1-planen)
- Fase 1-økten lager bare batch 1. Resten av MVP-innholdet kommer i egne økter per tema.
- Vikeplikt-krysset retter mot fasiten som er lagret i scenen (Endring 01), ikke mot en regelmotor. De som kan kjøre samtidig, godtas i begge rekkefølger.
- Fonter kommer fra `@fontsource` (bare latin og thai), ikke fra `public/fonts/`.
- `/review` og JSON-eksport kom allerede i Fase 1.
- **Skiltkilde byttet fra Wikimedia Commons til Statens vegvesen (21.11.2026).** Wikimedia stengte for nedlasting (429), og Trond ba meg finne en annen løsning. Vegvesenets filer er den offisielle kilden (Commons-filene er laget fra dem), med åpen lisens NLOD 2.0. Alle skilt hentes med `npm run import-signs`. Skjemaet har `credit.original` (zip-URL) og `credit.variant`, og `LICENSES.md` genereres fra `signs.json`.

## Neste steg
1. **Trond kontrollerer de 41 scenene på `/review`** (`npm run dev` → `#/review`):
   - Prøv scenen med «Prøv i krysset», og les fasit, hjemmel, TODO og revisjonen.
   - Trykk «Marker som kontrollert» for det som er riktig, og «Eksporter markeringer».
   - Kjør `npm run apply-verifications -- fil.json`, `npm run check` og commit.
   - Rettelser i en scene gjøres i `src/content/scenes/<id>.json`. Kjør `npm run validate-scenes` og `npm run audit-scenes` etterpå.
2. **Trond kontrollerer batch 1.** Funnene står i `docs/TODO-kontroll-batch1.md`. Sett `verified: true` (og eventuelt `thReview`) i JSON-filene for det som er riktig.
3. Test på Xiaomi Pad 5 (Chrome, installert som app) og iPhone (Safari, Legg til på Hjem-skjerm). Krever at appen er publisert, se «Git» over.
4. Deretter, i nye økter: én innholdsbatch per tema. Foreslått rekkefølge er resten av `vp-hoyreregel`, deretter `so-skilt` med ~58 skilt, `fp-veggrep` (vinter), `fa-trafikkuhell` (tunnel), `fp-sikt-lys` og så resten. De 8 siste vikeplikt-scenene kan komme med trikk, utrykning, gangfelt og rundkjøring.
