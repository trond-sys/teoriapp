// REVISJONSVERKTØY (Endring 01, steg 5). Den gamle regelmotoren brukes bare av scripts/audit-scenes.ts for å
// lage docs/scene-audit.md. Den avgjør ikke noe i appen. Slettes når alle kjernescener er verifisert.
// Vikepliktsreglene motoren bruker, med hjemmel. Forrangen er rekkefølgen i RULE_ORDER.
// Hjemlene er lest på Lovdata 21.11.2026 (forskrift om kjørende og gående trafikk, FOR-1986-03-21-747,
// sist endret FOR-2022-06-17-1049). Regler merket verified: false må kontrolleres av Trond.
import type { L3 } from '../../src/content/schema';

export type RuleId =
  | 'utrykning'
  | 'sporvogn'
  | 'gangfelt'
  | 'rundkjoring'
  | 'avkjorsel'
  | 'skilt'
  | 'venstresving'
  | 'hoyreregel';

export interface Rule {
  id: RuleId;
  source: string;
  sourceUrl: string;
  verified: boolean;
  todo?: string;
  /** Kort forklaring som vises når eleven bryter regelen. «{a}» viker for «{b}». */
  why: L3;
}

const LOVDATA_TR = 'https://lovdata.no/dokument/SF/forskrift/1986-03-21-747';

export const RULES: Record<RuleId, Rule> = {
  utrykning: {
    id: 'utrykning',
    source: 'Trafikkreglene § 10 nr. 1 (og nr. 4 for sporvogn)',
    sourceUrl: LOVDATA_TR,
    verified: false,
    why: {
      nb: '{a} må gi fri veg for utrykningskjøretøyet {b}, som har blått blinklys.',
      en: '{a} must give way to the emergency vehicle {b}, which has flashing blue lights.',
      th: '{a} ต้องหลีกทางให้รถฉุกเฉิน {b} ที่เปิดไฟกะพริบสีน้ำเงิน',
    },
  },
  sporvogn: {
    id: 'sporvogn',
    source: 'Trafikkreglene § 10 nr. 2',
    sourceUrl: LOVDATA_TR,
    verified: false,
    todo: 'Motoren lar trikken alltid ha fri veg (også overfor gående). Gjelder det også når trikken har vikepliktskilt mot seg? Scener med skilt mot trikken lages ikke før dette er avklart.',
    why: {
      nb: '{a} må gi fri veg for trikken {b}.',
      en: '{a} must give way to the tram {b}.',
      th: '{a} ต้องหลีกทางให้รถราง {b}',
    },
  },
  gangfelt: {
    id: 'gangfelt',
    source: 'Trafikkreglene § 9 nr. 2',
    sourceUrl: LOVDATA_TR,
    verified: false,
    why: {
      nb: '{a} har vikeplikt for {b}, som går over i gangfeltet.',
      en: '{a} must give way to {b}, who is crossing at the pedestrian crossing.',
      th: '{a} ต้องให้ทางแก่ {b} ที่กำลังข้ามทางม้าลาย',
    },
  },
  rundkjoring: {
    id: 'rundkjoring',
    source: 'Skilt 202 Vikeplikt ved innkjøringene (skiltforskriften § 6) og trafikkreglene § 3 nr. 1; trafikkreglene har ingen egen regel om rundkjøring',
    sourceUrl: LOVDATA_TR,
    verified: false,
    todo: 'Motoren antar at alle innkjøringer til rundkjøringen har vikepliktskilt, og at to som kjører inn fra ulike armer ikke er i konflikt.',
    why: {
      nb: '{a} skal inn i rundkjøringen og har vikeplikt for {b}, som allerede kjører i rundkjøringen.',
      en: '{a} is entering the roundabout and must give way to {b}, which is already in the roundabout.',
      th: '{a} กำลังจะเข้าวงเวียนและต้องให้ทางแก่ {b} ที่อยู่ในวงเวียนแล้ว',
    },
  },
  avkjorsel: {
    id: 'avkjorsel',
    source: 'Trafikkreglene § 7 nr. 4',
    sourceUrl: LOVDATA_TR,
    verified: false,
    why: {
      nb: '{a} kommer fra en avkjørsel (parkeringsplass, gårdsveg eller liknende) og har vikeplikt for all annen trafikk, også {b}.',
      en: '{a} is coming out of a driveway or parking area and must give way to all other traffic, including {b}.',
      th: '{a} ออกมาจากทางเข้าออก (ที่จอดรถ ทางเข้าบ้าน หรือคล้ายกัน) และต้องให้ทางแก่ผู้ใช้ถนนอื่นทั้งหมด รวมถึง {b}',
    },
  },
  skilt: {
    id: 'skilt',
    source: 'Trafikkreglene § 3 nr. 1 (skilt går foran trafikkreglene); skiltforskriften § 6, skilt 202 Vikeplikt, 204 Stopp og 206 Forkjørsveg',
    sourceUrl: LOVDATA_TR,
    verified: false,
    todo: 'Skilt 204 Stopp: teksten om stans er lest ordrett, men ikke en egen setning om vikeplikt. Motoren gir 204 samme vikeplikt som 202 (jf. skilt 206: sideveg er «pålagt vikeplikt» med 202 eller 204).',
    why: {
      nb: '{a} har vikepliktskilt eller stoppskilt og må vike for {b}.',
      en: '{a} has a give way sign or stop sign and must give way to {b}.',
      th: '{a} มีป้ายให้ทางหรือป้ายหยุด จึงต้องให้ทางแก่ {b}',
    },
  },
  venstresving: {
    id: 'venstresving',
    source: 'Trafikkreglene § 7 nr. 2 annet punktum',
    sourceUrl: LOVDATA_TR,
    verified: false,
    why: {
      nb: '{a} skal svinge til venstre og får {b} på sin høyre side. Da har {a} vikeplikt.',
      en: '{a} is turning left and will have {b} on its right. So {a} must give way.',
      th: '{a} จะเลี้ยวซ้ายและ {b} จะอยู่ทางขวา ดังนั้น {a} ต้องให้ทาง',
    },
  },
  hoyreregel: {
    id: 'hoyreregel',
    source: 'Trafikkreglene § 7 nr. 2 første punktum',
    sourceUrl: LOVDATA_TR,
    verified: false,
    why: {
      nb: '{b} kommer fra høyre for {a}. Høyreregelen: {a} har vikeplikt.',
      en: '{b} comes from the right of {a}. Right-hand rule: {a} must give way.',
      th: '{b} มาจากทางขวาของ {a} ตามกฎให้ทางรถทางขวา {a} ต้องให้ทาง',
    },
  },
};

/** Forrang: den første regelen som avgjør et par, gjelder. */
export const RULE_ORDER: RuleId[] = [
  'utrykning',
  'sporvogn',
  'gangfelt',
  'rundkjoring',
  'avkjorsel',
  'skilt',
  'venstresving',
  'hoyreregel',
];
