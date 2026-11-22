# Kildekontroll av vikeplikt-innholdet (22.11.2026)

Trond ba om et nytt, utvidet søk, også i forum der slike situasjoner diskuteres. Alt jeg var usikker på, skulle sjekkes. Dette dokumentet viser hva jeg sjekket, hva jeg fant, og hva som er endret i appen.

Alt innhold har fortsatt `verified: false`. Det er Trond som godkjenner, på `/review`.

## Kort oppsummert

- **Lovteksten er lest ordrett på Lovdata (22.11.2026):** trafikkreglene, skiltforskriften og vegtrafikkloven § 2. Tidligere var flere av paragrafene bare lest via søketreff.
- **Alle 50 sitater** i scener, oppgaver og skilt er sjekket maskinelt mot Lovdata-teksten. **50 av 50 står ordrett.** Ett sitat (skilt 208) kom fra skiltnormalen og er byttet ut, se under.
- **Ingen fasit måtte endres.** Ingen scene fikk ny rekkefølge eller nytt ja/nei-svar.
- **Rettet:**
  - Hjemmelen i én scene (buss ved 80 km/t).
  - Kilden i én scene (skilt 208).
  - Forklaringene i to oppgaver og to skilt (stoppskilt og trikk).
  - Én setning i én scene (venstresving-01).
  - Thai-teksten er endret i de samme seks: buss-02, venstresving-01, vikeplikt-013, vikeplikt-020, skilt 204 og skilt 139. Den må leses på nytt.
- **Fortsatt en tolkning:** to møtende biler som begge svinger til venstre (venstre-venstre-01). Lovteksten og forum støtter fasiten, men ingen offisiell kilde viser det med figur.

## Om sykler og motorsykler

Trond spurte: «Tror ikke sykler blir sett på som motorsykler?» **Det stemmer, sykkel er ikke motorsykkel.** Men sykkel er et **kjøretøy**, og det er det høyreregelen bruker:

- **Vegtrafikkloven § 2:** «Med kjøretøy forstås innretning som er bestemt til å kjøre på bakken uten skinner. Med motorvogn forstås kjøretøy som blir drevet fram med motor.» En sykkel er altså kjøretøy, men ikke motorvogn.
- **Trafikkreglene § 5 nr. 1:** «Sykkel eller annet kjøretøy som ikke er motorvogn, kan kjøres på vegens høyre skulder.» Her kaller forskriften selv sykkelen et kjøretøy.
- **Trafikkreglene § 7 nr. 2:** «Kjørende har vikeplikt for kjøretøy som kommer fra høyre.» Ordet er *kjøretøy*, ikke *motorvogn*.
- **Statens vegvesen:** «Sykler du i kjørebanen eller i sykkelfeltet, skal du følge vikepliktsreglene for kjørende.» Og: «Syklende regnes som kjørende».
- **Eteo.no (teorinettsted):** «En syklist på kjørebanen kommer fra høyre – Du viker.» Under misforståelser: «Høyreregelen gjelder bare for biler.» – «Den gjelder alle kjøretøy, også sykler.»
- **Olav Torvund (jusprofessor, blogg 2014):** «Syklister er kjørende. Det sies faktisk ikke uttrykkelig i trafikkreglene, men det fremgår klart av f.eks. § 4 nr 1 …» Han skriver også at bilister har vikeplikt for syklister som kommer fra høyre.

**Viktig forskjell, som også står i appen:** En syklist som kommer **fra sykkelveg, gangveg eller fortau**, har selv vikeplikt (trafikkreglene § 7 nr. 4 annet ledd). Og en syklist som **sykler over et gangfelt**, har vikeplikt for bilene. Går hen av sykkelen, er hen gående, og da har bilene vikeplikt (Statens vegvesen).

## Punkt for punkt

