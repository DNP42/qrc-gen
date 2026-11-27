'use client';

import { useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';

interface Props {
  value: number;
  min: number;
  max: number;
  /** Visible name of the field; also used for the screen-reader labels. */
  label: string;
  /** Amount one press of - / + or an arrow key changes the value. */
  step?: number;
  onChange: (next: number) => void;
}

/**
 * Small number box with - / + buttons, like a text editor's size field.
 * Replaces range sliders: exact values, bigger targets, keyboard friendly.
 */
export function NumberStepper({ value, min, max, label, step = 1, onChange }: Props) {
  const t = useDict().controls;
  // Typing "3" on the way to "32" must not snap to the minimum, so the box
  // keeps its own text and only commits a clamped number on blur or Enter.
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const commit = () => {
    if (draft !== null && draft.trim() !== '' && Number.isFinite(Number(draft))) {
      onChange(clamp(Number(draft)));
    }
    setDraft(null);
  };
  const nudge = (direction: 1 | -1) => {
    onChange(clamp(value + direction * step));
    setDraft(null);
  };
  const buttonClass = 'btn btn-ghost flex-none !w-10 !h-10 !px-0 text-base';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={buttonClass}
        aria-label={interpolate(t.decrease, { label })}
        disabled={value <= min}
        onClick={() => nudge(-1)}
      >
        {'−'}
      </button>
      <input
        type="text"
        inputMode="numeric"
        className="field !w-16 !h-10 flex-none text-center tabular-nums"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            nudge(1);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            nudge(-1);
          }
        }}
      />
      <button
        type="button"
        className={buttonClass}
        aria-label={interpolate(t.increase, { label })}
        disabled={value >= max}
        onClick={() => nudge(1)}
      >
        {'+'}
      </button>
      <span className="text-xs text-[var(--muted)]">{t.unit}</span>
    </div>
  );
}
