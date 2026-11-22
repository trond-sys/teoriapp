# DESIGN – «Skilt og asfalt»

Visuelt system for Teori B, valgt av Trond 22.11.2026. Retningen og begrunnelsen står i `docs/design/retning-skilt-og-asfalt.md`. Fargene ligger i `src/styles/tokens.css`, og komponentene i `src/styles/layout.css`.

## Idé
Appen bruker språket hun skal lære: norske vegskilt og vegoppmerking. Fargene gjør faste jobber, de er ikke pynt.

| Rolle | Token | Lys | Mørk |
|---|---|---|---|
| Skall og hovedhandling (skiltblått) | `--sign`, `--accent` | #0b4f9c | #0c3f7c / #2f6cc0 |
| Valgt, aktiv og fokus (signalgult) | `--signal` | #ffc20e | #ffc20e |
| Riktig | `--ok` / `--ok-soft` | #157a3a / #dcf1e3 | #5ccb86 / #163322 |
| Galt | `--bad` / `--bad-soft` | #c8102e / #fbe2e5 | #ff7585 / #3b1a20 |
| Lenker og stille knapper | `--link` | #0b4f9c | #8dbbff |
| Grunn og flater | `--bg`, `--surface`, `--surface-2` | kald lys grå og hvit | asfaltsort |
| Tegninger | `--grass`, `--road`, `--marking`, `--curb`, `--post`, `--rail` | | |

All tekst har minst 4,5:1 kontrast i begge modusene (sjekket 22.11.2026).

## Lys og mørk
Standard er «Som nettbrettet»: `prefers-color-scheme` styrer. I Innstillinger → «Lys og mørk» kan hun låse lys eller mørk modus, og da settes `data-theme` på `<html>`. Mørk modus er laget for kveldsøving i sofaen.

## Skrift
- **Atkinson Hyperlegible** (400 og 700) for latinsk skrift. Den er laget for å være lett å lese, også for den som leser på et andrespråk.
- **Noto Sans Thai** (400, 600 og 700) for thai.
- Begge er selvhostet via `@fontsource` og fungerer uten nett.
- Skalaen er `--fs-1` til `--fs-5`. Den blir større på liggende nettbrett.

## Komponenter
- **Skall:** skiltblått sidefelt (240 px) med hvit innerkant, som et opplysningsskilt. Aktiv side er en hvit plate. På telefon og stående nettbrett er bunnfanene skiltblå, og aktiv fane har en gul strek øverst.
- **Dagens økt:** et blått skilt med hvit innerkant, gul startknapp og en kryss-tegning (fra 760 px).
- **Oppgave:**
  - På liggende nettbrett står tegningen til venstre (46 %, ligger fast ved rulling), med spørsmål, svarplater og tilbakemelding til høyre.
  - Ellers står tegningen øverst, maks 42 % av skjermhøyden.
- **Svarplate:** 2 px kant og en kvadratisk blå bokstavplate med hvit kant. Riktig svar blir grønt, galt svar rødt.
- **Tilbakemelding:** et kort med et farget felt øverst. «I Thailand …» står på myk gul bakgrunn.
- **Signatur, fremdriften som midtlinje** (`.lane`): én strek per oppgave på en asfaltstripe. Grønn betyr riktig, rød betyr galt og gul betyr nå. Streken fylles fra venstre.
- **Thai-laget** (`.t-th`): myk gul bakgrunn. Norske ord fra vegen (`.road-nb`): myk gul med gul oppmerkingsstrek under.
- **Valg** (segmentknapper og valgkort): gult betyr valgt.

## Tegninger
- **Kryss:** `SceneView`. Brukes til scener og til oppgavetegninger med `type: "kryss"`.
- **Rett vegstrekning:** `StretchView`, med `type: "strekning"`. Den kan vise:
  - holdeplass
  - gangfelt
  - smal veg
  - motorveg med avkjøring
  - planovergang
  - fartsgrenseskilt
  - blinklys
- **Felles regler for tegningene:**
  - Begge bruker samme kjøretøy og farger.
  - A er alltid «deg» og er rød.
  - Pilene viser bare hva trafikanten skal gjøre, aldri svaret.

## Bevegelse
Korte overganger (`--ease`, rask ut og myk inn):
- fremdriftsstreken som fylles
- markeringen i bunnmenyen
- tilbakemeldingen som glir opp

Alt slås av med `prefers-reduced-motion`.

## Ikke gjør
- Ingen farget venstrekant på kort eller lister.
- Ingen overskrift med liten etikett over.
- Ingen emoji som ikoner.
- Ingen nye farger utenfor tokenene.
