import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUESTIONS } from '../../content/index';
import { TEMA_BY_ID } from '../../config/temaliste';
import { useLayers } from '../../i18n/T';
import { QuestionRunner } from '../quiz/QuestionRunner';
import { fromQuestion } from '../quiz/quizItem';

export function TopicPractice() {
  const { ref = '' } = useParams();
  const nav = useNavigate();
  const { main } = useLayers();
  const entries = useMemo(
    () =>
      QUESTIONS.filter((q) => q.temalisteRef === ref)
        .sort(() => Math.random() - 0.5)
        .map((q) => ({ type: 'quiz' as const, item: fromQuestion(q) })),
    [ref],
  );
  const t = TEMA_BY_ID[ref];
  return (
    <div className="page stack">
      {t && <h1 lang={main}>{t[main]}</h1>}
      {/* key: ny økt når temaet i adressen endres (ellers beholder runneren køen fra forrige tema). */}
      <QuestionRunner key={ref} entries={entries} mode="practice" onExit={() => nav('/practice')} />
    </div>
  );
}
