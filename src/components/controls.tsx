'use client';

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

export function ColorPick({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-10 h-10 rounded-md bg-transparent border border-[var(--control-border)] cursor-pointer"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="field flex-1"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
