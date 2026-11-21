// Skiltmodul: skiltkort, «hva betyr skiltet?», «finn skiltet» og sortering i skiltgrupper.
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SIGNS, signItemId, SIGN_TEMA } from '../../content/index';
import type { Sign, SignGroup } from '../../content/schema';
import { recordAttempt } from '../../db/db';
import { ThaiScope, useSettings, useThaiScope } from '../../i18n/LangProvider';
import { ui } from '../../i18n/strings';
import { T, TLine, U } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { UnverifiedBadge } from '../../components/UnverifiedBadge';
import { QuestionRunner } from '../quiz/QuestionRunner';
import { SignImage } from '../quiz/QuestionCard';
import { signFindItem, signMeaningItem, type QuizItem } from '../quiz/quizItem';

const GROUP_ORDER: SignGroup[] = ['fareskilt', 'vikepliktskilt', 'forbudsskilt', 'pabudsskilt', 'opplysningsskilt', 'serviceskilt', 'underskilt', 'vegoppmerking'];
const IDS = ['a', 'b', 'c', 'd'];

const shuffle = <T,>(xs: T[]) => [...xs].sort(() => Math.random() - 0.5);

function sortItem(sign: Sign): QuizItem {
  const others = shuffle(GROUP_ORDER.filter((g) => g !== sign.group)).slice(0, 3);
  const groups = shuffle([sign.group, ...others]);
  return {
    itemId: signItemId(sign.nr),
    kind: 'sign',
    temalisteRef: SIGN_TEMA,
    prompt: ui('signs.sortPrompt'),
    options: groups.map((g, i) => ({ id: IDS[i], text: ui(`signs.group.${g}` as 'signs.group.fareskilt') })),
    correct: IDS[groups.indexOf(sign.group)],
    explanation: sign.meaning,
    media: { sign: sign.nr },
    roadTextNb: [],
    glossaryTerms: sign.glossaryTerms,
    source: sign.source,
    sourceUrl: sign.sourceUrl,
    verified: sign.verified,
  };
}

function FlashCard({ sign, onAnswer }: { sign: Sign; onAnswer: (knew: boolean) => void }) {
  const [flipped, setFlipped] = useState(false);
  const { settings, mainLang } = useSettings();
  const scope = useThaiScope();
  const answer = (knew: boolean) => {
    void recordAttempt({
      itemId: signItemId(sign.nr),
      kind: 'sign',
      temalisteRef: SIGN_TEMA,
      correct: knew,
      ms: 0,
      thaiUsed: settings.scaffold === 'forsta' || (settings.scaffold === 'bro' && scope.usedRef.current),
      scaffoldAtTime: settings.scaffold,
      lang: mainLang,
      mode: 'practice',
      at: Date.now(),
    });
    setFlipped(false);
    onAnswer(knew);
  };
  return (
    <div className="card flashcard stack center">
      {!sign.verified && <UnverifiedBadge />}
      <SignImage nr={sign.nr} size={220} />
      <p className="muted small">
        <U k="signs.nr" vars={{ a: sign.nr }} />
      </p>
      {flipped ? (
        <>
          <T as="h2" text={sign.name} report={{ itemId: signItemId(sign.nr), field: 'name' }} />
          <p lang="nb" className="road-nb">
            {sign.name.nb}
          </p>
          <T text={sign.meaning} terms={sign.glossaryTerms} report={{ itemId: signItemId(sign.nr), field: 'meaning' }} />
          <div className="row-wrap">
            <button type="button" className="btn" onClick={() => answer(false)}>
              <U k="signs.didntKnow" />
            </button>
            <button type="button" className="btn btn--primary" onClick={() => answer(true)}>
              <Icon name="check" size={20} /> <U k="signs.knew" />
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="btn btn--primary btn--big" onClick={() => setFlipped(true)}>
          <U k="signs.flip" />
        </button>
      )}
    </div>
  );
}

function FlashCards() {
  const deck = useMemo(() => shuffle(SIGNS), []);
  const [i, setI] = useState(0);
  const sign = deck[i % deck.length];
  return (
    <ThaiScope key={sign.nr + i} scopeKey={sign.nr + i}>
      <p className="muted small">
        <U k="common.of" vars={{ a: (i % deck.length) + 1, b: deck.length }} />
      </p>
      <FlashCard sign={sign} onAnswer={() => setI(i + 1)} />
    </ThaiScope>
  );
}

export function SignsPage() {
  const { mode } = useParams();
  const nav = useNavigate();
  const entries = useMemo(() => {
    if (SIGNS.length < 4) return [];
    const deck = shuffle(SIGNS);
    if (mode === 'meaning') return deck.map((s) => ({ type: 'quiz' as const, item: signMeaningItem(s, SIGNS) }));
    if (mode === 'find') return deck.map((s) => ({ type: 'quiz' as const, item: signFindItem(s, SIGNS) }));
    if (mode === 'sort') return deck.map((s) => ({ type: 'quiz' as const, item: sortItem(s) }));
    return [];
  }, [mode]);

  if (mode === 'cards') {
    return (
      <div className="page stack">
        <h1>
          <U k="signs.flashcards" sub />
        </h1>
        {SIGNS.length ? <FlashCards /> : <U k="quiz.noItems" />}
      </div>
    );
  }
  if (mode === 'meaning' || mode === 'find' || mode === 'sort') {
    const title = mode === 'meaning' ? 'signs.quizMeaning' : mode === 'find' ? 'signs.quizFind' : 'signs.sort';
    return (
      <div className="page stack">
        <h1>
          <U k={title} sub />
        </h1>
        {entries.length ? <QuestionRunner entries={entries} mode="practice" onExit={() => nav('/signs')} /> : <U k="signs.tooFew" />}
      </div>
    );
  }

  const byGroup = GROUP_ORDER.map((g) => ({ g, signs: SIGNS.filter((s) => s.group === g) })).filter((x) => x.signs.length);
  return (
    <div className="page stack">
      <h1>
        <U k="signs.title" sub />
      </h1>
      <div className="mode-grid">
        {(
          [
            ['cards', 'signs.flashcards'],
            ['meaning', 'signs.quizMeaning'],
            ['find', 'signs.quizFind'],
            ['sort', 'signs.sort'],
          ] as const
        ).map(([m, k]) => (
          <Link key={m} to={`/signs/${m}`} className="card link-card">
            <Icon name="signs" size={28} />
            <strong>
              <U k={k} sub />
            </strong>
          </Link>
        ))}
      </div>
      <h2>
        <U k="signs.all" />
      </h2>
      {byGroup.map(({ g, signs }) => (
        <section key={g} className="stack">
          <h3>
            <U k={`signs.group.${g}` as 'signs.group.fareskilt'} />
          </h3>
          <ul className="sign-grid">
            {signs.map((s) => (
              <li key={s.nr} className="card sign-tile">
                <SignImage nr={s.nr} size={88} />
                <span className="muted small">{s.nr}</span>
                <ThaiScope scopeKey={s.nr}>
                  <TLine text={s.name} />
                </ThaiScope>
                <span lang="nb" className="road-nb small">
                  {s.name.nb}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
