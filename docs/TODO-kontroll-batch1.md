# Kontroll av batch 1 (vikeplikt): punkter som trenger et dypere søk

**Laget:** 21.11.2026, etter at batch 1 ble committet (`80fc906`).
**Til:** en Claude-økt som skal finne ordrett hjemmel for reglene under. Les også `PROGRESS.md` og `docs/PROMPT.md` §6 (innholdsregler) før du starter.

## Oppdraget

For hvert punkt under:
1. Finn **ordrett** hjemmel (lov, forskrift, paragraf, nummer, ledd) eller en offisiell kilde fra Statens vegvesen.
2. Svar med én av tre konklusjoner:
   - **Bekreftet:** påstanden i appen stemmer.
   - **Feil:** påstanden er feil. Skriv hva som er riktig.
   - **Uklart:** kildene gir ikke et sikkert svar.
3. Ta med et kort sitat og en lenke for hver konklusjon.
4. Foreslå konkrete endringer i tekst, `source` og `todo` der det trengs.

**Regler for arbeidet:**
- Skriv funnene inn i seksjonen «Funn» nederst i denne filen.
- Ikke sett `verified: true` i innholdsfilene. Det gjør Trond selv etter å ha lest funnene.
- Endre ikke innholdsfiler uten at Trond har sagt ja.
- Er du usikker, si det. Ikke fyll hull med antakelser.
- Thai-teksten er ikke en del av dette søket. Den kontrolleres med knappen «Rapporter oversettelse».

## Kilder

| Kilde | URL | Status 21.11.2026 |
|---|---|---|
| Trafikkreglene, FOR-1986-03-21-747 (sist endret FOR-2022-06-17-1049) | https://lovdata.no/dokument/SF/forskrift/1986-03-21-747 | §§ 2, 3, 5, 7, 8, 9, 10, 11, 13 og 17 er lest ordrett |
| Skiltforskriften, FOR-2005-10-07-1219 (sist endret FOR-2026-08-12-1625) | https://lovdata.no/dokument/SF/forskrift/2005-10-07-1219 | §§ 1–22 B er lest ordrett. **§§ 23–25 (trafikklys og politiets anvisninger) er bare lest som sammendrag.** |
| Vegtrafikkloven | https://lovdata.no/dokument/NL/lov/1965-06-18-4 | § 3 er lest som sammendrag. § 21 er ikke lest ordrett. |

**Mulige tilleggskilder:**
- Statens vegvesens håndbok N300 *Trafikkskilt*, med offisiell beskrivelse og bruk av hvert skilt.
- Sidene om trafikkregler og skilt på vegvesen.no.
- Læreplanen for klasse B.

**Tips:** Lovdata-sidene er store. Første henting av skiltforskriften kom bare ordrett til omtrent skilt 1053, og resten kom som sammendrag. Prøv å hente de enkelte paragrafene direkte, hvis Lovdata har egne URL-er for dem. Les i så fall §§ 23, 24 og 25 hver for seg.

---

## A. Påstander i oppgavene (viktigst)

### A1. vikeplikt-013: politiets tegn går foran grønt lys
- **Fil:** `src/content/questions/vp-lysregulering.json`
- **Appen sier:** «Anvisning fra politiet gjelder foran anvisning gitt på annen måte – også foran trafikklys og skilt. Følg alltid politiets tegn.» Riktig svar er å stanse når politiet gir tegn om det, selv om lyset er grønt.
- **Lest ordrett:** Trafikkreglene § 3 nr. 2: «Anvisning gitt av politiet, Statens vegvesen, tollvesenet eller militærpolitiet gjelder foran anvisning gitt på annen måte.»
- **Spørsmål:** Omfatter «anvisning gitt på annen måte» trafikklyssignal? Finnes det en bestemmelse som sier det rett ut, for eksempel i skiltforskriften § 25, vegtrafikkloven eller en forarbeidstekst?

### A2. vikeplikt-012: politiet holder armen rett opp
- **Fil:** `src/content/questions/vp-lysregulering.json`
- **Appen sier:** «Arm rett opp betyr at alle trafikanter skal stanse. Kan du ikke stanse uten fare, kan du fortsette. Er du allerede inne i krysset, skal du kjøre ut av det.» Et feilsvar forklares slik: «Det gjelder når armen er strukket ut til siden. Arm rett opp betyr at alle skal stanse.»
- **Lest som sammendrag (ikke ordrett):** Skiltforskriften § 25:
  - Arm rettet oppad: «enhver trafikant [skal] stanse».
  - Arm rettet utad: trafikant forfra eller bakfra skal stanse.
