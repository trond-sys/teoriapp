import { describe, expect, it } from 'vitest';
import { illustrationIssues, validateContent, type RawContent } from './validate';
import { Illustration } from './schema';

const l3 = (s: string) => ({ nb: `${s} nb`, en: `${s} en`, th: `${s} th` });

function question(over: Record<string, unknown> = {}) {
  return {
    id: 'vikeplikt-001',
    topic: 'vikeplikt',
    temalisteRef: 'vp-hoyreregel',
    trinn: 3,
    type: 'mc-single',
    difficulty: 1,
    prompt: l3('Hvem'),
    options: [
      { id: 'a', text: l3('A') },
      { id: 'b', text: l3('B') },
    ],
    correct: 'a',
    explanation: l3('Fordi'),
    glossaryTerms: ['vikeplikt'],
    source: 'Trafikkreglene § 7 nr. 2',
    verified: false,
    thReview: 'pending',
    ...over,
  };
}

function raw(questions: unknown[], extra: Partial<RawContent> = {}): RawContent {
  return {
    questions: [{ file: 'src/content/questions/vp-hoyreregel.json', data: questions }],
    scenarios: [],
    signs: { file: 'signs.json', data: [] },
    glossary: {
      file: 'glossary.json',
      data: [{ id: 'vikeplikt', nb: 'vikeplikt', en: 'duty to give way', th: 'หน้าที่ให้ทาง', def: l3('def'), verified: false, thReview: 'pending' }],
    },
    ui: { file: 'ui/strings.json', data: {} },
    signFiles: [],
    licensesMd: '',
    ...extra,
  };
}

describe('validateContent', () => {
  it('godtar en gyldig oppgave og teller dekning', () => {
    const r = validateContent(raw([question()]));
    expect(r.errors).toEqual([]);
    expect(r.coverage.find((c) => c.ref === 'vp-hoyreregel')?.made).toBe(1);
    expect(r.unverified).toHaveLength(1);
  });

  it('feiler når et språk mangler', () => {
    const r = validateContent(raw([question({ prompt: { nb: 'x', en: 'y' } })]));
    expect(r.errors.join('\n')).toMatch(/prompt.*th/);
  });

  it('feiler ved ugyldig fasit', () => {
    const r = validateContent(raw([question({ correct: 'c' })]));
    expect(r.errors.join('\n')).toMatch(/ugyldig fasit/);
  });

  it('feiler når source mangler', () => {
    const q = question();
    delete (q as Record<string, unknown>).source;
    expect(validateContent(raw([q])).errors.join('\n')).toMatch(/source/);
  });

  it('feiler ved ukjent temalisteRef', () => {
    expect(validateContent(raw([question({ temalisteRef: 'vp-finnes-ikke' })])).errors.length).toBeGreaterThan(0);
  });

  it('feiler ved dobbel ID', () => {
    const r = validateContent(raw([question(), question()]));
    expect(r.errors.join('\n')).toMatch(/dobbel ID/);
  });

  it('feiler ved ukjent ordlisteord', () => {
    const r = validateContent(raw([question({ glossaryTerms: ['finnes-ikke'] })]));
    expect(r.errors.join('\n')).toMatch(/finnes ikke i ordlisten/);
  });

  it('feiler når scene eller skilt ikke finnes', () => {
    const r = validateContent(raw([question({ type: 'mc-image', media: { scene: 'scene-x-01', sign: '999' } })]));
    expect(r.errors.join('\n')).toMatch(/scenen/);
    expect(r.errors.join('\n')).toMatch(/skiltet/);
  });

  it('feiler når oppgaven ligger i feil temafil', () => {
    const r = validateContent(raw([question({ temalisteRef: 'vp-tr-10' })]));
    expect(r.errors.join('\n')).toMatch(/ligger i vp-hoyreregel/);
  });

  it('manglende skiltfil er en advarsel, manglende lisenslinje er en feil', () => {
    const sign = {
      nr: '202',
      group: 'vikepliktskilt',
      name: l3('Vikeplikt'),
      meaning: l3('Vik'),
      file: '202.svg',
      credit: { page: 'https://commons.wikimedia.org/x', original: 'https://upload.wikimedia.org/x.svg', author: 'A', license: 'PD' },
      source: 'Skiltforskriften § 6',
      verified: false,
      thReview: 'pending',
    };
    const r = validateContent(raw([question()], { signs: { file: 'signs.json', data: [sign] }, signFiles: [], licensesMd: '| 202.svg |' }));
    expect(r.errors).toEqual([]);
    expect(r.warnings.join('\n')).toMatch(/202\.svg mangler/);
    const r2 = validateContent(raw([question()], { signs: { file: 'signs.json', data: [sign] }, signFiles: ['202.svg'], licensesMd: '' }));
    expect(r2.errors.join('\n')).toMatch(/LICENSES/);
  });
});

describe('tegninger til oppgaver', () => {
  const signs = new Set(['202', '516']);
  it('godtar en vegstrekning med holdeplass og buss', () => {
    const ill = Illustration.parse({
      type: 'strekning',
      busStop: true,
      actors: [
        { id: 'A', kind: 'bil', lane: 'eget-felt', at: 10 },
        { id: 'B', kind: 'buss', lane: 'holdeplass', at: 50, intent: 'kjorer-ut', blink: 'venstre' },
      ],
    });
    expect(illustrationIssues(ill, signs)).toEqual([]);
  });
  it('avviser buss på holdeplass uten busslomme, og tog utenfor sporet', () => {
    const ill = Illustration.parse({
      type: 'strekning',
      actors: [
        { id: 'B', kind: 'buss', lane: 'holdeplass', at: 50 },
        { id: 'T', kind: 'tog', lane: 'eget-felt', at: 80 },
      ],
    });
    const issues = illustrationIssues(ill, signs);
    expect(issues.some((m) => m.includes('busStop'))).toBe(true);
    expect(issues.some((m) => m.includes('sporet'))).toBe(true);
  });
  it('avviser kryss der en trafikant kommer fra en arm som ikke finnes', () => {
    const ill = Illustration.parse({
      type: 'kryss',
      layout: { type: 't-kryss', arms: ['E', 'S', 'W'] },
      actors: [{ id: 'A', kind: 'bil', from: 'N', intent: 'rett-fram' }],
    });
    expect(illustrationIssues(ill, signs).some((m) => m.includes('armen N'))).toBe(true);
  });
});
