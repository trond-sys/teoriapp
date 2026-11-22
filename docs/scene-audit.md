# Revisjon av vikeplikt-scenene

**Laget:** 2026-11-22 med `npm run audit-scenes` (Endring 01, steg 5).
**Scener:** 41. **Uenige med motoren:** 9.

Rapporten sammenligner fasiten i hver scene (`src/content/scenes/`) med den gamle regelmotoren (`scripts/audit/engine.ts`).
Den er et hjelpemiddel når scenene kontrolleres, **ikke en dommer**: fasiten i scenen gjelder alltid.

**Kjente svakheter i motoren** (fra `docs/TODO-kontroll-batch1.md`), så enighet er ikke bevis:
- B1: Motoren gir trikken alltid fri veg, også mot trafikklys og når trikken svinger mot grønn fotgjenger. Det er feil i de to tilfellene.
- B2: Motoren lar alle vike for utrykning, også trafikanter som ikke er i vegen.
- B5: Motoren antar vikepliktskilt ved alle innkjøringer til rundkjøring, og at to som kjører inn fra ulike armer, ikke er i konflikt.
- B6: Motoren regner to møtende venstresvingere som uten konflikt. Det samme gjør den geometriske kontrollen, med hjemmel i § 6 nr. 4.
- Motoren kjenner ikke trafikklys, politi, buss fra holdeplass eller andre skilt enn 202, 204 og 206.

## Oversikt

