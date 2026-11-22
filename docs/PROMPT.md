# Prompt til Claude Code: Trespråklig teori- og øvingsapp for førerkort klasse B (NO / EN / TH)

Du skal bygge en webapp (PWA) som lærer én konkret elev – min kone – norske trafikkregler og gjør henne klar til teoriprøven for klasse B hos Statens vegvesen, og som støtter øvelseskjøringen vi gjør privat. Hun er thailandsk og leser/snakker ikke flytende norsk. Appen skal være trespråklig: norsk (bokmål), engelsk og thai.

Les hele dokumentet før du skriver kode. Start med Fase 0 (plan) og vent på godkjenning fra meg.

---

## 0. Om eleven (fylles ut av Trond før start)

- Alder: 25 år eller eldre (fritatt fra deler av trafikalt grunnkurs; mørkekjøring og førstehjelp/trafikkuhell er fortsatt obligatorisk)
- Norsknivå (lese / forstå muntlig): ok, men svakere enn engelsk.
- Engelsknivå (lese / forstå muntlig): ok – hennes sterkeste av prøvespråkene.
- Konsekvens for stillas: start på nivå **Bro** (engelsk hovedtekst, thai på trykk) i stedet for «Forstå». Thai skal være lett tilgjengelig som «Oversett til thai» på all tekst når hun ikke forstår noe, men ikke vises som standard. Nivå «Forstå» beholdes som valg.
- Har hun førerkort fra Thailand eller kjøreerfaring? Ja, førerkort fra Thailand, men lite som kan overføres (venstrekjøring, andre regler og skilt). Behandle henne som nybegynner på norske regler; vær særlig tydelig der thailandsk praksis er motsatt (høyrekjøring, høyreregelen, rundkjøring, forbikjøring).
- Primærenhet: Android-nettbrett (hovedmål) og iPhone. Bygg og test for Android-nettbrett først; iPhone støttes så lenge det ikke gir mye ekstraarbeid. Layout må fungere både på telefon og nettbrett (stående og liggende).
- Hvilket språk tar hun teoriprøven på (engelsk eller norsk)? Ikke bestemt ennå – appen må støtte begge som prøvespråk, med valg i innstillinger.

---

## 1. Den strategiske kjernen – les dette først

**Teoriprøven kan ikke tas på thai.** For klasse B tilbyr Statens vegvesen bokmål, nynorsk, nordsamisk, engelsk, arabisk (MSA), sorani og tyrkisk. Alternativet er tilrettelagt muntlig prøve med tolk, som eleven betaler selv.

Konsekvens for designet:
- **Thai er et stillas, ikke målspråket.** Thai brukes for å *forstå* reglene. Engelsk (eller norsk) er språket hun skal *bestå* på.
- Appen skal aktivt trappe ned thai over tid (se §5 «Stillasnivåer»), slik at hun til slutt løser oppgaver kun på prøvespråket.
- Norske nøkkelord hun møter på veien (skilttekster, underskilt, vegoppmerking, «Gjelder ikke», «Kollektivfelt», «Vikeplikt» osv.) skal alltid vises også på norsk, uansett språkinnstilling – de står på norsk ute i trafikken.

---

## 2. Fakta om prøven og opplæringen (verifisert mot vegvesen.no, nov. 2026)

Teoriprøven klasse B:
- 45 oppgaver, 90 minutter, minst 38 riktige for å bestå (maks 7 feil).
- Tas på PC på trafikkstasjon. Kandidaten kan bytte språk når som helst underveis.
- Ordbok er tillatt (egen eller trafikkstasjonens).
- Ved stryk: to ukers ventetid før ny prøve.
- Oppkjøring må bestås innen 3 år etter bestått teoriprøve.

Opplæringen (læreplan klasse B, fire trinn):
1. Trafikalt grunnkurs
2. Grunnleggende kjøretøy- og kjørekompetanse
3. Trafikal del
4. Avsluttende opplæring

Privat øvelseskjøring:
- Ledsager må ha fylt 25 år og hatt førerkort for klassen sammenhengende de siste fem årene. Ledsager regnes som fører av bilen.
- Bilen skal ha rød L på hvit bakgrunn bak, og ekstra speil for ledsager.
- Elev over 25 år er fritatt fra deler av trafikalt grunnkurs og trenger ikke øvelseskjøringsbevis, men **mørkekjøring** og **plikter ved trafikkuhell og førstehjelp** er obligatorisk før oppkjøring. Legitimasjon skal alltid være med.

