'use client';

import { useId, useState } from 'react';

interface Props {
  title: string;
  /** Shown in the header while a collapsible card is folded. */
  summary?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * One concern per card. A collapsible card folds with its state kept: the
 * content stays mounted (hidden), so edits and focus survive.
 */
export function Card({ title, summary, collapsible = false, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const showBody = !collapsible || open;
  const titleClass = 'font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]';

  return (
    <section className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <h3 className="m-0">
        {collapsible ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen(!open)}
            className="flex w-full min-h-14 items-center justify-between gap-3 rounded-xl p-5 text-left"
          >
            <span className={titleClass}>{title}</span>
            <span className="flex min-w-0 items-center gap-3">
              {!open && summary && (
                <span className="truncate text-xs text-[var(--muted)]">{summary}</span>
              )}
              <span aria-hidden="true" className="text-[var(--hawk)]">
                {open ? '▾' : '▸'}
              </span>
            </span>
          </button>
        ) : (
          <span className={`block px-5 pt-5 pb-4 ${titleClass}`}>{title}</span>
        )}
      </h3>
      <div id={bodyId} hidden={!showBody} className={collapsible ? 'px-5 pb-5' : 'px-5 pb-5'}>
        {children}
      </div>
    </section>
  );
}
