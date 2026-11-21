// Ark nederfra (mobil) / dialog midt på (nettbrett liggende). Lukkes med Esc, bakgrunn eller knapp.
import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

export function Sheet({ open, onClose, title, children, closeLabel }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; closeLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" tabIndex={-1} ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="sheet-title">{title}</div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel}>
            <Icon name="cross" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}