| Scene | Verifisert | Fasit | Motor | Enig |
|---|---|---|---|---|
| `vp-scene-bensinstasjon-01` | nei | B → A | B → A | ja |
| `vp-scene-buss-01` | nei | B → A | feil: A og B kommer fra samme arm (kø støttes ikke) | **nei** |
| `vp-scene-buss-02` | nei | A → B | feil: A og B kommer fra samme arm (kø støttes ikke) | **nei** |
| `vp-scene-forkjorsveg-01` | nei | B → C → A | B → C → A | ja |
| `vp-scene-gangfelt-01` | nei | P → A | P → A | ja |
| `vp-scene-gardsveg-01` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-01` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-02` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-03` | nei | C → B → A | C → B → A | ja |
| `vp-scene-hoyreregel-04` | nei | B → A | B → A | ja |
| `vp-scene-hoyresving-syklist-01` | nei | B → A | feil: A og B kommer fra samme arm (kø støttes ikke) | **nei** |
| `vp-scene-lys-01` | nei | B → A | B → A | ja |
| `vp-scene-lys-02` | nei | B → A | A → B | **nei** |
| `vp-scene-lys-03` | nei | A → B | B → A | **nei** |
| `vp-scene-lys-04` | nei | B → A | B → A | ja |
| `vp-scene-lys-05` | nei | A → B | B → A | **nei** |
| `vp-scene-parkering-01` | nei | B → A | B → A | ja |
| `vp-scene-parkering-02` | nei | B + C → A | B + C → A | ja |
| `vp-scene-politi-01` | nei |  | A | ja |
| `vp-scene-politi-02` | nei | B → A | A → B | **nei** |
| `vp-scene-politi-03` | nei |  | A | ja |
| `vp-scene-rundkjoring-01` | nei | B → A | B → A | ja |
| `vp-scene-rundkjoring-02` | nei | A → B | A → B | ja |
| `vp-scene-rundkjoring-03` | nei | C → A | C → A | ja |
| `vp-scene-rygging-01` | nei | B → A | feil: A: ugyldig «to» | **nei** |
| `vp-scene-rygging-02` | nei |  | feil: A: ugyldig «to» | **nei** |
| `vp-scene-skilt-202-01` | nei | B → A | B → A | ja |
| `vp-scene-skilt-204-01` | nei |  | A | ja |
| `vp-scene-skilt-206-01` | nei | A → B | A → B | ja |
| `vp-scene-skilt-208-01` | nei | B → A | B → A | ja |
| `vp-scene-skilt-210-01` | nei | A → B | A → B | ja |
| `vp-scene-sykkelveg-01` | nei | B → A | B → A | ja |
| `vp-scene-sykkelveg-02` | nei | A → B | A → B | ja |
| `vp-scene-trikk-01` | nei | T → A | T → A | ja |
| `vp-scene-trikk-gangfelt-01` | nei | T → P | T → P | ja |
| `vp-scene-utrykning-01` | nei | U → A | U → A | ja |
| `vp-scene-utrykning-trikk-01` | nei | U → T | U → T | ja |
| `vp-scene-venstre-venstre-01` | nei | A + B | A + B | ja |
| `vp-scene-venstresving-01` | nei | B + C → A | B + C → A | ja |
| `vp-scene-venstresving-02` | nei | B → A | B → A | ja |
| `vp-scene-venstresving-syklist-01` | nei | B → A | B → A | ja |

## Merknader per scene

### `vp-scene-buss-01` – uenig
- Buss fra holdeplass (§ 7 nr. 5) finnes ikke i motoren.
- Flere trafikanter kommer fra samme arm. Motoren støtter ikke det.

### `vp-scene-buss-02` – uenig
- Buss fra holdeplass (§ 7 nr. 5) finnes ikke i motoren.
- Flere trafikanter kommer fra samme arm. Motoren støtter ikke det.

### `vp-scene-hoyresving-syklist-01` – uenig
- Flere trafikanter kommer fra samme arm. Motoren støtter ikke det.

### `vp-scene-lys-01`
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.

### `vp-scene-lys-02` – uenig
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.
- Etter motoren bryter fasitens rekkefølge disse vikepliktene: B før A (Trafikkreglene § 7 nr. 2 første punktum).
- Motoren mener B viker for A (regel «hoyreregel», Trafikkreglene § 7 nr. 2 første punktum), men fasiten har ikke dette steget.
- Fasiten sier A viker for B, men motoren finner ingen vikeplikt mellom dem.

### `vp-scene-lys-03` – uenig
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.
- Etter motoren bryter fasitens rekkefølge disse vikepliktene: A før B (Trafikkreglene § 3 nr. 1 (skilt går foran trafikkreglene); skiltforskriften § 6, skilt 202 Vikeplikt, 204 Stopp og 206 Forkjørsveg).
- Motoren mener A viker for B (regel «skilt», Trafikkreglene § 3 nr. 1 (skilt går foran trafikkreglene); skiltforskriften § 6, skilt 202 Vikeplikt, 204 Stopp og 206 Forkjørsveg), men fasiten har ikke dette steget.
- Fasiten sier B viker for A, men motoren finner ingen vikeplikt mellom dem.

### `vp-scene-lys-04`
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.

### `vp-scene-lys-05` – uenig
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.
- Etter motoren bryter fasitens rekkefølge disse vikepliktene: A før B (Trafikkreglene § 7 nr. 2 annet punktum).
- Motoren mener A viker for B (regel «venstresving», Trafikkreglene § 7 nr. 2 annet punktum), men fasiten har ikke dette steget.
- Fasiten sier B viker for A, men motoren finner ingen vikeplikt mellom dem.

### `vp-scene-politi-01`
- Scenen har politi. Motoren kjenner ikke politiets tegn.

### `vp-scene-politi-02` – uenig
- Scenen har politi. Motoren kjenner ikke politiets tegn.
- Etter motoren bryter fasitens rekkefølge disse vikepliktene: B før A (Trafikkreglene § 7 nr. 2 første punktum).
- Motoren mener B viker for A (regel «hoyreregel», Trafikkreglene § 7 nr. 2 første punktum), men fasiten har ikke dette steget.
- Fasiten sier A viker for B, men motoren finner ingen vikeplikt mellom dem.

### `vp-scene-politi-03`
- Scenen har trafikklys. Motoren kjenner ikke lys, så sammenligningen gjelder bare uten lys.
- Scenen har politi. Motoren kjenner ikke politiets tegn.

### `vp-scene-rygging-01` – uenig
- Scenen har rygging. Motoren kjenner ikke rygging.

### `vp-scene-rygging-02` – uenig
- Scenen har rygging. Motoren kjenner ikke rygging.

### `vp-scene-skilt-208-01`
- Motoren leser bare skilt 202, 204 og 206. Andre skilt i scenen er ikke med.

### `vp-scene-skilt-210-01`
- Motoren leser bare skilt 202, 204 og 206. Andre skilt i scenen er ikke med.