Temaliste: Statens vegvesen publiserer en temaliste for klasse B på engelsk («Topics for the theory test Category B – English.pdf») og norsk. **PDF-en ligger i `/docs/temaliste/`** (side 1 engelsk, side 2 norsk – se `KILDE.md`). Bruk den som dekningskart: hver oppgave skal kobles til et tema i temalisten, og appen skal kunne vise dekning per tema. **Ta med alle temaer fra både den norske og den engelske listen** – også punkt som bare finnes på én av dem (f.eks. «Forbud på offentlig veg», som mangler i den engelske).

Legg disse fakta i én konfigfil (`src/config/exam.ts`) med kildelenke og dato, slik at de kan oppdateres når regler endres.

---

## 3. Inspirasjon – hva vi låner fra de beste appene

| App / marked | Hva vi låner |
|---|---|
| Teorimester (NO) | Vikepliktspill; kjørelogg for øvelseskjøring koblet til ferdighetene i opplæringsplanen; øving på sikkerhetskontroll-spørsmål til oppkjøringen |
| Teorikurs.no (NO) | Struktur etter de fire trinnene; korte leksjoner; svake temaer kommer tilbake til de er mestret |
| Teoriprøven – bil / Teoriappen (NO) | Mestring per tema mot temalisten; egen skiltquiz; «appen sier ifra når du er klar» |
| Driving Theory Test 4 in 1 (UK) | Opplest tekst på alle spørsmål (viktig for elev som leser på andrespråk); fullverdige prøveeksamener |
| DVSA-apper (UK) | Hasardoppfatning – trene på å se farer *før* de oppstår |
| theorie24 «Prüfungsampel» (DE) | Trafikklys-indikator for eksamensklarhet |
| Zutobi (SE/US) | Spillfølelse, korte økter, motivasjon, oppsummert pensum i lettlest format |
| Trafikverket (SE) | Prøve på mange språk + mulighet til å lytte – bekrefter at lyd + språkbytte er riktig grep |

**Opphavsrett:** Ikke kopier spørsmål, tekster, illustrasjoner eller videoer fra noen av disse appene eller fra Statens vegvesens prøvebank. Alle oppgaver skal være originale, skrevet ut fra regelverket og temalisten.

---

## 4. Moduler (funksjonelle krav)

### 4.1 Teorikurs (leksjoner)
- Strukturert etter de fire trinnene og temalisten.
- Korte leksjoner (2–5 min): forklaring → illustrasjon (SVG) → 2–3 kontrollspørsmål umiddelbart.
- Hver leksjon har lovhenvisning (f.eks. «Trafikkreglene § 7») og «Les mer»-lenke til Lovdata/vegvesen.no.

### 4.2 Spørsmålsbank
Oppgavetyper:
- Flervalg, ett riktig svar (som på prøven)
- Flervalg med bilde/SVG-scene
- Sant/usant-lynrunde
- Hver oppgave har forklaring på **hvorfor** riktig svar er riktig og hvorfor de vanligste feilsvarene er feil.

### 4.3 Interaktive oppgaver
Bygg en felles motor for scenarioer (SVG + JSON-definert scene), og lag disse typene:
1. **Vikeplikt-krysset:** ovenfra-visning av kryss. Eleven drar kjøretøy i riktig kjørerekkefølge (eller svarer ja/nei eller velger et alternativ). Scenarier: høyreregelen, vikepliktskilt, forkjørsvei, rundkjøring, avkjørselsregelen (utkjøring fra parkeringsplass/gårdsvei), trikk, utrykningskjøretøy, fotgjengere i gangfelt.
   - **Håndlagde scenarier (Endring 01, `docs/endringer/ENDRING-01-handlagde-scenarier.md`):** Fasiten er data, ikke beregning. Hver scene i `src/content/scenes/` lagres med rekkefølge og steg («hvem viker for hvem»), og hvert steg har hjemmel og et kort ordrett sitat. Ingen kode i appen avgjør vikeplikt.
   - Koden kontrollerer bare at scenen henger sammen (`npm run validate-scenes`: struktur og geometriske advarsler).
   - Pilene viser hvor trafikanten skal (høyre, rett fram, venstre), ikke kjørebanen gjennom krysset.
   - Scenene merkes `tier: "kjerne"` (prøverelevant) eller `"dybde"` (kanttilfeller, teller ikke mot klarhet og er ikke med i prøveeksamen).
   - Kjernekatalogen (41 scener) står i `src/domain/scenes/catalog.ts`.