| Punkt | Konklusjon | Hovedkilde | Endret i appen |
|---|---|---|---|
| Skiltforskriften § 24 (lys) | Lest ordrett. Sitatene stemmer. | Lovdata | Bare `todo` |
| Skiltforskriften § 25 (politi) | Lest ordrett. Sitatene stemmer. | Lovdata | `source` og `todo` i vikeplikt-012 |
| Politi foran trafikklys | Bekreftet. § 3 nr. 1 kaller trafikklys en «anvisning», og § 3 nr. 2 sier at politiet går foran «anvisning gitt på annen måte». | Lovdata | Forklaringen i vikeplikt-013 viser nå koblingen |
| Stoppskilt gir vikeplikt | Bekreftet ordrett. Teksten til skilt 204 sier at du «har vikeplikt for kjørende trafikk i begge retninger på kryssende veg». | Lovdata | vikeplikt-020 og skilt 204: «i begge retninger» er lagt til, og kilden er bare 204 |
| Sykkel er kjøretøy, syklist er kjørende | Bekreftet (se over) | vtl. § 2, trafikkreglene § 5, Statens vegvesen | Bare `todo` |
| Høyreregelen i T-kryss | Bekreftet. Ingen unntak i § 7 nr. 2. Eteo har nøyaktig dette eksemplet. | Lovdata, eteo.no, diskusjon.no | Bare `todo` |
| Tre biler i kjede (høyreregel-03) | Bekreftet. Eteo: «Bil 1 har ingen fra høyre og kjører først. Deretter kjører du, og bil 3 til slutt.» | eteo.no | Bare `todo` |
| Gult blink betyr at skiltene gjelder | Bekreftet. Statens vegvesen: «Er trafikklyset ute av drift, gjelder eventuelt vikepliktsskilt eller høyreregelen.» | Statens vegvesen, N303, diskusjon.no | Bare `todo` |
| Grønn pil betyr at møtende har rødt | Bekreftet i signalnormalen. Forskriften sier det ikke selv. | N303 (2014) pkt. 4.3.2, diskusjon.no | Bare `todo` |
| Buss ved 80 km/t | Bussen har vikeplikt. **Hjemmelen er § 7 nr. 4** («holdeplass» står ordrett), ikke § 8 nr. 1. | Lovdata | **Ny hjemmel og ny forklaring i buss-02** |
| Buss ved 60 km/t | Sitatet er ordrett. Statens vegvesen: vikeplikten gjelder også uten blinklys når det er klart at bussen skal ut. | Lovdata, Statens vegvesen | Bare `todo` |
| Gående i gangfelt viker for trikk | Bekreftet. Statens vegvesen: «Fotgjengere i gangfelt uten lysregulering skal vente til trikken har passert før de krysser gata.» | Statens vegvesen | Bare `todo` |
| Trikk og skilt/lys (vikeplikt-015) | Trikken må følge lys og skilt, og har vikeplikt inn i rundkjøring og inn på forkjørsveg. Oppgaven gjelder kryss uten skilt og lys, så den stemmer. | Statens vegvesen | `todo`. **Skilt 139:** «Trikken har fri veg» er endret til «Som hovedregel har trikken fri veg, men trikken må selv følge trafikklys og skilt.» |
| Trikk viker for utrykning | Bekreftet ordrett: § 10 nr. 4 «Nr. 1 og 3 i denne paragraf gjelder også for fører av sporvogn.» | Lovdata | Ingen |
| Rundkjøring | Bekreftet. Ingen egen regel i trafikkreglene. Vikeplikten kommer fra skilt 202. Uten skilt ville høyreregelen gjelde. | Statens vegvesen, Store norske leksikon | Bare `todo` |
| Syklist inne i rundkjøring | Bekreftet. Statens vegvesen: «Når du sykler inn i en rundkjøring, har du vikeplikt for trafikken som er i rundkjøringen.» | Statens vegvesen | Bare `todo` |
| Parkering viker også for den med vikepliktskilt (parkering-01) | Bekreftet. § 7 nr. 4 har ingen unntak. Eteo: «Unntaket for utkjøring virker begge veier.» | Lovdata, Statens vegvesen, eteo.no | Bare `todo` |
| Skilt 208 | Forskriften har **bare tittelen**. Scenen bruker nå teksten til skilt 206 (ordrett): forkjørsvegen gjelder «til det blir opphevet med skilt 208». | Lovdata, eteo.no | **Ny kilde i skilt-208-01** |
| Skilt 126, 132, 139 og 406 | Forskriften har **bare tittelen**, ingen egen tekst. Det finnes altså ikke mer å lese der. | Lovdata | `todo` |
| Venstresving: C fra høyre som svinger til høyre (venstresving-01) | A har formelt vikeplikt for C, men banene krysser ikke, og A kjører uansett sist. | Lovdata § 7 nr. 1 og 2, Kvinneguiden | Forklaringen nevner nå C |
| To møtende som begge svinger til venstre | **Tolkning, se under.** | Lovdata § 6 nr. 4 og § 7 nr. 2, Kvinneguiden | Bare `todo` |
| Sitater «satt sammen av to deler» (§ 7 nr. 3, § 7 nr. 5, § 9 nr. 2, § 11 nr. 1) | Alle står ordrett som hele setninger på Lovdata. | Lovdata | Bare `todo` |

## Det som fortsatt er en tolkning

