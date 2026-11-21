// Ordlisteoppslag som ark nederfra, uten å forlate oppgaven.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { TERM_BY_ID } from '../content/index';
import type { GlossaryTerm } from '../content/schema';
import { ui } from '../i18n/strings';
import { useSettings } from '../i18n/LangProvider';
import { Sheet } from './Sheet';
import { TermCard } from './TermCard';

interface Ctx {
  open: (id: string) => void;
}
const GlossaryCtx = createContext<Ctx>({ open: () => {} });

export function GlossarySheetProvider({ children }: { children: ReactNode }) {
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const { mainLang } = useSettings();
  const open = useCallback((id: string) => setTerm(TERM_BY_ID.get(id) ?? null), []);
  const close = useCallback(() => setTerm(null), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <GlossaryCtx.Provider value={value}>
      {children}
      <Sheet open={!!term} onClose={close} closeLabel={ui('common.close')[mainLang]} title={<span lang={mainLang}>{ui('glossary.title')[mainLang]}</span>}>
        {term && <TermCard term={term} />}
      </Sheet>
    </GlossaryCtx.Provider>
  );
}

export const useGlossarySheet = () => useContext(GlossaryCtx);