2. **Skilt:** flashcards, «hva betyr skiltet?», «finn skiltet som betyr …», sortering i skiltgrupper (fareskilt, vikepliktskilt, forbudsskilt, påbudsskilt, opplysningsskilt, serviceskilt, underskilt), samt vegoppmerking. Bruk skiltnummer fra skiltforskriften.
3. **Finn faren (hasardoppfatning):** illustrert trafikkscene med klikkbare soner og tidsgrense. Etterpå: gjennomgang av alle farer med forklaring.
4. **Stopplengde-simulator:** glidebryter for fart + valg av føre (tørr, våt, snø, is). Viser reaksjonslengde, bremselengde og total stopplengde visuelt. Etterfølges av spørsmål.
5. **Feltvalg og plassering:** velg riktig felt og blinklys i kryss og rundkjøring.
6. **Rekkefølge-oppgaver:** dra steg i riktig rekkefølge (f.eks. på et ulykkessted: sikre – varsle – førstehjelp).
7. **«Hva gjør du nå?»:** korte forgreinende scenarier med konsekvens og forklaring.

Norske temaer som skal vektes tungt fordi de er særnorske eller ofte feiles: vinterkjøring og dekk, vilt, tunnel, smale veier og møteplasser, kollektivfelt, sykkel- og gangfelt, forbikjøring, lysbruk, rus og trøtthet, vikeplikt generelt.

### 4.4 Prøveeksamen
- Speiler den ekte prøven: 45 oppgaver, 90 minutter, grense 38.
- Språkbytte mellom engelsk og norsk når som helst (som på ekte prøve). Thai **av** som standard i eksamensmodus, men kan slås på i innstillinger.
- Etter prøven: resultat, gjennomgang av feil med forklaring, og hvilke temaer som trakk ned.

### 4.5 Repetisjon (spaced repetition)
- Leitner-system eller SM-2 per oppgave. Feilsvar kommer tilbake oftere.
- «Dagens økt» (10–15 min): blanding av forfalte repetisjoner, nytt stoff og én interaktiv oppgave. Bland temaer (interleaving) i stedet for å drille ett tema om gangen.

### 4.6 Ordliste (trespråklig)
- Alle sentrale fagbegreper: norsk – engelsk – thai, med kort forklaring og lyd.
- Fagord i leksjoner og spørsmål er markert; trykk gir ordlisteoppslag uten å forlate oppgaven.
- Egen øvingsmodus for ordlisten (flashcards NO↔EN↔TH).

### 4.7 Øvelseskjøring (for elev og ledsager)
- **Kjørelogg:** dato, varighet, område/vegtype, ferdigheter øvd (koblet til læreplanens trinn 2 og 3), elevens egenvurdering 1–5, ledsagers notat. Manuell registrering i MVP, ingen GPS.
- **Ferdighetssjekkliste** per trinn med status (ikke startet / øver / sikker).
- **«Før vi kjører»-sjekkliste:** L-skilt, ekstra speil, legitimasjon (og øvelseskjøringsbevis hvis aktuelt).
- **Kommandoparlør for bilen** – viktig: korte, faste kommandoer ledsager bruker under kjøring, med store knapper og lyd på alle tre språk. Eksempler: «Brems», «Stopp», «Se i speilet», «Blink til venstre/høyre», «Hold høyre», «Senk farten», «Vikeplikt», «Rundkjøring – ta andre avkjøring», «Kjør inn til siden», «Bra!». Vi skal kunne øve på disse hjemme før vi kjører, slik at hun forstår dem umiddelbart under stress.
- **Øvelsesplan:** forslag til neste økt basert på hva som er øvd lite.

### 4.8 Sikkerhetskontroll (oppkjøring)
- Spørsmål om bilen: dekk og mønsterdybde, lys, væsker, bremser, speil, varsellamper. Trespråklig, med bilde.

### 4.9 Progresjon og klarhetsindikator
- Mestring per tema i temalisten (prosent + farge).
- Trafikklys for eksamensklarhet, f.eks. grønt når: siste 3 prøveeksamener ≥ 40/45 **på prøvespråket uten thai**, alle temaer ≥ 85 % mestring, skilt ≥ 95 %. Tersklene skal ligge i konfig.
- Strek/serie og enkel motivasjon – men ingen støyende spillmekanikk som tar tid fra læring.

---

## 5. Språkhåndtering

