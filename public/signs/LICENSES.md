# Skiltgrafikk – kilde og lisens

Skiltbildene kommer fra Statens vegvesens offisielle skiltfiler:
https://www.vegvesen.no/fag/veg-og-gate/trafikkskilt-og-vegoppmerking/filer-og-fargekoder-for-trafikkskilt/

Inneholder data under Norsk lisens for offentlige data (NLOD) 2.0, tilgjengeliggjort av Statens vegvesen.
Lisens: https://data.norge.no/nlod/no/2.0 (datasett: https://data.norge.no/en/datasets/62cd16c5-91ad-3083-8f56-cef0d7bd18de).

Filene er konvertert fra CMYK-JPG til sRGB-PNG (maks 480 px, hvit kant fjernet) med `npm run import-signs`.
Skiltnummer følger skiltforskriften. Tabellen lages av `node scripts/write-licenses.mjs` ut fra src/content/signs.json.

| Fil | Skilt | Zip-fil hos vegvesen.no | Kilde | Lisens |
|---|---|---|---|---|
| 202.png | 202 Vikeplikt | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 204.png | 204 Stopp | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 206.png | 206 Forkjørsveg | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 208.png | 208 Slutt på forkjørsveg | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 210.png | 210 Forkjørskryss | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 212.png | 212 Vikeplikt overfor møtende kjørende | vikeplikt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 124.png | 124 Farlig vegkryss | fareskilt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 126.png | 126 Rundkjøring | fareskilt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 132.png | 132 Trafikklyssignal | fareskilt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 139.png | 139 Sporvogn | fareskilt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 406.png | 406 Påbudt rundkjøring | pabudsskilt-jpg.zip | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
| 516.png | 516 Gangfelt | opplysningsskilt-jpg.zip (variant H) | Statens vegvesen | NLOD 2.0 (Norsk lisens for offentlige data) |
