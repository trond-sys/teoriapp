// Ett flervalg: spørsmål, media (scene eller skilt), svaralternativer og tilbakemelding.
import { SCENE_BY_ID, SIGN_BY_NR, signUrl } from '../../content/index';
import { SceneView } from '../../scene/SceneView';
import { SpeakButton, T, TLine, TranslateAllButton, U, useLayers } from '../../i18n/T';
import { Icon } from '../../components/Icon';
import { UnverifiedBadge } from '../../components/UnverifiedBadge';
import type { QuizItem } from './quizItem';

export function SignImage({ nr, size = 160 }: { nr: string; size?: number }) {
  const s = SIGN_BY_NR.get(nr);
  if (!s) return null;
  return <img className="sign-img" src={signUrl(s.file)} alt="" width={size} height={size} draggable={false} />;
}

function Media({ item }: { item: QuizItem }) {
  const scene = item.media?.scene ? SCENE_BY_ID.get(item.media.scene) : undefined;
  if (scene) return <SceneView scene={scene} />;
  if (item.media?.sign) return <SignImage nr={item.media.sign} size={200} />;
  return null;
}

export function hasMedia(item: QuizItem) {
  return !!(item.media?.scene || item.media?.sign);
}

interface Props {
  item: QuizItem;
  chosen: string | null;
  onChoose: (id: string) => void;
}

export function QuestionCard({ item, chosen, onChoose }: Props) {
  const answered = chosen !== null;
  const { main } = useLayers();
  const report = (field: string) => ({ itemId: item.itemId, field });
  return (
    <div className={`qcard${hasMedia(item) ? ' qcard--media' : ''}`}>
      {hasMedia(item) && (
        <div className="qcard-media">
          <Media item={item} />
        </div>
      )}
      <div className="qcard-main stack">
        <div className="qcard-top">
          {!item.verified && <UnverifiedBadge />}
          <TranslateAllButton />
        </div>
        <T as="h2" className="qcard-prompt" text={item.prompt} terms={item.glossaryTerms} report={report('prompt')} />
        {item.roadTextNb.length > 0 && (
          <p className="road-text">
            <span className="muted small">
              <U k="quiz.roadText" />:
            </span>{' '}
            {item.roadTextNb.map((w) => (
              <span key={w} lang="nb" className="road-nb">
                {w}
              </span>
            ))}
          </p>
        )}
        <ul className="options" role="list">
          {item.options.map((o) => {
            const isCorrect = o.id === item.correct;
            const state = !answered ? '' : isCorrect ? ' is-correct' : o.id === chosen ? ' is-wrong' : ' is-dim';
            const signNr = item.media?.signs?.[o.id];
            return (
              <li key={o.id} className="option-row">
                <button type="button" className={`option${state}${signNr ? ' option--sign' : ''}`} disabled={answered} onClick={() => onChoose(o.id)} aria-pressed={chosen === o.id}>
                  <span className="option-letter" aria-hidden>
                    {answered && isCorrect ? <Icon name="check" size={18} /> : answered && o.id === chosen ? <Icon name="cross" size={18} /> : o.id.toUpperCase()}
                  </span>
                  {signNr ? <SignImage nr={signNr} size={96} /> : <TLine text={o.text} />}
                </button>
                {!signNr && <SpeakButton text={o.text[main]} lang={main} small />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Feedback({ item, chosen }: { item: QuizItem; chosen: string }) {
  const ok = chosen === item.correct;
  const wrongOpt = item.options.find((o) => o.id === chosen);
  const report = (field: string) => ({ itemId: item.itemId, field });
  return (
    <div className={`feedback ${ok ? 'feedback--ok' : 'feedback--bad'} stack`} role="status">
      <p className="feedback-head">
        <Icon name={ok ? 'check' : 'cross'} /> <U k={ok ? 'quiz.correct' : 'quiz.wrong'} sub />
      </p>
      {!ok && wrongOpt?.whyWrong && (
        <section>
          <h3 className="small-head">
            <U k="quiz.whyWrong" />
          </h3>
          <T text={wrongOpt.whyWrong} terms={item.glossaryTerms} report={report(`options.${chosen}.whyWrong`)} />
        </section>
      )}
      <section>
        <h3 className="small-head">
          <U k="quiz.why" />
        </h3>
        <T text={item.explanation} terms={item.glossaryTerms} report={report('explanation')} />
      </section>
      {item.thaiContrast && (
        <section className="contrast">
          <h3 className="small-head">
            <U k="quiz.thaiContrast" />
          </h3>
          <T text={item.thaiContrast} report={report('thaiContrast')} />
        </section>
      )}
      <p className="muted small source">
        <U k="quiz.source" />:{' '}
        {item.sourceUrl ? (
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">
            {item.source}
          </a>
        ) : (
          item.source
        )}
      </p>
    </div>
  );
}
