// Temalisten for teoriprøven klasse B (Statens vegvesen, versjon august 2020).
// Kilde: docs/temaliste/ (side 1 engelsk, side 2 norsk). Temakartet er låst i docs/PLAN-fase0.md §1.
// ID-ene endres aldri. Thai-navnene er utkast (thReview: pending).

export type TemaGruppe = 'fp' | 'ft' | 'fa' | 'kj' | 'lr' | 'so' | 'vp';
export type Trinn = 1 | 2 | 3 | 4;

export interface TemaPunkt {
  id: string;
  gruppe: TemaGruppe;
  nb: string;
  en: string;
  th: string;
  trinn: Trinn[];
  /** Særnorsk eller ofte feilet (§4.3) – vektes tyngre. */
  star: boolean;
  /** Regelen er motsatt eller annerledes enn i Thailand. */
  thContrast: boolean;
  mvp: number;
  total: number;
  /** Bare på den norske listen. */
  onlyNb?: boolean;
}

export const TEMA_GRUPPER: Record<TemaGruppe, { nb: string; en: string; th: string }> = {
  fp: { nb: 'Fart og plassering', en: 'Speed and positioning', th: 'ความเร็วและตำแหน่งบนถนน' },
  ft: { nb: 'Fører og andre trafikanter', en: 'Driver and other road users', th: 'ผู้ขับขี่และผู้ใช้ถนนอื่น' },
  fa: { nb: 'Fører og eiers ansvar', en: "Driver's and owner's responsibility", th: 'ความรับผิดชอบของผู้ขับขี่และเจ้าของรถ' },
  kj: { nb: 'Kjøretøyet', en: 'The vehicle', th: 'ตัวรถ' },
  lr: { nb: 'Lover og regler', en: 'Laws and regulations', th: 'กฎหมายและข้อบังคับ' },
  so: { nb: 'Skilt og oppmerking', en: 'Signs and road markings', th: 'ป้ายจราจรและเครื่องหมายบนถนน' },
  vp: { nb: 'Vikeplikt', en: 'Duty to give way', th: 'หน้าที่ให้ทาง' },
};

const p = (
  id: string,
  nb: string,
  en: string,
  th: string,
  trinn: Trinn[],
  mvp: number,
  total: number,
  flags: { star?: boolean; th?: boolean; onlyNb?: boolean } = {},
): TemaPunkt => ({
  id,
  gruppe: id.split('-')[0] as TemaGruppe,
  nb,
  en,
  th,
  trinn,
  mvp,
  total,
  star: !!flags.star,
  thContrast: !!flags.th,
  ...(flags.onlyNb ? { onlyNb: true } : {}),
});

