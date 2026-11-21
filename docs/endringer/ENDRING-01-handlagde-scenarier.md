# Endring 01: Fra regelmotor til håndlagde scenarier

**Til:** Claude Code
**Fra:** Trond
**Les først:** `docs/PROMPT.md`, `PROGRESS.md`, `TODO-kontroll-batch1.md` (seksjonen «Funn»), `src/domain/yield/rules.ts` og `src/domain/yield/engine.ts`.
**Arbeidsmåte:** Lag en plan, vis den, og vent på godkjenning før du endrer kode.

---

## 1. Hvorfor

I dag regner `decide()` i `engine.ts` seg fram til fasiten i vikeplikt-krysset ut fra generelle regler. Kontrollen av batch 1 viste problemet:

- Motoren må løse alle kombinasjoner, også dem ingen har kontrollert. Hver ny kombinasjon er en mulig feil.
- Kanttilfellene var det vanskelige: trikk mot rødt lys, trikk som svinger mot grønn mann, utrykning uten konflikt, og banen når to møtende svinger til venstre. Prøven spør ikke om noen av dem.
- Vi kan ikke garantere at en generell motor er riktig. Vi *kan* kontrollere 40 konkrete scener én gang.

**Ny modell:** Hver scene lagres med fasit og hjemmel, kontrollert av et menneske. Koden avgjør ikke lenger hvem som har vikeplikt. Den sjekker bare at scenen henger sammen.

---

## 2. Prinsipper

1. **Fasiten er data, ikke beregning.** Ingen funksjon i appen avgjør vikeplikt når eleven bruker den.
2. **Én scene, én hovedregel.** Hver kjernescene tester én regel fra temalisten. Kombinasjoner er bare tillatt der de er vanlige i virkeligheten (for eksempel lyskryss med venstresving).
3. **Hjemmel per steg.** Hvert steg i fasiten har en kilde (lov, forskrift og paragraf, eller en side på vegvesen.no) og et kort sitat.
4. **Vis intensjon, ikke bane.** Tegn en pil for hvor hver trafikant skal (høyre, rett fram, venstre), ikke den nøyaktige kjørebanen gjennom krysset. Da påstår ikke scenen noe om geometri som ikke er hjemlet (se B6 i `TODO-kontroll-batch1.md`).
5. **Uverifisert betyr skjult.** Scener med `verified: false` vises ikke i elevmodus, bare på `/review`.
6. **Kjerne og dybde.** Hver scene merkes `tier: "kjerne"` (prøverelevant, står i temalisten) eller `tier: "dybde"` (kanttilfeller). Dybdescener teller ikke mot klarhetsindikatoren og er ikke med i prøveeksamen.

---

## 3. Dataformat

Én fil per scene i `src/content/scenes/`. Skjema i Zod. Forslag:

```json
{
  "id": "vp-scene-hoyreregel-01",
  "topic": "vikeplikt",
  "temalisteRef": "<ID for «Høyreregel» i temakartet>",
  "tier": "kjerne",
  "layout": {
    "type": "x-kryss",
    "arms": ["N", "E", "S", "W"],
    "signs": [],
    "lights": null,
    "police": null
  },
  "actors": [
    { "id": "A", "kind": "bil", "from": "S", "intent": "rett-fram" },
    { "id": "B", "kind": "bil", "from": "E", "intent": "rett-fram" }
  ],
  "question": {
    "type": "rekkefolge",
    "prompt": { "nb": "Hvem kjører først?", "en": "…", "th": "…" }
  },
  "answer": {
    "order": [["B"], ["A"]],
    "steps": [
      {
        "who": "A",
        "yieldsTo": ["B"],
        "explanation": { "nb": "A har B på sin høyre side og har vikeplikt.", "en": "…", "th": "…" },
        "source": {
          "ref": "Trafikkreglene § 7 nr. 2",
          "quote": "Kjørende har vikeplikt for kjøretøy som kommer fra høyre."
        }
      }
    ]
  },
  "verified": false,
  "verifiedBy": null,
  "verifiedAt": null,
  "thReview": "pending"
}
```

Merknader:
- `order` er en liste av grupper. Trafikanter i samme gruppe kan kjøre samtidig, for eksempel `[["A","B"]]` for to møtende som begge svinger til venstre.
- `question.type`: `rekkefolge` (hvem kjører først), `ja-nei` («Har A vikeplikt for B?»), og `velg` (flervalg om hva en bestemt trafikant skal gjøre).
- `kind`: `bil`, `buss`, `trikk`, `utrykning`, `gaende`, `syklist`. Utrykning har `"bluelight": true`.
- Posisjoner som `"inne-i-rundkjoring"` og `"fra-parkering"` angis på trafikanten, ikke ved at motoren tolker kartet.

---

## 4. Hva koden skal gjøre (validator, ikke dommer)

Lag `src/domain/scenes/validate.ts` og `npm run validate-scenes`. Kjør det også fra `validate-content`.

**Strukturkontroll:**
- Alle trafikanter i `order` og `steps` finnes i `actors`, og alle i `actors` står i `order` nøyaktig én gang.
- Skilt, lys og politi står på armer som finnes.
- Alle tekstfelt finnes på nb, en og th.
- Hvert steg har `source.ref` og `source.quote`.
- `tier: "kjerne"` krever `temalisteRef`.

