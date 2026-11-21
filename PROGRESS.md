# PROGRESS

Denne filen viser status for prosjektet, slik at en ny økt kan fortsette uten å lese hele historikken. Planen for Fase 0 ligger i `docs/PLAN-fase0.md`. Planen for Fase 1 ble godkjent av Trond 21.11.2026 (se «Avvik fra PLAN-fase0» under).

## Status per fase
- [x] Fase 0 – plan (`docs/PLAN-fase0.md`), **godkjent 21.11.2026** (svarene står i §8a)
- [ ] Fase 1 – MVP: **all kode er ferdig. Innholdsbatch 1 (vikeplikt) er laget og venter på Tronds kontroll.** Det lages ikke mer innhold før batch 1 er kontrollert.
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
- **Scener:** `src/content/scenes/` – `scene-hoyreregel-01`, `scene-hoyreregel-02`, `scene-forkjorsveg-01`, `scene-avkjorsel-01`. `expectedOrder` er kryssjekket mot motoren.
- **Skilt:** `src/content/signs.json` – 202, 204, 206, 208, 210, 212, 124, 126, 132, 139, 406, 516. Bildene kommer fra Statens vegvesens offisielle skiltfiler (NLOD 2.0) og ligger som PNG i `public/signs/`.
- **Ordliste:** `src/content/glossary.json` (21 begreper).
- **Kilder:** trafikkreglene (FOR-1986-03-21-747, sist endret FOR-2022-06-17-1049) og skiltforskriften (FOR-2005-10-07-1219) er lest på Lovdata 21.11.2026. Paragrafene §§ 3, 7, 8, 9, 10 og 11 i trafikkreglene og skilt 124, 202, 204, 206, 210, 212 og 516 i skiltforskriften er lest ordrett. Skiltforskriften §§ 23–25 (lys og politi) er bare lest som sammendrag.

## Uverifiserte elementer og åpne spørsmål
Alt innhold er `verified: false` til Trond har kontrollert det. Dette er det jeg er mest usikker på:
- **vikeplikt-011:** Betydningen av grønt lys (skiltforskriften § 24) er bare lest som sammendrag. § 3 nr. 1 (lys foran skilt) er lest ordrett.
- **vikeplikt-012:** Politiets tegn «arm rett opp» og unntakene. Skiltforskriften § 25 er bare lest som sammendrag.
- **vikeplikt-013:** Politi foran trafikklys. § 3 nr. 2 sier «foran anvisning gitt på annen måte». At trafikklys er omfattet, er min tolkning.
- **vikeplikt-015 og motorregelen `sporvogn`:** Kan trikk ha vikeplikt etter skilt i enkelte kryss? Motoren gir trikken alltid fri veg, også overfor gående. Derfor er det ikke laget scener med skilt mot trikk.
- **vikeplikt-020 og skilt 204:** At stoppskilt også gir vikeplikt, bygger på teksten til skilt 206. Selve teksten til 204 er bare lest om stans.
- **Skilt 126, 132, 139, 208 og 406:** Bare tittelen er lest. Forklaringene er skrevet ut fra trafikkreglene.
- **Motorregelen `rundkjoring`:** Trafikkreglene har ingen egen regel for rundkjøring. Motoren antar vikepliktskilt ved alle innkjøringer, og at to som kjører inn fra ulike armer ikke er i konflikt. Det er ikke laget rundkjøringsscener i batch 1.
- **Motorregelen `venstresving`:** To møtende som begge svinger til venstre, regnes som «foran hverandre» uten konflikt.
- Alle motorregler står med hjemmel i `src/domain/yield/rules.ts` og listes på `/review`.
- Fra Fase 0 (uendret): vtl § 21 er ikke kontrollert ordrett. Tolkningen av «Forbud på offentlig veg» er ikke bekreftet. Koblingen fra temalisten til trinn T1–T4 er ikke kontrollert mot læreplanen.
- **Thai:** All thai-tekst er mitt utkast. Kona flagger feil med «Rapporter oversettelse». Rapportene eksporteres fra Innstillinger eller `/review`.

## Kjente begrensninger
- **Skiltbilder:** Skiltene er PNG (maks 480 px), konvertert fra vegvesenets CMYK-JPG, fordi vegvesenet bare tilbyr EPS og JPG og maskinen ikke har verktøy for EPS → SVG. Utenfor runde og trekantede skilt er hjørnene hvite, ikke gjennomsiktige. Mangler en bildefil, viser appen skiltnummeret som plassholder, og `validate-content` gir en advarsel.
- Vikeplikt-motoren støtter ikke kø (to kjøretøy fra samme arm), trafikklys eller politi i scener, gang- og sykkelveg som egen armtype, og buss fra holdeplass. Dette dekkes foreløpig av flervalg.
- Leksjoner (4.1) er ikke laget. Visningen bygges sammen med første leksjonsbatch.
- Import av eksportfil kommer i Fase 4. Eksport finnes i Innstillinger og på Fremgang.

## Avvik fra PLAN-fase0 (godkjent med Fase 1-planen)
- Fase 1-økten lager bare batch 1. Resten av MVP-innholdet kommer i egne økter per tema.
- Vikeplikt-krysset retter etter vikeplikt-grafen. De som kan kjøre samtidig, godtas i begge rekkefølger. `validate-content` kryssjekker `expectedOrder` mot motoren.
- Fonter kommer fra `@fontsource` (bare latin og thai), ikke fra `public/fonts/`.
- `/review` og JSON-eksport kom allerede i Fase 1.
- **Skiltkilde byttet fra Wikimedia Commons til Statens vegvesen (21.11.2026).** Wikimedia stengte for nedlasting (429), og Trond ba meg finne en annen løsning. Vegvesenets filer er den offisielle kilden (Commons-filene er laget fra dem), med åpen lisens NLOD 2.0. Alle skilt hentes med `npm run import-signs`. Skjemaet har `credit.original` (zip-URL) og `credit.variant`, og `LICENSES.md` genereres fra `signs.json`.

## Neste steg
1. **Trond kontrollerer batch 1.** Sjekk særlig TODO-punktene over. De er samlet med spørsmål og kilder i `docs/TODO-kontroll-batch1.md`, som er laget for et dypere søk i en egen økt. Sett `verified: true` (og eventuelt `thReview`) i JSON-filene for det som er riktig, eller gi tilbakemelding om systematiske feil, så justeres arbeidsmåten før mer innhold lages.
2. Test på Xiaomi Pad 5 (Chrome, installert som app) og iPhone (Safari, Legg til på Hjem-skjerm). Krever at appen er publisert, se «Git» over.
3. Deretter, i nye økter: én innholdsbatch per tema. Foreslått rekkefølge er resten av `vp-hoyreregel`, deretter `so-skilt` med ~58 skilt, `fp-veggrep` (vinter), `fa-trafikkuhell` (tunnel), `fp-sikt-lys` og så resten. De 8 siste vikeplikt-scenene kan komme med trikk, utrykning, gangfelt og rundkjøring.
