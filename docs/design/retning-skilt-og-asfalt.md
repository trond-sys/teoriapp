# Designretning: «Skilt og asfalt» (valgt av Trond 22.11.2026)

Gjelder hele appen (Operate-flate: en øvingsapp hun bruker hver dag). Dette er et utviklingsnotat. Det skal ikke kopieres inn i kildekoden.

## Direction contract

**THESIS:** Appen ser ut som det hun skal lære, altså norske vegskilt og vegoppmerking. Den ser ikke ut som en grå og hvit quiz-app med én blåfarge. Skiltfargene gjør faktiske jobber: navigasjon, valg, riktig og galt.

**OWN-WORLD:**
- **Farger:**
  - Skiltblått sidefelt med en tynn hvit innerkant, som et opplysningsskilt.
  - Asfaltgrått for tekst og tegninger.
  - Signalgult for valgt svar og fokus.
  - Skiltrødt for galt og grønt for riktig.
- **Svaralternativer:** plater med kraftig kant og en kvadratisk bokstavplate.
- **Skrift:** Atkinson Hyperlegible for latinsk skrift, som er laget for å være lett å lese, og Noto Sans Thai for thai.
- **Lys modus:** kald, lys grå grunn med hvite flater.
- **Mørk modus:** asfaltsort grunn og dypere skiltblått. Den følger nettbrettets innstilling, siden hun øver om kvelden i sofaen.

**STORY:** Hun åpner appen om kvelden og ser dagens økt. Hun svarer på oppgaver med en vegtegning ved siden av, og får forklaringen på tre språk med thai på trykk. Hun skal forstå situasjonen av tegningen før hun leser alternativene.

**FIRST VIEWPORT:** Nettbrett liggende (1707 × 1067):
- Skiltblått sidefelt til venstre (240 px).
- Oppgaveflaten har vegtegningen til venstre (omtrent 45 %) og spørsmålet med svarplatene til høyre.
- Øverst ligger fremdriften som en stiplet midtlinje.
- «Neste» står nederst til høyre.
- Stående og på telefon: tegningen øverst, svarene under, og bunnfaner i skiltblått.

**FORM:** Kodeledet bygg. Skjelettet er standard app-mønstre: sidefelt eller bunnfaner, kort, knapper og lister. Signaturen er **fremdriften som vegens midtlinje**: én strek per oppgave som fylles etter hvert som hun svarer. Grønn strek betyr riktig, rød betyr galt, og den aktive streken er gul. seed: none (unavailable). Designverktøyets terningkast fantes ikke på maskinen, og Trond valgte retningen blant tre forslag.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
