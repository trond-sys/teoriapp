# Kontroll av batch 1 (vikeplikt): punkter som trenger et dypere søk

**Laget:** 21.11.2026, etter at batch 1 ble committet (`80fc906`).
**Til:** en Claude-økt som skal finne ordrett hjemmel for reglene under. Les også `PROGRESS.md` og `docs/PROMPT.md` §6 (innholdsregler) før du starter.

> **Oppfølging 22.11.2026:** Lovteksten er nå lest ordrett på Lovdata, og de åpne punktene er sjekket mot Statens vegvesen, fagkilder og forum. A1–A4 og skilt 139 er rettet. Se `docs/KILDEKONTROLL-2026-11-22.md`.

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

Kontroller også at de offisielle navnene stemmer for alle 12 skiltene i `signs.json` (202, 204, 206, 208, 210, 212, 124, 126, 132, 139, 406 og 516). Navnene på 210 «Forkjørskryss» og 212 «Vikeplikt overfor møtende kjørende» er lest ordrett. Skilt 516 er filen «516.H» på Commons, og det er ikke kjent hva H og V betyr. Finn ut hvilken variant som er riktig å vise.

---

## D. Åpne punkter fra Fase 0

1. **Vegtrafikkloven § 21 («Alminnelige plikter»):** Les ordlyden ordrett. Temaet `lr-vtl-3-21` bygger på den.
2. **«Forbud på offentlig veg»** står bare på den norske temalisten. Trond har sagt «ja, men usikker» til denne tolkningen: forbudene i vegtrafikkloven § 5, § 7 og § 23 b og trafikkreglene § 4, § 11, § 16 og § 17.
   - **Spørsmål:** Finnes det en kilde (vegvesen.no, læreplanen eller andre) som sier hva temaet omfatter?
3. **Temalisten mot læreplanens trinn T1–T4:** Kontroller koblingen i `docs/PLAN-fase0.md` §1 mot læreplanen for klasse B.

---

## Funn

**Utført:** 21.11.2026 (chat-økt, ikke Claude Code).

**Om kildene i denne runden – les dette først:**
- Lovdata avviste direkte henting (robots). Ordlyden under er derfor hentet fra Lovdatas egne søketreff, og fra speilinger av samme tekst (lovnorge.no, juridika.no, trafikksiden), regjeringen.no og Statens vegvesens håndbøker. Der speilingene er enige med Lovdata-treffet, regnes ordlyden som sikker.
- N300-sitatene kommer fra **eldre utgaver** av skiltnormalen (Håndbok 050 del 2 fra 2007/2009, og N300 del 2 fra 2014). Gjeldende N300 (2024) er ikke lest. Bruk dem som støtte, ikke som endelig hjemmel.
- **Anbefaling:** Åpne Lovdata i nettleseren og les skiltforskriften §§ 24–25 og trafikkreglene § 6 nr. 4 selv. Det tar fem minutter og lukker de siste usikkerhetene.

### Oppsummering

| Punkt | Konklusjon | Må appen endres? |
|---|---|---|
| A1 Politi foran grønt lys | Bekreftet | Nei. Bytt gjerne `source`. |
| A2 Arm rett opp | Bekreftet | Nei. Liten presisering foreslås. |
| A3 Grønt lys / vikepliktskilt | Bekreftet | Nei. Gult blink: se notat. |
| A4 Stoppskilt gir vikeplikt | Bekreftet | `source`-tekst bør oppdateres. |
| A5 Trikk | Delvis uklart. Oppgaven er riktig. | Nei for oppgaven. **Ja for motoren (B1).** |
| B1 Trikk har alltid fri veg | **Feil i to tilfeller** | **Ja** |
| B2 Utrykning, alle viker | Forenkling, delvis feil | Ja, avgrens |
| B3 Skilt foran høyreregel, 204 = vikeplikt | Bekreftet | Nei |
| B4 Avkjørsel viker for alle | Bekreftet | Nei |
| B5 Rundkjøring | Antakelse 1 i hovedsak bekreftet, men av skiltnormalen. Antakelse 2 uklart. | Ja, modeller skiltet eksplisitt |
| B6 Begge svinger til venstre | **Uklart – kan være motsatt av motorens antakelse** | **Ja, sett på vent** |
| C Skiltforklaringer | 208, 126, 139: delvis bekreftet. 132, 406: uklart. 516: forklaring funnet. | 139: ja, juster |
| D1 vtl. § 21 | Ordlyd funnet | Sjekk temaet |
| D2 Forbud på offentlig veg | Uklart | — |
| D3 Temaliste mot trinn | Ikke utført | — |

