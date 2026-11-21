import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCENES } from '../../content/index';
import { U } from '../../i18n/T';
import { QuestionRunner } from '../quiz/QuestionRunner';

/** Alle vikeplikt-scenene etter hverandre, lettest først. */
export function YieldPage() {
  const nav = useNavigate();
  const entries = useMemo(() => [...SCENES].sort((a, b) => a.difficulty - b.difficulty).map((scene) => ({ type: 'scene' as const, scene })), []);
  return (
    <div className="page stack">
      <h1>
        <U k="practice.yield" sub />
      </h1>
      <QuestionRunner entries={entries} mode="practice" onExit={() => nav('/practice')} />
    </div>
  );
}
