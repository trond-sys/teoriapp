// «Rapporter oversettelse»: eleven flagger thai-tekst og foreslår bedre formulering. Lagres lokalt.
import { useState } from 'react';
import { db, uuid } from '../db/db';
import { useSettings } from '../i18n/LangProvider';
import { ui } from '../i18n/strings';
import { Icon } from './Icon';
import { Sheet } from './Sheet';

export interface ReportTarget {
  itemId: string;
  field: string;
}

export function ReportThai({ target, current }: { target: ReportTarget; current: string }) {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const { mainLang } = useSettings();
  // Rapportskjemaet vises på thai med engelsk under, siden det er eleven som skriver.
  const L = (k: Parameters<typeof ui>[0]) => (
    <>
      <span lang="th">{ui(k).th}</span> <span className="muted small" lang="en">· {ui(k).en}</span>
    </>
  );

  const save = async () => {
    await db.thReports.add({ id: uuid(), itemId: target.itemId, field: target.field, current, suggestion, comment, status: 'new', at: Date.now() });
    setSaved(true);
    setSuggestion('');
    setComment('');
  };

  return (
    <>
      <button
        type="button"
        className="icon-btn icon-btn--small"
        onClick={(e) => {
          e.stopPropagation();
          setSaved(false);
          setOpen(true);
        }}
        aria-label={ui('report.button')[mainLang]}
        title={ui('report.button').th}
      >
        <Icon name="flag" size={16} />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={L('report.title')} closeLabel={ui('common.close')[mainLang]}>
        {saved ? (
          <p>{L('report.thanks')}</p>
        ) : (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              void save();
            }}
          >
            <div className="field">
              <span className="label">{L('report.current')}</span>
              <p lang="th" className="quote">
                {current}
              </p>
            </div>
            <label className="field">
              <span className="label">{L('report.suggestion')}</span>
              <textarea lang="th" rows={3} value={suggestion} onChange={(e) => setSuggestion(e.target.value)} />
            </label>
            <label className="field">
              <span className="label">{L('report.comment')}</span>
              <textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
            </label>
            <button type="submit" className="btn btn--primary">
              {L('report.send')}
            </button>
          </form>
        )}
      </Sheet>
    </>
  );
}