---

### A1. Politiets tegn går foran grønt lys – **Bekreftet**

- **Sitat 1 (trafikkreglene § 3):** «Anvisning gitt av politiet, Statens vegvesen, tollvesenet eller militærpolitiet gjelder foran anvisning gitt på annen måte.»
  Kilde: https://lovdata.no/dokument/SF/forskrift/1986-03-21-747 (søketreff)
- **Begrunnelse:** Samme paragraf kaller trafikklys en «anvisning gitt ved trafikklyssignal» (§ 3 nr. 1). Trafikklys er dermed en «anvisning gitt på annen måte», og politiets tegn går foran.
- **Sitat 2 (Statens vegvesen, håndbok 051 Arbeidsvarsling):** «Manuell dirigering gjelder foran lyssignaler (for eksempel grønt lys).»
  Kilde: https://docplayer.me/6953295-Arbeidsvarsling-retningslinjer-handbok-051.html
- **Forslag:** Teksten kan stå. Sett `source` til «Trafikkreglene § 3 nr. 1 og 2». Det finnes ingen setning i forskriften som nevner trafikklys og politi i samme setning, så forklaringen bør vise koblingen: «Trafikklys er en anvisning. Politiets anvisning går foran alle andre anvisninger.»

### A2. Politiet holder armen rett opp – **Bekreftet**

- **Sitat (skiltforskriften § 25):**
  - «Er arm rettet utad, skal trafikant som nærmer seg forfra eller bakfra stanse. Den som nærmer seg fra siden, kan passere.»
  - «Er arm rettet oppad, skal enhver trafikant stanse. Kjørende som har nådd så langt fram at kjøretøyet ikke uten fare kan stanses, kan fortsette. Trafikant som er i vegkryss, skal forlate krysset.»
  - «Når lykt med rødt lys svinges fram og tilbake, skal trafikant som ferdes i retning mot lyset stanse.»
  Kilde: https://lovdata.no/dokument/SF/forskrift/2005-10-07-1219/KAPITTEL_16 (søketreff). Samme tekst finnes hos https://www.lovnorge.no/dokument/SF/forskrift/2005-10-07-1219
- **Svar på spørsmålene:**
  1. Ordlyden i appen er riktig.
  2. Begge unntakene står i forskriften.
  3. Ja. «Arm utad» stanser trafikk forfra og bakfra, og trafikk fra siden kan passere.
- **Merk:** Unntaket «kan fortsette» gjelder etter ordlyden *kjørende* (ikke gående). Appens «Kan du ikke stanse uten fare …» er rettet mot fører, så det stemmer.
- **Forslag:** Sett `source` til «Skiltforskriften § 25». Nummereringen vises ulikt i speilingene (a/b/c eller 1/2/3), så skriv paragrafen uten bokstav eller nummer til du har sett Lovdata selv. Ny oppgaveidé: den svingende røde lykten.

### A3. Grønt lys og vikepliktskilt – **Bekreftet**

- **Sitat (skiltforskriften § 24, signal 1080 Hovedsignal):** «Ved rødt lys må kjørende ikke passere signal eller stopplinje. Rødt lys sammen med gult lys varsler at veksling til grønt lys vil skje straks. Ved grønt lys kan kjørende passere signal eller stopplinje dersom vegen er fri.»
  Kilde: https://lovdata.no/dokument/SF/forskrift/2005-10-07-1219 (søketreff). Samme tekst i Statens vegvesens håndbok N303: https://www.vegvesen.no/globalassets/fag/handboker/hb-n303.pdf
