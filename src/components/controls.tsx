'use client';

import { useId, useState } from 'react';

/** Small form controls shared by the cards. */

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label">{title}</div>
      {children}
    </div>
  );
}

export function Pills<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: T[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 min-h-10 rounded-md font-mono text-xs uppercase tracking-wider border transition ${
            value === opt
              ? 'border-[var(--hawk)] text-[var(--hawk)] bg-[rgba(57,255,122,0.06)]'
              : 'border-[var(--control-border)] text-[var(--muted)] hover:border-[var(--hawk)] hover:text-white'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/** Color swatch plus hex field. Only a complete #RRGGBB value is passed on; typing keeps its own draft. */
export function ColorPick({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-10 h-10 rounded-md bg-transparent border border-[var(--control-border)] cursor-pointer"
          aria-label={label}
        />
        <input
          id={id}
          type="text"
          value={draft ?? value}
          maxLength={7}
          onChange={(e) => {
            const next = e.target.value.toUpperCase();
            setDraft(next);
            if (HEX_COLOR.test(next)) onChange(next);
          }}
          onBlur={() => setDraft(null)}
          className="field flex-1"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