- All UI-tekst og alt innhold i separate språkfelt (`nb`, `en`, `th`). Ingen hardkodede strenger i komponenter.
- Sett riktig `lang`-attributt på hvert tekstelement (`lang="th"` osv.) – nødvendig for korrekt tekstbryting og opplesning av thai.
- Fonter: Noto Sans + Noto Sans Thai (selvhostet for offline).
- **Opplesning:** Web Speech API med stemmer for `nb-NO`, `en-GB`/`en-US`, `th-TH`. Skjul lydknappen hvis stemme mangler på enheten. Juster hastighet (0,8× / 1×).

**Stillasnivåer** (eleven velger, appen foreslår å gå videre når mestring tilsier det):
1. **Forstå:** thai er hovedtekst, engelsk og norsk vises under.
2. **Bro:** engelsk (eller norsk) er hovedtekst, thai på trykk.
3. **Eksamen:** kun prøvespråket. Thai ikke tilgjengelig.

Statistikk skal skille på om oppgaven ble løst med eller uten thai – det er tallene *uten* thai som teller mot klarhetsindikatoren.

---

## 6. Innholdsregler – korrekthet er kritisk

Feil regler lærer henne feil ting i trafikken. Derfor:
- Hvert innholdselement (leksjon, oppgave, scenario) har felt `source` med konkret hjemmel (lov/forskrift + paragraf, f.eks. «Trafikkreglene § 7 nr. 2») eller vegvesen.no-lenke.
- Er du usikker på en regel: **ikke gjett.** Lag elementet med `verified: false` og en `TODO`-kommentar, og list det for meg.
- Felt `verified` (regel kontrollert av Trond) og `thReview` (`pending` / `ok` / `flagged`).
- Thai-tekst produsert av deg er utkast. Lag en «Rapporter oversettelse»-knapp på all thai-tekst, så eleven kan flagge og foreslå bedre formulering. Rapportene lagres lokalt og kan eksporteres som JSON, slik at jeg kan rette innholdsfilene.
- Lag en skjult **redaktørside** (`/review`) som lister uverifiserte elementer, thai-flagg og temadekning mot temalisten.
- **Vikeplikt-scener (Endring 01):**
  - Hvert steg i fasiten har `source.ref` og `source.quote` (ordrett sitat).
  - **Uverifisert betyr skjult:** scener med `verified: false` vises ikke for eleven, bare på `/review`.
  - Trond markerer scener som kontrollert på `/review`, eksporterer JSON og kjører `npm run apply-verifications -- fil.json`. Det setter `verified`, `verifiedBy` og `verifiedAt` i filene, og så committer han.
  - `npm run audit-scenes` sammenligner fasiten med den gamle regelmotoren i `scripts/audit/` og skriver `docs/scene-audit.md`. Det er et hjelpemiddel, ikke en dommer.
  - Når alle kjernescener er verifisert, slettes motoren og revisjonsskriptet.
- Skilt: tegn som SVG eller bruk skiltgrafikk fra Wikimedia Commons der lisensen tillater det – dokumenter kilde og lisens per fil i `public/signs/LICENSES.md`.
- Ingen kopiering fra kommersielle apper eller fra Statens vegvesens prøve.

---

## 7. Teknisk

- **Stack:** Vite + React + TypeScript, PWA (vite-plugin-pwa), fullt offline etter første lasting.
- **Lagring:** IndexedDB (Dexie) for progresjon, logg og rapporter. Ingen backend i v1.
- **Synk mellom enheter:** eksport/import av progresjon som JSON-fil (v1). Skissér et alternativ for v2.
- **Innhold:** JSON-filer per tema i `src/content/`, validert mot Zod-skjema. Lag `npm run validate-content` som feiler hvis et element mangler ett av de tre språkene, har ugyldig fasit, mangler `source` eller tema.
- **Tester:** Vitest for SRS-logikk, eksamenstrekk og skårings-/klarhetsberegning.
- **Mobil først:** store trykkflater, fungerer med én hånd, god kontrast, ingen tekst i bilder (all tekst må kunne oversettes og leses opp).
- **Hosting:** statisk (GitHub Pages / Netlify / Vercel). Foreslå det enkleste.

Eksempel på oppgaveformat:

```json
{
  "id": "vikeplikt-012",
  "topic": "vikeplikt",
  "temalisteRef": "<tema-ID fra temalisten>",
  "trinn": 3,
  "type": "mc-single",
  "difficulty": 2,
  "media": { "scene": "scenes/kryss-hoyreregel-02.json" },
  "prompt": { "nb": "…", "en": "…", "th": "…" },
  "options": [
    { "id": "a", "text": { "nb": "…", "en": "…", "th": "…" } },
    { "id": "b", "text": { "nb": "…", "en": "…", "th": "…" } },
    { "id": "c", "text": { "nb": "…", "en": "…", "th": "…" } }
  ],
  "correct": "b",
  "explanation": { "nb": "…", "en": "…", "th": "…" },
  "glossaryTerms": ["vikeplikt", "høyreregelen"],
  "source": "Trafikkreglene § 7",
  "verified": false,
  "thReview": "pending"
}
```