**Geometrisk fornuftskontroll (ingen trafikkregler):**
- Regn ut hvilke trafikanter som har *kryssende eller sammenfallende intensjoner* (for eksempel rett fram fra S og rett fram fra E). Bruk enkel geometri på armer og retninger.
- **Advarsel** hvis to trafikanter med kryssende intensjoner står i samme gruppe i `order`.
- **Advarsel** hvis en trafikant har `yieldsTo` mot en som ikke krysser intensjonen dens.
- Dette er advarsler som vises for et menneske, ikke automatiske fasiter.

**Overgangsrevisjon (midlertidig):**
- Behold den gamle `decide()` bare i `scripts/audit-scenes.ts` (`npm run audit-scenes`).
- Skriptet kjører gammel motor mot hver scene og lager `docs/scene-audit.md` med uenigheter mellom motor og fasit.
- Rapporten er et hjelpemiddel for Trond når han kontrollerer scenene, ikke en dommer.
- Når alle kjernescener er `verified: true`, slettes `decide()`, `rules.ts` og skriptet. Noter det i `PROGRESS.md`.

**I appen:**
- UI-et leser `answer` direkte og bruker det til retting og forklaring.
- Ingen import av `decide()` i `src/` utenfor `scripts/`.

---

## 5. Gjennomføring i steg

Stopp og rapporter etter steg 3.

1. **Kartlegg.** List alle eksisterende scener og oppgaver som bruker `decide()`. Vis listen.
2. **Skjema og validator.** Lag Zod-skjema, `validate-scenes` og den geometriske kontrollen. Tester i Vitest.
3. **Tre eksempelscener.** Lag disse og stopp:
   - høyreregel (kjerne)
   - ut fra parkering mot bil med vikepliktskilt (kjerne, se B4)
   - to møtende som begge svinger til venstre, med `order: [["A","B"]]` og intensjonspiler (kjerne, se B6)
   Trond godkjenner formatet før resten lages.
4. **Konverter eksisterende scener** til nytt format. Fasiten skrives ut fra funnene i `TODO-kontroll-batch1.md`, ikke ut fra hva motoren svarte. Alle får `verified: false`.
5. **Revisjonsrapport.** Kjør `audit-scenes` og legg `docs/scene-audit.md` i repoet.
6. **Kjernekatalog.** Lag resten av kjernescenene etter listen i §6, i batcher per undertema. Én batch per økt, stopp etter hver.
7. **Redaktørside.** `/review` viser scener med status, advarsler fra validatoren, uenigheter fra revisjonen, og en knapp for å markere som verifisert. Knappen setter `verifiedBy` og `verifiedAt`, lagres lokalt og kan eksporteres som patch eller JSON som Trond committer.
8. **Rydd opp.** Oppdater `docs/PROMPT.md` (§4.3 punkt 1 og §6) og `PROGRESS.md`.

---

## 6. Kjernekatalog (omtrent 40 scener)

Følger undertemaene for vikeplikt i temalisten for klasse B. Antallet er veiledende.

| Undertema i temalisten | Scener | Hovedhjemmel |
|---|---|---|
| Høyreregel | 4 | Trafikkreglene § 7 nr. 2 |
| Ut fra parkering / avkjørsel / gårdsveg / vegskulder | 4 | § 7 nr. 4 første ledd |
| Fra sykkelveg, gangveg eller fortau | 2 | § 7 nr. 4 annet ledd |
| Bussholdeplass | 2 | Trafikkreglene, regelen om buss som forlater holdeplass (finn paragraf) |
| Skilt 202, 204, 206, 208 | 6 | Skiltforskriften § 6 |
| Lysregulering inkl. venstresving på grønt, gult blink | 5 | Skiltforskriften § 24, trafikkreglene § 3 |
| Politiets tegn | 3 | Skiltforskriften § 25, trafikkreglene § 3 |
| Venstresving mot møtende (også to som begge svinger) | 3 | § 7 nr. 2, § 6 nr. 4 |
| Svinging mot gående og syklende | 3 | § 7 nr. 3 |
| Rygging og vending | 2 | § 11 |
| Trafikkreglene § 10: utrykning, trikk, tog | 4 | § 10 |
| Rundkjøring: inn med skilt 202 / feltskifte inne | 3 | Skiltforskriften § 6, vegvesen.no «Kjøre i rundkjøringer» |

**Dybde** (lages senere, ikke nå): trikk mot rødt lys, trikk som svinger mot grønt fotgjengersignal, trikk inn i rundkjøring med skilt 202, flere trafikanter med ulike regler samtidig.

---

## 7. Ferdig betyr

- Ingen kode i `src/` avgjør vikeplikt når appen kjører.
- `npm run validate-content` og `validate-scenes` går grønt.
- De tre eksempelscenene er godkjent av Trond.
- Eksisterende scener er konvertert og har en revisjonsrapport.
- `/review` viser status og advarsler per scene.
- `docs/PROMPT.md` og `PROGRESS.md` er oppdatert.
