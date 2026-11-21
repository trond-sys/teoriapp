# PROGRESS

Denne filen viser status for prosjektet, slik at en ny økt kan fortsette uten å lese hele historikken. Planen ligger i `docs/PLAN-fase0.md`.

## Status per fase
- [x] Fase 0 – plan (`docs/PLAN-fase0.md`), **godkjent 21.11.2026** (svarene står i §8a)
- [ ] Fase 1 – MVP
- [ ] Fase 2 – Eksamensklar
- [ ] Fase 3 – Øvelseskjøring og oppkjøring
- [ ] Fase 4 – Kvalitet

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
| vp-hoyreregel | 0 | 0 | 0 | 10 / 22 |
| vp-lysregulering | 0 | 0 | 0 | 3 / 8 |
| vp-rygging-vending | 0 | 0 | 0 | 2 / 5 |
| vp-samhandling | 0 | 0 | 0 | 2 / 7 |
| vp-stoppeplikt | 0 | 0 | 0 | 1 / 4 |
| vp-tr-10 | 0 | 0 | 0 | 3 / 8 |
| **Sum** | 0 | 0 | 0 | 122 / 368 |

Innhold utenom oppgavebanken: 0 av ~70 kjerneskilt, 0 av 12 vikeplikt-scener, 0 leksjoner og 0 ordlisteoppslag.

## Beslutninger fra Fase 0
- Navn: «Teori B». Hosting: GitHub Pages (repoet kan være offentlig). Ingen nynorsk.
- Skilt fra Wikimedia Commons, med lisens per fil.
- Uverifiserte elementer vises med et merke. Thai kontrolleres via kona sin rapportknapp.
- **Enheter:**
  - Hovedenheten er en Xiaomi Pad 5 (21051182G) med Android 11 og omtrent 1067 × 1707 CSS-px. Layouten designes først for liggende format (omtrent 1707 × 1067) og skal også fungere stående og ned til 375 px.
  - Oppsettet første gang appen åpnes: hun installerer appen fra Chrome (ikke fra MIUI-nettleseren) og installerer Google Speech Services med thai-stemme. Deretter kontrollerer appen at `speechSynthesis.getVoices()` finner `th-TH`, `nb-NO` og `en`.
  - iPhonen er omtrent 3 år gammel (trolig iOS 17 eller nyere).

## Uverifiserte elementer og åpne spørsmål
- Vtl § 21 («Alminnelige plikter»): ordlyden er ikke kontrollert ordrett på Lovdata.
- «Forbud på offentlig veg»: tolkningen brukes, men er ikke bekreftet. Elementene får `verified: false`.
- Koblingen fra temalisten til læreplanens trinn (T1–T4) er ikke kontrollert mot læreplanen.
- Lyd: Fase 1 bruker opplesning fra enheten. Forhåndslagde lydfiler som pakkes med appen vurderes i planen for Fase 3, først for kommandoparløren og ordlisten.

## Neste steg
1. Plan for Fase 1 i en ny økt: først stillaset (Vite, PWA, Dexie, Zod og validate-content), deretter språk og T-komponenten, og til slutt spørsmålsmotor og SRS.
2. Første innholdsbatch: 20 vikepliktoppgaver. Stopp etter den for grundig kontroll.