---

## 8. Leveranse i faser

**Fase 0 – Plan (stopp og vent på godkjenning)**
- Les temalisten i `/docs/temaliste/`, lag temakart og foreslå innholdsfordeling.
- Foreslå mappestruktur, datamodell og komponentstruktur.
- List spørsmål du trenger svar på fra meg.

**Fase 1 – MVP (brukbar for henne i hverdagen)**
- App-skall, navigasjon, språk og stillasnivåer, opplesning.
- Spørsmålsmotor (flervalg + bilde), forklaringer, SRS og «Dagens økt».
- Skiltmodul.
- Vikeplikt-krysset (første interaktive type).
- Ordliste.
- ~120 oppgaver fordelt over alle temaer + kjerneskiltene.
- Progresjon per tema.

**Fase 2 – Eksamensklar**
- Prøveeksamen 45/90/38 med språkbytte.
- Klarhetsindikator.
- Stopplengde-simulator, feltvalg, rekkefølge, sant/usant.
- Øk til 350+ oppgaver med full temadekning.

**Fase 3 – Øvelseskjøring og oppkjøring**
- Kjørelogg, ferdighetssjekkliste, «før vi kjører», kommandoparlør, øvelsesplan.
- Sikkerhetskontroll.
- Finn faren (hasardoppfatning) og «Hva gjør du nå?»-scenarier.

**Fase 4 – Kvalitet**
- Redaktørside, eksport/import, rapporter-flyt, tilgjengelighet, offlinetest på mobil.

---

## 9. Arbeidsmåte

- Planlegg før du koder. Vis meg planen for hver fase før du starter den.
- Små, logiske commits. Kjør `validate-content` og tester før hver commit.
- Lag innhold i batcher per tema, og oppsummer hva som er laget og hva som er uverifisert.
- Når du er usikker på en trafikkregel eller en thai-formulering: si det, merk det, og gå videre. Ikke fyll hull med antakelser.
- Hold UI enkelt og rolig. Eleven skal lære, ikke underholdes.

## 10. Modellvalg og økter

Anbefalt oppsett (Trond bytter modell/effort mellom fasene):

| Fase | Modell / effort | Hvorfor |
|---|---|---|
| Fase 0 – plan, temakart | Opus 5.5, high (eventuelt xhigh), i plan mode | Datamodell og struktur er dyre å endre senere. |
| Kode generelt | Opus 5.5, high | Rikelig. Sonnet 5.5 er et rimeligere alternativ for UI-kode hvis kvoten blir knapp. |
| Vikeplikt-motor og scenemotor | Opus 5.5, xhigh | Den eneste delen med vanskelig logikk (kjørerekkefølge, JSON-definerte scener). Feil her går igjen i alle scenarioene. |
| Innhold (oppgaver og thai) | Opus 5.5, high | Høyere effort gir ikke færre feil om faktiske regler. Det gjør kildekravet (§6) og Tronds kontroll. |

Fable 5.2 er ikke nødvendig. Det som begrenser kvaliteten er kontrollen mot Lovdata, ikke hvor sterk modellen er.

Regler for økter:
- **Lag innhold i batcher med én økt per tema.** Over 350 oppgaver på tre språk fyller konteksten fort, og kvaliteten synker i lange økter. Arbeidsflyt per batch: lag innhold → kjør `validate-content` → commit → oppsummer → **stopp og anbefal ny økt.**
- **Den første batchen skal kontrolleres grundig** (f.eks. de første 20 vikepliktoppgavene). Stopp etter den og vent på tilbakemelding. Finner Trond systematiske feil, justeres prompten før resten lages.
- Hold en `PROGRESS.md` i repoet med status per fase og tema, uverifiserte elementer og neste steg, slik at en ny økt kan fortsette uten å lese hele historikken.

## 11. Ferdig betyr

- Hun kan åpne appen på mobilen uten nett, ta «Dagens økt» på 10–15 minutter, og se hvor hun står per tema.
- Hun kan ta en realistisk prøveeksamen på engelsk eller norsk.
- Alt innhold finnes på tre språk, har kilde, og kan flagges.
- Vi kan logge øvelseskjøring og bruke kommandoparløren i bilen.