- **Svar på spørsmålene:**
  1. Se sitatet. Appens «kan kjøre hvis vegen er fri» gjengir det riktig.
  2. § 24 sier ikke noe eget om venstresving. Grønt lys opphever ikke vikeplikten etter trafikkreglene § 7 nr. 2 (venstresving har vikeplikt for møtende). «Dersom vegen er fri» er nøkkelen. Vegvesenets håndbok 048 sier at **grønn pil** bare skal vises der føreren kan kjøre uten konflikt, altså uten å få vikeplikt. Kilde: https://fileserver.motocross.io/trafikksiden/HB048_Trafikksignalanlegg_2012.pdf
  3. **Gult blinkende lys:** Ordlyden i gjeldende § 24 er ikke lest ordrett. Den gamle skiltforskriften (1980) sa: «Gult blinksignal angir at trafikantene må vise særlig aktsomhet og oppmerksomhet. Signalet kan nyttes i trelyssignal når disse ikke er i vanlig drift.» Kilde: https://lovdata.no/dokument/LTI/forskrift/1986-07-25-1611. Den gjeldende teksten bruker etter alt å dømme «særlig aktpågivenhet og varsomhet» (regjeringen.no-PDF av 2005-forskriften, bare delvis lest).
     - *Slutning, ikke sitat:* Når lyset blinker gult eller er av, gir signalet ingen anvisning om vikeplikt. Da gjelder skilt og oppmerking, og deretter trafikkreglene (høyreregelen), etter rangordningen i trafikkreglene § 3 nr. 1.
- **Forslag:** Ingen endring i vikeplikt-011. Før du lager oppgaver om gult blink: les gjeldende § 24 på Lovdata og bruk ordlyden derfra.

### A4. Stoppskilt gir også vikeplikt – **Bekreftet**

- **Sitat (skiltforskriften § 6, skilt 204, hele teksten):** «Skiltet angir at kjørende skal stanse helt før kjøring inn på kryssende veg eller før kryssing av planovergang, og at den kjørende har vikeplikt for kjørende trafikk i begge retninger på kryssende veg eller at den kjørende skal gi fri veg for sporvogn og jernbanetog på kryssende planovergang.»
  Kilde: https://lovdata.no/dokument/SF/forskrift/2005-10-07-1219?q=skiltforskrift (søketreff), sitert i sin helhet av Trafikksikkerhetshåndboken: https://www.tshandbok.no/del-2/3-trafikkregulering/doc657/
- **Forslag:** Teksten kan stå. Oppdater `source` til hele ordlyden over. Legg til i forklaringen at vikeplikten gjelder trafikk **i begge retninger** på kryssende veg. Ny oppgaveidé: stoppskilt foran planovergang (fri veg for tog og trikk).

### A5. Trikk og vikepliktskilt – **Oppgaven er riktig. Delvis uklart for motoren.**

- **Sitat (trafikkreglene § 2):** «For fører av sporvogn gjelder trafikkreglene bare når dette framgår av vedkommende bestemmelse.» Kilde: https://lovdata.no/dokument/SF/forskrift/1986-03-21-747 (søketreff)
- **Sitat (trafikkreglene § 3):** «Denne paragraf gjelder også for fører av sporvogn.» (samme kilde)
- **Sitat (§ 10 nr. 1):** «Trafikant skal gi fri veg for utrykningskjøretøy når føreren varsler med blinkende blått lys. Om nødvendig skal trafikanten stanse.» Og § 10 nr. 4: «Nr. 1 og 3 i denne paragraf gjelder også for fører av sporvogn.» Kilde: https://opphevet.juridika.no/no/forskrift/1986-03-21-747 og https://lovdata.no/dokument/SF/forskrift/1986-03-21-747
- **Svar på spørsmålene:**
  1. **Ja, trikken kan ha vikeplikt.**
     - *Trafikklys:* § 3 (anvisninger) gjelder uttrykkelig for sporvognfører. Trikken må altså følge trafikklys.
     - *Skilt:* Skiltnormalen sier: «Foran rundkjøring skiltet med vikepliktskilt har sporvogn vikeplikt inn mot rundkjøringen, men ikke ut av sentraløya». Kilde: Håndbok 050 del 2 (2007), https://www.vegvesen.no/s/bransjekontakt/Hb/050-2ForelopigUtg2007.pdf. Det er **uklart** om vikepliktskilt gir trikken vikeplikt også i vanlige kryss. Sjekk gjeldende N300 under skilt 139 og 202.
  2. **Gående i gangfelt viker for trikk.** Samme håndbok: «Gående i gangfelt har vikeplikt for sporvogn». Håndboken viser til trafikkreglene § 2 og § 9. Kjørende trafikk har også vikeplikt for sporvogn som kommer fra venstre.
  3. Unntak: § 7 nr. 3 annet ledd: «Fører av sporvogn som vil svinge inn i veg med gangfelt, har vikeplikt for gående når fotgjengersignalet lyser grønt.» Kilde: https://www.regjeringen.no/globalassets/upload/sd/vedlegg/vikepliktforskrift_230513.pdf. **Da viker trikken for de gående.**
