// Kjernekatalogen for vikeplikt-scener (Endring 01 §6). Antallet er veiledende.
import type { ScenarioSubtopic } from '../../content/schema';

export const CATALOG: { subtopic: ScenarioSubtopic; nb: string; target: number; mainSource: string }[] = [
  { subtopic: 'hoyreregel', nb: 'Høyreregel', target: 4, mainSource: 'Trafikkreglene § 7 nr. 2' },
  { subtopic: 'avkjorsel', nb: 'Ut fra parkering / avkjørsel / gårdsveg / vegskulder', target: 4, mainSource: '§ 7 nr. 4 første ledd' },
  { subtopic: 'fra-sykkelveg', nb: 'Fra sykkelveg, gangveg eller fortau', target: 2, mainSource: '§ 7 nr. 4 annet ledd' },
  { subtopic: 'bussholdeplass', nb: 'Bussholdeplass', target: 2, mainSource: '§ 7 nr. 5' },
  { subtopic: 'skilt', nb: 'Skilt 202, 204, 206, 208', target: 6, mainSource: 'Skiltforskriften § 6' },
  { subtopic: 'lysregulering', nb: 'Lysregulering, venstresving på grønt, gult blink', target: 5, mainSource: 'Skiltforskriften § 24, trafikkreglene § 3' },
  { subtopic: 'politi', nb: 'Politiets tegn', target: 3, mainSource: 'Skiltforskriften § 25, trafikkreglene § 3' },
  { subtopic: 'venstresving', nb: 'Venstresving mot møtende (også to som begge svinger)', target: 3, mainSource: '§ 7 nr. 2, § 6 nr. 4' },
  { subtopic: 'svinging-gaende', nb: 'Svinging mot gående og syklende', target: 3, mainSource: '§ 7 nr. 3' },
  { subtopic: 'rygging-vending', nb: 'Rygging og vending', target: 2, mainSource: '§ 11' },
  { subtopic: 'fri-veg', nb: 'Trafikkreglene § 10: utrykning, trikk, tog', target: 4, mainSource: '§ 10' },
  { subtopic: 'rundkjoring', nb: 'Rundkjøring: inn med skilt 202 / feltskifte inne', target: 3, mainSource: 'Skiltforskriften § 6, vegvesen.no' },
];