export const TEMALISTE: TemaPunkt[] = [
  // Fart og plassering
  p('fp-avstand', 'Avstand til forankjørende', 'Distance to vehicle in front', 'ระยะห่างจากรถคันหน้า', [3], 3, 8),
  p('fp-feltvalg', 'Feltvalg. Kollektivfelt. Rundkjøring. Envegskjøring', 'Choice of lane. Public transport lane. Roundabout. One-way traffic', 'การเลือกช่องจราจร ช่องรถโดยสารสาธารณะ วงเวียน การเดินรถทางเดียว', [3], 6, 18, { star: true, th: true }),
  p('fp-forbikjoring', 'Forbikjøring', 'Overtaking', 'การแซง', [3, 4], 5, 15, { star: true, th: true }),
  p('fp-hest', 'Hest i trafikken', 'Horse on the road', 'ม้าบนถนน', [3], 1, 4),
  p('fp-planovergang', 'Planovergang', 'Level crossing', 'ทางรถไฟตัดผ่านถนน', [3], 2, 6),
  p('fp-signal', 'Signal og tegn', 'Signals and indicators', 'สัญญาณและการให้สัญญาณ', [2, 3], 2, 6),
  p('fp-sikkerhetssoner', 'Sikkerhetssoner. Blindsoner', 'Safety zones. Blind spots', 'พื้นที่ปลอดภัย จุดบอด', [2, 3], 2, 7, { star: true }),
  p('fp-sikt-lys', 'Siktforhold. Vær. Mørke. Bruk av lys', 'Visibility. Weather. Darkness. Use of lights', 'ทัศนวิสัย สภาพอากาศ ความมืด การใช้ไฟ', [1, 4], 5, 15, { star: true }),
  p('fp-stopplengde', 'Stopplengde. Bremselengde. Reaksjonslengde', 'Stopping distance. Braking distance. Reaction distance', 'ระยะหยุดรถ ระยะเบรก ระยะตอบสนอง', [1, 3], 4, 12, { star: true }),
  p('fp-veggrep', 'Vegforhold. Veggrep', 'Road conditions. Road grip', 'สภาพถนน การยึดเกาะถนน', [4], 5, 14, { star: true }),
  // Fører og andre trafikanter
  p('ft-samhandling', 'Forholdet mellom trafikanter', 'Interaction between road users', 'ความสัมพันธ์ระหว่างผู้ใช้ถนน', [1, 3], 5, 14, { star: true }),
  p('ft-begrensninger', 'Fysiske/psykiske begrensninger', 'Physical/mental limitations', 'ข้อจำกัดทางร่างกายและจิตใจ', [1], 2, 6),
  p('ft-miljo', 'Miljøhensyn', 'Environmental considerations', 'การคำนึงถึงสิ่งแวดล้อม', [1, 4], 2, 6),
  p('ft-sanser', 'Sanser. Reaksjonstid. Uoppmerksomhet', 'Senses. Reaction time. Inattention', 'ประสาทสัมผัส เวลาตอบสนอง การขาดสมาธิ', [1], 2, 7, { star: true }),
  // Fører og eiers ansvar
  p('fa-eierforhold', 'Eierforhold. Registrering. Vognkort. Forsikring', 'Ownership. Registration. Vehicle Registration Certificate. Insurance', 'กรรมสิทธิ์ การจดทะเบียน ใบทะเบียนรถ ประกันภัย', [1], 2, 6),
  p('fa-forstehjelp', 'Førstehjelp', 'First aid', 'การปฐมพยาบาล', [1], 3, 10),
  p('fa-forerrett', 'Helsekrav. Førerrett. Førerkort. Øvelseskjøring', 'Health requirements. Driving entitlements. Driving licences. Driving practice with an accompanying driver', 'ข้อกำหนดด้านสุขภาพ สิทธิในการขับขี่ ใบขับขี่ การฝึกขับกับผู้ควบคุม', [1], 3, 9, { th: true }),
  p('fa-reaksjoner', 'Offentlige reaksjoner ved overtredelse', 'Sanctions by authorities against violations', 'บทลงโทษจากหน่วยงานรัฐเมื่อทำผิดกฎ', [1], 2, 7),
  p('fa-passasjer', 'Passasjer', 'Passengers', 'ผู้โดยสาร', [1], 2, 6),
  p('fa-avhold', 'Pliktmessig avhold', 'Compulsory abstinence from alcohol etc.', 'การงดดื่มแอลกอฮอล์ตามหน้าที่', [1], 3, 8, { star: true }),
  p('fa-sikt-ruter', 'Sikt. Isfrie ruter. Snø på tak', 'Visibility. Ice-free windows. Snow on the roof', 'ทัศนวิสัย กระจกไม่มีน้ำแข็ง หิมะบนหลังคา', [2], 3, 7, { star: true }),
  p('fa-trafikkuhell', 'Trafikkuhell. Sikringsutstyr. Tunnelsikkerhet', 'Traffic accidents. Safety equipment. Tunnel safety', 'อุบัติเหตุจราจร อุปกรณ์ความปลอดภัย ความปลอดภัยในอุโมงค์', [1], 4, 12, { star: true }),
  p('fa-tretthet-rus', 'Tretthet. Rus', 'Fatigue. Intoxication', 'ความเหนื่อยล้า การมึนเมา', [1], 4, 12, { star: true }),
  // Kjøretøyet
  p('kj-betjening', 'Betjeningsorganer. Instrumentpanel', 'Control devices. Dashboard', 'อุปกรณ์ควบคุม แผงหน้าปัด', [2], 2, 6),
  p('kj-dekk-bremser-lys', 'Dekk. Styring. Bremser. Kjetting. Lys', 'Tyres. Steering. Brakes. Chains. Lights', 'ยางรถ พวงมาลัย เบรก โซ่พันล้อ ไฟ', [2], 4, 12, { star: true }),
  p('kj-drivstoff-miljo', 'Drivstoff. Energikilde. Eksos. Miljø', 'Fuel. Power source. Exhaust. Environment', 'เชื้อเพลิง แหล่งพลังงาน ไอเสีย สิ่งแวดล้อม', [2], 1, 5),
  p('kj-forerstotte', 'Førerstøttesystemer', 'Driver Assistance Systems', 'ระบบช่วยเหลือผู้ขับขี่', [2, 4], 1, 6),
  p('kj-sikkerhetskontroll', 'Sikkerhetskontroll', 'Safety checks', 'การตรวจสอบความปลอดภัย', [2], 2, 8),
  // Lover og regler
  p('lr-forbud-offentlig-veg', 'Forbud på offentlig veg', 'Prohibitions on public roads', 'ข้อห้ามบนถนนสาธารณะ', [1], 1, 5, { onlyNb: true }),
  p('lr-bruksforskrift', 'Forskrift om bruk av kjøretøy', 'Regulations relating to the Use of Vehicles', 'ข้อบังคับเกี่ยวกับการใช้ยานพาหนะ', [1, 2], 2, 6),
  p('lr-trafikkregler', 'Trafikkregler', 'Traffic Rules', 'กฎจราจร', [1, 3], 2, 8, { th: true }),
  p('lr-vtl-3-21', 'Vegtrafikkloven § 3 og § 21', 'Road Traffic Act §§ 3 and 21', 'พระราชบัญญัติการจราจรทางถนน มาตรา 3 และ 21', [1], 2, 6),
  // Skilt og oppmerking
  p('so-fletting', 'Fletting', 'Merging (zipper)', 'การสลับกันเข้าช่อง (แบบซิป)', [3], 2, 5),
  p('so-skilt', 'Skilt. Skiltgrupper', 'Signs. Sign groups', 'ป้ายจราจร กลุ่มป้าย', [1, 3], 6, 20, { star: true, th: true }),
  p('so-oppmerking', 'Vegoppmerking', 'Road marking', 'เครื่องหมายบนพื้นถนน', [3], 4, 12, { th: true }),
  // Vikeplikt
  p('vp-hoyreregel', 'Høyreregel. Ut fra parkering. Bussholdeplass. Skilt', 'Right-hand rule. Exiting parking area. Bus stop. Signs', 'กฎให้ทางรถทางขวา การออกจากที่จอดรถ ป้ายรถเมล์ ป้ายจราจร', [3], 10, 22, { star: true, th: true }),
  p('vp-lysregulering', 'Lysregulering. Politimannens tegn', "Traffic lights. Police officer's signals", 'สัญญาณไฟจราจร สัญญาณมือของตำรวจ', [3], 3, 8),
  p('vp-rygging-vending', 'Rygging. Vending', 'Reversing. Turning around', 'การถอยรถ การกลับรถ', [2, 3], 2, 5),
  p('vp-samhandling', 'Samhandling', 'Interaction', 'การปฏิสัมพันธ์บนถนน', [3], 2, 7, { star: true }),
  p('vp-stoppeplikt', 'Stoppeplikt', 'Obligation to stop', 'หน้าที่ต้องหยุดรถ', [3], 1, 4),
  p('vp-tr-10', 'Trafikkreglene § 10', 'Traffic Rules § 10', 'กฎจราจร มาตรา 10', [3], 3, 8, { star: true }),
];

export const TEMALISTE_IDS = TEMALISTE.map((t) => t.id) as [string, ...string[]];

export const TEMA_BY_ID: Record<string, TemaPunkt> = Object.fromEntries(TEMALISTE.map((t) => [t.id, t]));