- **Forslag:** vikeplikt-015 kan stå (kryss uten skilt og lys). Konsekvensene for motoren står i B1.

---

### B1. Trikk har alltid fri veg – **Feil i to tilfeller**

Motoren er riktig i det vanlige tilfellet: kjørende og gående i gangfelt viker for trikk (se A5). Den tar feil i to tilfeller:
1. **Trafikklys mot trikken:** Trikken skal følge lysregulering (§ 3 gjelder sporvogn). Rødt lys for trikken betyr at trikken stanser.
2. **Trikk som svinger, gående med grønt signal:** Trikken har vikeplikt for gående (§ 7 nr. 3 annet ledd).

I tillegg kommer rundkjøring med vikepliktskilt, der trikken har vikeplikt inn (N300, se A5). Det gjelder bare hvis det lages rundkjøringsscener med trikk.

- **Forslag til `rules.ts`:** La anvisninger (trafikklys, og vikepliktskilt ved rundkjøring) **mot trikken** gjelde før regelen «trikk har fri veg». Legg til en egen regel for trikk som svinger mot gående med grønt fotgjengersignal. Til det er gjort: lag ikke scener med lys eller skilt mot trikken.

### B2. Utrykning: alle viker – **Forenkling, delvis feil**

- **Sitat (§ 10 nr. 1):** «Trafikant skal gi fri veg for utrykningskjøretøy når føreren varsler med blinkende blått lys. **Om nødvendig** skal trafikanten stanse.»
- **Vurdering:** Plikten er å *gi fri veg*. Stans er bare påkrevd «om nødvendig». Et kjøretøy som ikke er i vegen for utrykningen, har ingen plikt til å stanse. At utrykningen kjører først, stemmer. At alle andre *må vente*, er ikke hjemlet.
- **Utrykning går foran trikk:** Bekreftet. § 10 nr. 4 sier at nr. 1 også gjelder sporvognfører.
- **Forslag:** For en «hvem kjører først»-oppgave kan rekkefølgen beholdes. Forklaringen må ikke si at alle skal stanse, men: «Alle som er i vegen, skal gi fri veg, og stanse om nødvendig.» Lag ikke oppgaver der riktig svar er at en bil uten konflikt må stå stille.

### B3. Skilt foran høyreregelen, stoppskilt som vikepliktskilt – **Bekreftet**

- § 3 nr. 1 første ledd er allerede lest ordrett.
- Skilt 204 gir vikeplikt etter sin egen ordlyd (se A4). Det er riktig å behandle 204 som 202 pluss full stans.
- **Forslag:** I `rules.ts`, bruk ordlyden fra A4 som kilde for 204.

### B4. Avkjørsel viker også for den som har vikepliktskilt – **Bekreftet (ordlyd)**

- **Sitat (§ 7 nr. 4):** «Kjørende som kommer fra parkeringsplass, holdeplass, torg, eiendom, bensinstasjon, gågate, gatetun eller liknende område har vikeplikt for annen trafikant.» Kilde: https://www.regjeringen.no/globalassets/upload/sd/vedlegg/vikepliktforskrift_230513.pdf
- **Statens vegvesen:** Du har vikeplikt for *all annen trafikk* når du kjører inn på en vei fra slike områder. Kilde: https://www.vegvesen.no/trafikkinformasjon/trafikksikkerhet/trafikkregler/vikeplikt/vikeplikt-ulike-trafikksituasjoner/
- **Vurdering:** Ordlyden har ingen unntak for trafikant som selv har vikepliktskilt. Motorens regel stemmer.
- **Merk:** § 7 nr. 4 omfatter også den som kjører inn fra sykkelveg, gangveg eller fortau. Det sier Finansklagenemndas gjengivelse av paragrafen: https://publisering.finkn.no/api/statements/openPDF/2021-460. Les hele nr. 4 på Lovdata før du lager oppgaver om det.

### B5. Rundkjøring – **Antakelse 1 i hovedsak bekreftet, antakelse 2 uklart**