- **Spørsmål:**
  1. Er ordlyden riktig?
  2. Står unntakene (kan ikke stanse uten fare / allerede i krysset) i forskriften?
  3. Gjelder «arm utad» trafikk forfra og bakfra, og får trafikk fra siden kjøre?

### A3. vikeplikt-011: grønt lys og vikepliktskilt i samme kryss
- **Fil:** `src/content/questions/vp-lysregulering.json`
- **Appen sier:** «Trafikklys gjelder foran vikepliktskilt. Grønt lys betyr at du kan kjøre hvis vegen er fri.»
- **Lest ordrett:** Trafikkreglene § 3 nr. 1 annet ledd: «Anvisning gitt ved trafikklyssignal gjelder foran anvisning om vikeplikt gitt ved offentlig trafikkskilt.»
- **Spørsmål:**
  1. Hva er den ordrette betydningen av grønt lys i skiltforskriften § 24?
  2. Står det noe om vikeplikt ved grønt lys, for eksempel ved venstresving?
  3. Tilleggsspørsmål: Hva gjelder når lyset blinker gult eller er slått av? Gjelder da skiltene og høyreregelen? Det er ikke laget oppgave om dette ennå.

### A4. vikeplikt-020 og skilt 204: stoppskilt gir også vikeplikt
- **Filer:** `src/content/questions/vp-stoppeplikt.json` og `src/content/signs.json` (skilt 204)
- **Appen sier:** «Skilt 204 ‹Stopp› betyr at du skal stanse helt før du kjører inn på den kryssende vegen. … Deretter har du vikeplikt.»
- **Lest ordrett, skilt 204:**
  - «Skiltet angir at kjørende skal stanse helt før kjøring inn på kryssende veg eller før kryssing av planovergang»
  - «Stansen skal skje foran og inntil stopplinje, eller dersom stopplinje mangler, så nær den kryssende veg som mulig.»
- **Lest ordrett, skilt 206:** «… kjørende som kommer fra sideveg eller kryssende veg, er pålagt vikeplikt …», etterfulgt av skilt 202 eller 204.
- **Spørsmål:** Står det rett ut at skilt 204 også gir vikeplikt, for eksempel i resten av teksten til 204 eller i N300? Les hele teksten til skilt 204, ikke bare starten.

### A5. vikeplikt-015: trikk og vikepliktskilt
- **Fil:** `src/content/questions/vp-tr-10.json`
- **Appen sier:** «Trafikanter skal gi fri veg for trikk (sporvogn) og om nødvendig stanse. Det gjelder uansett om trikken kommer fra høyre eller venstre.»
- **Lest ordrett:**
  - Trafikkreglene § 10 nr. 2: «Trafikant skal gi fri veg og om nødvendig stanse for sporvogn og for jernbanetog.»
  - § 10 nr. 4: «Nr. 1 og 3 i denne paragraf gjelder også for fører av sporvogn.»
- **Spørsmål:**
  1. Kan trikken selv ha vikeplikt etter skilt (202 eller 204) eller etter trafikklys i et kryss?
  2. Gjelder § 10 nr. 2 overfor gående i gangfelt, siden «trafikant» også omfatter gående?
  3. Hva betyr § 7 nr. 3 om sporvogn som svinger inn i veg med gangfelt («har vikeplikt for gående når fotgjengersignalet lyser grønt»)?
- Oppgaven sier «kryss uten skilt eller lys», så den er trolig riktig. Svarene avgjør likevel hvordan motoren skal behandle trikk (se B1).

---

## B. Regler i vikeplikt-motoren

Motoren retter vikeplikt-krysset. Reglene og hjemlene står i `src/domain/yield/rules.ts`, og selve logikken i `src/domain/yield/engine.ts` (funksjonen `decide`).

**Forrangen mellom reglene i motoren:** utrykning → trikk → gående i gangfelt → rundkjøring → avkjørsel → skilt → venstresving mot møtende → høyreregelen.

### B1. Trikk har alltid fri veg
Motoren lar alle andre vike for trikken når banene krysser, også gående i gangfelt. Skilt mot trikken tas ikke med. Det avhenger av svarene i A5.

