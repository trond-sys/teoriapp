// Ett ordlisteoppslag: norsk – engelsk – thai med lyd og kort forklaring.
import type { GlossaryTerm } from '../content/schema';
import type { Lang } from '../domain/types';
import { SpeakButton, T } from '../i18n/T';
import { U } from '../i18n/T';

const ORDER: Lang[] = ['nb', 'en', 'th'];

export function TermCard({ term }: { term: GlossaryTerm }) {
  return (
    <div className="term-card">
      <dl className="term-words">
        {ORDER.map((l) => (
          <div key={l} className="term-word">
            <dt>
              <U k={`lang.${l}` as 'lang.nb'} />
            </dt>
            <dd>
              <span lang={l} className={l === 'nb' ? 'road-nb' : undefined}>
                {term[l]}
              </span>
              <SpeakButton text={term[l]} lang={l} small />
            </dd>
          </div>
        ))}
      </dl>
      <T text={term.def} report={{ itemId: `term-${term.id}`, field: 'def' }} />
      {term.onRoad && (
        <p className="muted small">
          <U k="glossary.onRoad" />
        </p>
      )}
    </div>
  );
}