- **Trafikkreglene:** Fant ingen egen regel om rundkjøring (bekrefter observasjonen din).
- **Skiltnormalen (N300 del 2, 2014, skilt 126):** «Forvarsling av rundkjøring skal skje med skiltkombinasjonen 202 ”Vikeplikt”/406 ”Påbudt rundkjøring”/802 ”Avstand”, eller med skilt 703.1 ”Diagramorienteringstavle for rundkjøring”.» Kilde: https://www.saferoad-traffic.no/uploads/hb-n300-del2.pdf
- **Vurdering:**
  1. Skilting med 202 er normalen for rundkjøringer. Kravet står i skiltnormalen (et krav til vegeier), ikke i trafikkreglene. *Det er skiltet som gir vikeplikt, ikke at det er en rundkjøring.* Uten skilt ville høyreregelen gjelde.
  2. «Ikke i konflikt»: Ingen kilde funnet. Det stemmer i øyeblikket bilene kjører inn. Men når den ene er inne, har den andre vikeplikt for den etter skilt 202.
- **Blinklys og feltvalg:** Ikke lest ordrett. Trafikkreglene § 14 (tegn) må leses før det lages oppgaver om dette. Kildene som ble funnet om blinklys i rundkjøring, er ikke offisielle.
- **Forslag:** Legg skilt 202 inn **eksplisitt** i hver rundkjøringsscene. Gjør det i stedet for at motoren antar at skiltet står der, så scenen og regelen henger sammen. Behandle «inne i rundkjøringen» som en egen posisjon som de som skal inn, viker for. Ikke lag oppgaver om blinklys i rundkjøring før § 14 er lest.

### B6. To møtende som begge svinger til venstre – **Uklart. Sett regelen på vent.**

- **Sitat (trafikkreglene § 6 nr. 4):** «Kjøretøyer som kommer fra motsatte retninger, kan svinges til venstre for hverandre.»
  Kilde: https://lovdata.no/nav/forskrift/1986-03-21-747/%C2%A76 (søketreff), og samme tekst hos https://lovdata.no/dokument/SF/forskrift/1986-03-21-747
- **Problemet:** Regelen *tillater* (kan) en bestemt måte å svinge på, men det er uklart hvilken. Leser man den bokstavelig, passerer to møtende biler vanligvis hverandre *til venstre*, venstre side mot venstre side. Det tilsvarer at de svinger **rundt / bak hverandre** gjennom krysset, ikke *foran* hverandre. Det kan altså være det motsatte av det motoren antar. Ingen offisiell kilde som forklarer bestemmelsen med figur ble funnet. Kildene som sier «svinge foran hverandre», er forum, ikke offisielle.
- **Forslag:**
  - Fjern eller deaktiver scener der to møtende begge svinger til venstre, til tolkningen er avklart.
  - Avklar med en trafikkskole, læreverket «Veien til førerkortet» eller kommentarutgaven til trafikkreglene.
  - Uansett tolkning er § 6 nr. 4 en *kan*-regel. Motoren bør ikke gjøre den til en *skal*-regel.

---

### C. Skiltforklaringer