### B2. Utrykning: alle viker, også uten kryssende baner
Med blått blinklys viker alle i krysset for utrykningskjøretøyet, også de som ikke krysser banen. Det bygger på § 10 nr. 1: «gi fri veg … Om nødvendig skal trafikanten stanse.»
- **Spørsmål:** Er dette en riktig forenkling for en øvingsoppgave?

### B3. Skilt går foran høyreregelen, og stoppskilt behandles som vikepliktskilt
Dette bygger på trafikkreglene § 3 nr. 1 første ledd, som er lest ordrett: «Anvisning gitt ved trafikklyssignal, offentlig trafikkskilt eller oppmerking på veg gjelder foran trafikkreglene.» Se A4 om stoppskiltet.

### B4. Avkjørsel viker også for den som har vikepliktskilt
Den som kommer fra parkeringsplass eller gårdsveg, har lavest rang og viker for alle, også for kjørende som selv har vikepliktskilt.
- **Lest ordrett:** § 7 nr. 4: «… har vikeplikt for annen trafikant.»
- **Spørsmål:** Stemmer dette også når den andre har skilt 202 mot seg?

### B5. Rundkjøring
Trafikkreglene nevner ikke rundkjøring. Motoren antar to ting:
1. Alle innkjøringer har skilt 202, så den som skal inn, viker for den som allerede kjører i rundkjøringen.
2. To som kjører inn fra ulike armer, er ikke i konflikt.

**Spørsmål:**
- Er dette riktig?
- Er det vanlig, eller et krav, at rundkjøringer i Norge har vikepliktskilt ved innkjøringene?
- Finnes det andre regler for rundkjøring, for eksempel om blinklys eller feltvalg?

Det er ikke laget rundkjøringsscener ennå.

### B6. To møtende som begge svinger til venstre
Motoren regner med at de svinger foran hverandre og kan kjøre samtidig, uten konflikt.
- **Spørsmål:** Er dette norsk regel eller praksis, og står det i en kilde, for eksempel i vegvesenets materiell?

---

## C. Skiltforklaringer uten ordrett kilde

Fil: `src/content/signs.json`. For skiltene under er bare tittelen lest. Finn den offisielle beskrivelsen i skiltforskriften §§ 4, 6 eller 10, eller i N300, og sammenlign:

| Skilt | Forklaring i appen |
|---|---|
| 208 Slutt på forkjørsveg | «Forkjørsvegen slutter. Etter skiltet gjelder vanlige regler (høyreregelen) hvis ikke andre skilt eller lys sier noe annet.» |
| 126 Rundkjøring (fareskilt) | «Varsler om rundkjøring foran deg.» |
| 132 Trafikklyssignal (fareskilt) | «Varsler om trafikklys foran deg.» |
| 139 Sporvogn (fareskilt) | «Varsler om at trikk (sporvogn) krysser eller kjører i vegen. Trikken har fri veg.» |
| 406 Påbudt rundkjøring | «Du skal kjøre rundt i pilenes retning (mot klokka).» |

Kontroller også at de offisielle navnene stemmer for alle 12 skiltene i `signs.json` (202, 204, 206, 208, 210, 212, 124, 126, 132, 139, 406 og 516). Navnene på 210 «Forkjørskryss» og 212 «Vikeplikt overfor møtende kjørende» er lest ordrett. Skiltbildene kommer fra Statens vegvesens skiltfiler (zip per skiltgruppe). For skilt 516 brukes filen `516_H.jpg`, men det finnes også `516_V.jpg`, og det er ikke kjent hva H og V betyr. Finn ut hvilken variant som er riktig å vise.

---

## D. Åpne punkter fra Fase 0

1. **Vegtrafikkloven § 21 («Alminnelige plikter»):** Les ordlyden ordrett. Temaet `lr-vtl-3-21` bygger på den.
2. **«Forbud på offentlig veg»** står bare på den norske temalisten. Trond har sagt «ja, men usikker» til denne tolkningen: forbudene i vegtrafikkloven § 5, § 7 og § 23 b og trafikkreglene § 4, § 11, § 16 og § 17.
   - **Spørsmål:** Finnes det en kilde (vegvesen.no, læreplanen eller andre) som sier hva temaet omfatter?
3. **Temalisten mot læreplanens trinn T1–T4:** Kontroller koblingen i `docs/PLAN-fase0.md` §1 mot læreplanen for klasse B.

---

## Funn

*(Fylles ut av økten som gjør søket. Én blokk per punkt: konklusjon, sitat, kilde-URL, forslag til endring.)*