**To møtende som begge svinger til venstre (vp-scene-venstre-venstre-01).**
- Lovdata, trafikkreglene § 6 nr. 4: «Kjøretøyer som kommer fra motsatte retninger, kan svinges til venstre for hverandre.»
- § 7 nr. 2 annet punktum gir vikeplikt bare når den som svinger til venstre, «vil få kjøretøy på sin høyre side». Når de svinger til venstre for hverandre, får ingen av dem den andre på høyre side. Derfor må ingen vente.
- Forumtråd på Kvinneguiden (2023): «dere har vikeplikt for hverandre, men kan begge kjøre Hvis dere ikke hindrer hverandre.»
- Den gamle forskriften fra 1957 hadde et forbehold («når dette kan skje uten fare eller ulempe»). Det står ikke i dagens tekst.
- Jeg fant ingen offisiell kilde som viser dette med figur. Fasiten («de kan kjøre samtidig») er rimelig, men les den med dette i bakhodet. Scenen tegner bevisst ikke hvordan bilene passerer hverandre.

**Andre forbehold:**
- **Signalnormalen N303** er utgaven fra 2014. Det kan finnes en nyere utgave.
- **Eteo.no** er et kommersielt teorinettsted, ikke en offentlig kilde. Det er brukt som støtte der Lovdata og Statens vegvesen ikke sier det rett ut.
- **Forumsvar** er brukt for å se hvordan folk forstår reglene, ikke som hjemmel.
- **Lovdatas søkeside** stopper automatiske forespørsler. Den er ikke brukt. Dokumentsidene ble lest i nettleseren og lastet ned én gang hver.

## Kilder

**Lovtekst (lest 22.11.2026):**
- Trafikkreglene: https://lovdata.no/dokument/SF/forskrift/1986-03-21-747
- Skiltforskriften: https://lovdata.no/dokument/SF/forskrift/2005-10-07-1219
- Vegtrafikkloven: https://lovdata.no/dokument/NL/lov/1965-06-18-4

**Statens vegvesen:**
- Vikepliktsregler når du sykler: https://www.vegvesen.no/trafikkinformasjon/trafikksikkerhet/trafikkregler/vikeplikt/vikeplikt-for-syklister/
- Vikeplikt for buss og trikk: https://www.vegvesen.no/trafikkinformasjon/trafikksikkerhet/trafikkregler/vikeplikt/vikeplikt-og-trikk/
- Vikeplikt i ulike trafikksituasjoner: https://www.vegvesen.no/trafikkinformasjon/trafikksikkerhet/trafikkregler/vikeplikt/vikeplikt-ulike-trafikksituasjoner/
- Håndbok N303 Trafikksignalanlegg (2014): https://www.vegvesen.no/globalassets/fag/handboker/hb-n303.pdf
  - pkt. 4.3.2: grønt pilsignal
  - pkt. 4.7.10: gult blink
  - pkt. 4.5: skilt 202 over lyshodet

**Fagkilder:**
- Eteo, vikeplikt fra høyre: https://eteo.no/teori/bil/regler/vikeplikt-fra-hoyre-eksempler/
- Olav Torvund, «Syklister og vikeplikt»: https://blogg.torvund.net/2014/04/25/syklister-og-vikeplikt/
- Store norske leksikon, vikeplikt: https://snl.no/vikeplikt

**Forum:**
- Diskusjon.no, grønn pil: https://www.diskusjon.no/topic/1567968-man-har-vel-ikke-vikeplikt-for-noen-n%C3%A5r-man-har-gr%C3%B8nn-pil/
- Diskusjon.no, gult blink på forkjørsveg: https://www.diskusjon.no/topic/1046294-blinkendegule-lyskryss-p%C3%A5-forkj%C3%B8rsvei/
- Diskusjon.no, høyreregel i T-kryss: https://www.diskusjon.no/topic/1232715-nok-en-evig-gjelder-h%C3%B8yreregelen-i-dette-krysset-diskusjon/
- Kvinneguiden, vikeplikt i kryss (venstre-venstre): https://forum.kvinneguiden.no/topic/1695668-vikeplikten-i-kryss-hjelp-meg-litt/
- Kvinneguiden, møtende som svinger samme veg: https://forum.kvinneguiden.no/topic/642741-vikeplikt-n%C3%A5r-man-m%C3%B8ter-motg%C3%A5ende-som-skal-svinge-i-samme-retningkryss/

## Slik ble sitatene sjekket

1. Lovdata-dokumentene ble lastet ned én gang.
2. Et skript (i økten, ikke i repoet) fjernet HTML og sammenlignet hvert `source.quote` i `src/content/` med teksten. Store og små bokstaver, mellomrom og anførselstegn ble ikke tatt hensyn til.
3. Resultat: **50 av 50 sitater står ordrett.**