| Skilt | Funn | Konklusjon og forslag |
|---|---|---|
| **208** Slutt på forkjørsveg | «Skiltet angir at forkjørsveg er slutt.» Det brukes «på veg som slutter foran kryss med veg som ikke er forkjørsveg, eller på fri vegstrekning». (N300-tekst via https://trafikksiden.motocross.io/trafikkskilt/trafikkskilt.html) | **Bekreftet i hovedsak.** Appens tillegg om høyreregelen er en slutning, ikke ordlyd. Behold, men merk i `todo` at setningen er slutning. |
| **126** Rundkjøring | «Skiltet varsler om rundkjøring.» (samme kilde). N300: brukes bare **unntaksvis**, i tillegg til 202/406/802 (se B5). | **Bekreftet.** Legg gjerne til i forklaringen: «Skiltet er sjeldent. Vanligvis varsles rundkjøring med vikepliktskilt og skilt 406.» |
| **132** Trafikklyssignal | Ordlyden ble ikke funnet. Navnet er bekreftet. | **Uklart.** Les § 4 på Lovdata. |
| **139** Sporvogn | N300 (2007): «Skilt 139 brukes til å varsle om sporvogn i blandet trafikk.» | **Første del bekreftet. «Trikken har fri veg» er for kategorisk** (se A5/B1). Forslag: «Trikk har som hovedregel fri veg (trafikkreglene § 10 nr. 2).» |
| **406** Påbudt rundkjøring | Ordlyden ble ikke funnet. Navnet er bekreftet. | **Uklart.** «Mot klokka» er riktig ut fra skiltets symbol og høyretrafikk, men les § 10 på Lovdata før `verified`. |

**Offisielle navn** – alle 12 er sett i skiltforskriften eller skiltnormalen: 202 Vikeplikt, 204 Stopp, 206 Forkjørsveg, 208 Slutt på forkjørsveg, 210 Forkjørskryss, 212 Vikeplikt overfor møtende kjørende, 124 Farlig vegkryss, 126 Rundkjøring, 132 Trafikklyssignal, 139 Sporvogn, 406 Påbudt rundkjøring, 516 Gangfelt. **Bekreftet.**
- 124, ordlyd: «Skiltet varsler om farlig vegkryss hvor det gjelder vanlig vikeplikt for trafikk fra høyre» (1980-forskriften). Vegvesen.no bruker «overfor kjørende fra høyre». Bruk gjeldende Lovdata-tekst.

**516 Gangfelt – H og V:**
- Store norske leksikon viser begge variantene, «Trafikkskilt 516.H: Gangfelt» og «Trafikkskilt 516.V: Gangfelt». Betydning: «Skiltet opplyser om at det er kryssingsstad for gåande på staden, og at reglane i trafikklovgivinga om gangfelt gjeld.» Kilde: https://snl.no/Gangfelt_-_trafikkskilt
- *Slutning:* H/V betyr etter alt å dømme høyre/venstre (speilvendt figur etter hvilken side av vegen skiltet står). Vegvesenets datakatalog bruker samme mønster for andre skilt, for eksempel «713.V – Vanlig vegviser, Venstre». Kilde: https://tfprod1.sintef.no/datakatalog/eksport/produktspesifikasjon/97.pdf. Ikke bekreftet for 516 spesielt.
- **Forslag:** Begge er offisielle. Bruk 516.H som standard i skiltquiz (skilt på høyre side av vegen). Godta begge i scener.

---

### D. Åpne punkter

**D1. Vegtrafikkloven § 21 – ordlyd funnet**
- **Sitat (første ledd):** «Ingen må føre eller forsøke å føre kjøretøy når han er i en slik tilstand at han ikke kan anses skikket til å kjøre på trygg måte, hva enten dette har sin årsak i at han er påvirket av alkohol eller annet berusende eller bedøvende middel, eller i at han er syk, svekket, sliten eller trett, eller skyldes andre omstendigheter.»
  Kilde: https://lovdata.no/nav/lov/1965-06-18-4/kapIV/%C2%A727 (søketreff, § 21 vises i kapitteloversikten)
- **Merk:** Resten av § 21 handler om forskrifter for kjøre- og hviletid (ikke relevant for klasse B-teori).
- **Viktig for øvelseskjøringsmodulen:** Ledsager regnes som fører, men § 21 gjelder **også for eleven**. Vegtrafikkloven: «Ved øvingskjøring anses lærer eller ledsager som fører av motorvognen.» Og: «… §§ 21, 22 og 22 a, gjelder likevel også for eleven.» Kilde: https://trafikksiden.motocross.io/regelverk/Vegtrafikkloven.html (speiling – sjekk paragrafnummeret på Lovdata).
- **Forslag:** Kontroller at temaet `lr-vtl-3-21` handler om *skikkethet* (rus, sykdom, trøtthet). Hvis det er tenkt som generelle førerplikter, bør det endres.

**D2. «Forbud på offentlig veg» – Uklart**
- Ingen kilde funnet som forklarer hva temaet omfatter. Tolkningen din er rimelig, men ikke bekreftet.
- **Forslag:** La temaet stå med `verified: false`. Spør en trafikkskole, eller send en henvendelse til Statens vegvesen via vegvesen.no/kontakt-oss.

**D3. Temalisten mot læreplanens trinn – Ikke utført**
- Krever `docs/PLAN-fase0.md` og læreplanen side om side. Ingen av dem var tilgjengelig i denne økten. Læreplanen (Håndbok V851 / tidligere 252) er en PDF fra Statens vegvesen. Ta dette i en Claude Code-økt med repoet åpent.

---

### Neste steg for Trond

1. Les Lovdata selv for: skiltforskriften § 24 (gult blink) og § 25, trafikkreglene § 6 nr. 4 og § 7 nr. 4 (hele), og skiltforskriften § 4 (132) og § 10 (406).
2. Avklar B6 med trafikkskole eller læreverk.
3. Gi Claude Code klarsignal til endringene i B1, B2, B5 og skilt 139.
4. Sett `verified: true` på A1–A4 og B3–B4 når du er fornøyd.
