// Trespråklig ordliste med søk og flashcards (NO ↔ EN ↔ TH).
import { useMemo, useState } from 'react';
import { GLOSSARY } from '../../content/index';
import type { GlossaryTerm } from '../../content/schema';
import { recordAttempt } from '../../db/db';
import type { Lang } from '../../domain/types';
import { useSettings } from '../../i18n/LangProvider';
import { SpeakButton, U, useUi } from '../../i18n/T';
import { TermCard } from '../../components/TermCard';

const DIRECTIONS: [Lang, Lang][] = [
  ['nb', 'en'],
  ['en', 'nb'],
  ['nb', 'th'],
  ['th', 'nb'],
];

function Flash() {
  const [dir, setDir] = useState(0);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { settings, mainLang } = useSettings();
  const deck = useMemo(() => [...GLOSSARY].sort(() => Math.random() - 0.5), []);
  if (!deck.length) return <U k="glossary.empty" />;
  const term = deck[i % deck.length];
  const [from, to] = DIRECTIONS[dir];
  const answer = (knew: boolean) => {
    void recordAttempt({
      itemId: `term-${term.id}`,
      kind: 'glossary',
      temalisteRef: '',
      correct: knew,
      ms: 0,
      thaiUsed: from === 'th' || to === 'th',
      scaffoldAtTime: settings.scaffold,
      lang: mainLang,
      mode: 'practice',
      at: Date.now(),
    });
    setFlipped(false);
    setI(i + 1);
  };
  return (
    <div className="stack">
      <div className="segmented" role="radiogroup">
        {DIRECTIONS.map(([a, b], k) => (
          <button key={k} type="button" role="radio" aria-checked={dir === k} className={dir === k ? 'is-selected' : ''} onClick={() => setDir(k)}>
            {a.toUpperCase()} → {b.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="card flashcard stack center">
        <p className="flash-word" lang={from}>
          {term[from]}
        </p>
        <SpeakButton text={term[from]} lang={from} />
        {flipped ? (
          <>
            <p className="flash-word flash-word--answer" lang={to}>
              {term[to]}
            </p>
            <SpeakButton text={term[to]} lang={to} />
            <div className="row-wrap">
              <button type="button" className="btn" onClick={() => answer(false)}>
                <U k="signs.didntKnow" />
              </button>
              <button type="button" className="btn btn--primary" onClick={() => answer(true)}>
                <U k="signs.knew" />
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn btn--primary btn--big" onClick={() => setFlipped(true)}>
            <U k="signs.flip" />
          </button>
        )}
      </div>
    </div>
  );
}

export function GlossaryPage() {
  const [mode, setMode] = useState<'list' | 'flash'>('list');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const t = useUi();
  const { mainLang } = useSettings();
  const list = useMemo(() => {
    const s = q.trim().toLocaleLowerCase();
    const sorted = [...GLOSSARY].sort((a, b) => a[mainLang].localeCompare(b[mainLang], mainLang));
    return s ? sorted.filter((g: GlossaryTerm) => [g.nb, g.en, g.th].some((w) => w.toLocaleLowerCase().includes(s))) : sorted;
  }, [q, mainLang]);

  return (
    <div className="page stack">
      <h1>
        <U k="glossary.title" sub />
      </h1>
      <div className="segmented">
        <button type="button" className={mode === 'list' ? 'is-selected' : ''} onClick={() => setMode('list')}>
          <U k="glossary.list" />
        </button>
        <button type="button" className={mode === 'flash' ? 'is-selected' : ''} onClick={() => setMode('flash')}>
          <U k="glossary.flashcards" />
        </button>
      </div>
      {mode === 'flash' ? (
        <Flash />
      ) : (
        <>
          <input className="search" type="search" placeholder={t('glossary.search')} value={q} onChange={(e) => setQ(e.target.value)} />
          {!list.length && (
            <p className="muted">
              <U k="glossary.empty" />
            </p>
          )}
          <ul className="term-list">
            {list.map((g) => (
              <li key={g.id} className="card">
                <button type="button" className="term-row" onClick={() => setOpen(open === g.id ? null : g.id)} aria-expanded={open === g.id}>
                  <span lang="nb" className="road-nb">
                    {g.nb}
                  </span>
                  <span lang="en">{g.en}</span>
                  <span lang="th">{g.th}</span>
                </button>
                {open === g.id && <TermCard term={g} />}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
