// Styrer en økt (Dagens økt eller øving på tema): viser elementene etter tur, lagrer svar og SRS,
// og legger feilsvar inn igjen litt senere i samme økt.
import { useRef, useState, type ReactNode } from 'react';
import type { Scenario } from '../../content/schema';
import { recordAttempt } from '../../db/db';
import type { Mode } from '../../domain/types';
import { ThaiScope, useSettings, useThaiScope } from '../../i18n/LangProvider';
import { U } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { YieldBoard } from '../yield/YieldBoard';
import { Feedback, QuestionCard } from './QuestionCard';
import type { QuizItem } from './quizItem';

export type Entry = { type: 'quiz'; item: QuizItem } | { type: 'scene'; scene: Scenario };

const entryId = (e: Entry) => (e.type === 'quiz' ? e.item.itemId : e.scene.id);
const entryRef = (e: Entry) => (e.type === 'quiz' ? e.item.temalisteRef : (e.scene.temalisteRef ?? ''));

/** Hvor mange plasser senere et feilsvar kommer igjen. */
const REQUEUE_GAP = 3;

interface Props {
  entries: Entry[];
  mode: Mode;
  onExit: () => void;
  exitLabel?: ReactNode;
}

export function QuestionRunner({ entries, mode, onExit, exitLabel }: Props) {
  const [queue, setQueue] = useState<{ entry: Entry; repeat: boolean; key: string }[]>(() =>
    entries.map((e, i) => ({ entry: e, repeat: false, key: `${entryId(e)}#${i}` })),
  );
  const [pos, setPos] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  if (!queue.length) {
    return (
      <div className="empty">
        <U k="quiz.noItems" />
      </div>
    );
  }

  if (pos >= queue.length) {
    const right = results.filter(Boolean).length;
    return (
      <div className="card stack center done">
        <Icon name="check" size={40} />
        <h2>
          <U k="quiz.finished" sub />
        </h2>
        <p className="big">
          <U k="quiz.score" vars={{ a: right, b: results.length }} />
        </p>
        <button type="button" className="btn btn--primary" onClick={onExit}>
          {exitLabel ?? <U k="common.done" />}
        </button>
      </div>
    );
  }

  const current = queue[pos];
  const onAnswered = (correct: boolean) => {
    setResults((r) => [...r, correct]);
    if (!correct && !current.repeat) {
      setQueue((q) => {
        const copy = [...q];
        copy.splice(Math.min(pos + 1 + REQUEUE_GAP, copy.length), 0, { entry: current.entry, repeat: true, key: current.key + '-igjen' });
        return copy;
      });
    }
  };

  return (
    <div className="runner stack">
      <div className="runner-progress" aria-hidden>
        <div className="runner-bar" style={{ width: `${(pos / queue.length) * 100}%` }} />
      </div>
      <p className="muted small">
        <U k="common.of" vars={{ a: pos + 1, b: queue.length }} />
      </p>
      <ThaiScope key={current.key} scopeKey={current.key}>
        <EntryView entry={current.entry} mode={mode} willRepeat={!current.repeat} onAnswered={onAnswered} onNext={() => setPos(pos + 1)} />
      </ThaiScope>
    </div>
  );
}

function EntryView({ entry, mode, willRepeat, onAnswered, onNext }: { entry: Entry; mode: Mode; willRepeat: boolean; onAnswered: (c: boolean) => void; onNext: () => void }) {
  const { settings, mainLang } = useSettings();
  const scope = useThaiScope();
  const started = useRef(Date.now());
  const [chosen, setChosen] = useState<string | null>(null);
  const [sceneDone, setSceneDone] = useState<boolean | null>(null);

  const save = (correct: boolean) => {
    const thaiUsed = settings.scaffold === 'forsta' ? true : settings.scaffold === 'eksamen' ? false : scope.usedRef.current;
    void recordAttempt({
      itemId: entryId(entry),
      kind: entry.type === 'quiz' ? entry.item.kind : 'scene',
      temalisteRef: entryRef(entry),
      correct,
      ms: Date.now() - started.current,
      thaiUsed,
      scaffoldAtTime: settings.scaffold,
      lang: mainLang,
      mode,
      at: Date.now(),
    });
    onAnswered(correct);
  };

  const answered = entry.type === 'quiz' ? chosen !== null : sceneDone !== null;
  const wasCorrect = entry.type === 'quiz' ? chosen === entry.item.correct : sceneDone === true;

  return (
    <div className="stack">
      {entry.type === 'quiz' ? (
        <>
          <QuestionCard
            item={entry.item}
            chosen={chosen}
            onChoose={(id) => {
              setChosen(id);
              save(id === entry.item.correct);
            }}
          />
          {chosen !== null && <Feedback item={entry.item} chosen={chosen} />}
        </>
      ) : (
        <YieldBoard
          scene={entry.scene}
          onChecked={(c) => {
            setSceneDone(c);
            save(c);
          }}
        />
      )}
      {answered && (
        <div className="next-bar">
          {!wasCorrect && willRepeat && (
            <span className="muted small">
              <U k="quiz.repeatLater" />
            </span>
          )}
          <button type="button" className="btn btn--primary btn--big" onClick={onNext} autoFocus>
            <U k="common.next" /> <Icon name="next" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
