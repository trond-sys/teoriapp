import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SCENARIO_BY_ID, STUDENT_SCENARIOS } from '../../content/index';
import { U } from '../../i18n/T';
import { QuestionRunner } from '../quiz/QuestionRunner';

/**
 * Vikeplikt-krysset. Uten ID: alle verifiserte scener etter hverandre, lettest først.
 * Med ID (lenke fra /review): bare den scenen, også om den er uverifisert, så Trond kan prøve den.
 */
export function YieldPage() {
  const nav = useNavigate();
  const { sceneId } = useParams();
  const entries = useMemo(() => {
    const one = sceneId ? SCENARIO_BY_ID.get(sceneId) : undefined;
    const list = one ? [one] : [...STUDENT_SCENARIOS].sort((a, b) => a.difficulty - b.difficulty);
    return list.map((scene) => ({ type: 'scene' as const, scene }));
  }, [sceneId]);
  return (
    <div className="page stack">
      <h1>
        <U k="practice.yield" sub />
      </h1>
      <QuestionRunner key={sceneId ?? 'alle'} entries={entries} mode="practice" onExit={() => nav(sceneId ? '/review' : '/practice')} />
    </div>
  );
}
