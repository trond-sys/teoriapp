# Revisjon av vikeplikt-scenene

**Laget:** 2026-11-22 med `npm run audit-scenes` (Endring 01, steg 5).
**Scener:** 11. **Uenige med motoren:** 0.

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
| `vp-scene-forkjorsveg-01` | nei | B → C → A | B → C → A | ja |
| `vp-scene-gardsveg-01` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-01` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-02` | nei | B → A | B → A | ja |
| `vp-scene-hoyreregel-03` | nei | C → B → A | C → B → A | ja |
| `vp-scene-hoyreregel-04` | nei | B → A | B → A | ja |
| `vp-scene-parkering-01` | nei | B → A | B → A | ja |
| `vp-scene-parkering-02` | nei | B + C → A | B + C → A | ja |
| `vp-scene-venstre-venstre-01` | nei | A + B | A + B | ja |
| `vp-scene-venstresving-01` | nei | B + C → A | B + C → A | ja |

## Merknader per scene

Ingen merknader.
