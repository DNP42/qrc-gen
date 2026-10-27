'use client';

import { useDict } from '@/i18n/I18nProvider';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { interpolate } from '@/i18n/format';
import {
  MARGIN_MAX,
  MARGIN_MIN,
  clampMargin,
  type CornerDotStyle,
  type CornerSquareStyle,
  type DotStyle,
  type Overlay,
  type QRConfig,
} from '@/lib/qr';

interface Props {
  config: QRConfig;
  onChange: (next: QRConfig) => void;
}

const DOT_STYLES: DotStyle[] = ['rounded', 'square', 'dots', 'classy', 'classy-rounded', 'extra-rounded'];
const CORNER_SQUARE: CornerSquareStyle[] = ['extra-rounded', 'square', 'dot'];
const CORNER_DOT: CornerDotStyle[] = ['dot', 'square'];

type PresetId = keyof Dictionary['style']['presets'];

const PRESETS: Array<{ id: PresetId; fg: string; bg: string }> = [
  { id: 'hawk', fg: '#39FF7A', bg: '#0A0A0A' },
  { id: 'mono', fg: '#EDEDED', bg: '#0A0A0A' },
  { id: 'inverted', fg: '#0A0A0A', bg: '#EDEDED' },
  { id: 'cyan', fg: '#00E5FF', bg: '#0A0A0A' },
  { id: 'amber', fg: '#FFB400', bg: '#0A0A0A' },
  { id: 'blood', fg: '#FF4D6D', bg: '#0A0A0A' },
];

export function StylePanel({ config, onChange }: Props) {
  const t = useDict().style;
  const update = (patch: Partial<QRConfig>) => onChange({ ...config, ...patch });

  return (
    <div className="space-y-5">
      <Section title={t.preset}>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const active = config.fgColor === p.fg && config.bgColor === p.bg;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => update({ fgColor: p.fg, bgColor: p.bg })}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border font-mono text-xs uppercase tracking-wider transition ${
                  active
                    ? 'border-[var(--hawk)] text-[var(--hawk)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-hot)] hover:text-white'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-sm border border-[var(--border-hot)]"
                  style={{ background: p.bg }}
                />
                <span
                  className="w-3 h-3 rounded-sm border border-[var(--border-hot)]"
                  style={{ background: p.fg }}
                />
                {t.presets[p.id]}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <ColorPick
            label={t.foreground}
            value={config.fgColor}
            onChange={(fgColor) => update({ fgColor })}
          />
          <ColorPick
            label={t.background}
            value={config.bgColor}
            onChange={(bgColor) => update({ bgColor })}
          />
        </div>
      </Section>

      <Section title={t.dotStyle}>
        <Pills
          options={DOT_STYLES}
          labels={t.dotStyles}
          value={config.dotStyle}
          onChange={(dotStyle) => update({ dotStyle })}
        />
      </Section>

      <Section title={t.cornerSquares}>
        <Pills
          options={CORNER_SQUARE}
          labels={t.cornerSquareStyles}
          value={config.cornerSquareStyle}
          onChange={(cornerSquareStyle) => update({ cornerSquareStyle })}
        />
      </Section>

      <Section title={t.cornerDots}>
        <Pills
          options={CORNER_DOT}
          labels={t.cornerDotStyles}
          value={config.cornerDotStyle}
          onChange={(cornerDotStyle) => update({ cornerDotStyle })}
        />
      </Section>

      <Section title={t.padding}>
        <div className="flex items-center gap-3">
          <input
            type="range"
            className="range min-w-0 flex-1"
            min={MARGIN_MIN}
            max={MARGIN_MAX}
            step={2}
            value={config.margin}
            aria-label={t.padding}
            onChange={(e) => update({ margin: clampMargin(Number(e.target.value), config.size) })}
          />
          <span className="font-mono text-xs text-[var(--hawk)] tabular-nums w-14 text-right">
            {interpolate(t.paddingValue, { n: config.margin })}
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-[var(--muted)]">{t.paddingHint}</p>
      </Section>

      <Section title={t.overlay}>
        <OverlayControls overlay={config.overlay} onChange={(overlay) => update({ overlay })} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label">{title}</div>
      {children}
    </div>
  );
}

function Pills<T extends string>({
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
          className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider border transition ${
            value === opt
              ? 'border-[var(--hawk)] text-[var(--hawk)] bg-[rgba(57,255,122,0.06)]'
              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-hot)] hover:text-white'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function ColorPick({
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
          className="w-10 h-10 rounded-md bg-transparent border border-[var(--border)] cursor-pointer"
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

function OverlayControls({
  overlay,
  onChange,
}: {
  overlay: Overlay;
  onChange: (o: Overlay) => void;
}) {
  const t = useDict().style;
  const kind = overlay.kind;

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (src) onChange({ kind: 'image', src });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(['none', 'image', 'text'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              if (k === 'none') onChange({ kind: 'none' });
              else if (k === 'image') onChange({ kind: 'image', src: '' });
              else onChange({ kind: 'text', text: '' });
            }}
            className={`px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider border transition ${
              kind === k
                ? 'border-[var(--hawk)] text-[var(--hawk)] bg-[rgba(57,255,122,0.06)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-hot)] hover:text-white'
            }`}
          >
            {t.overlayKinds[k]}
          </button>
        ))}
      </div>

      {kind === 'image' && (
        <div className="space-y-2">
          {/* Own button: the native file input's text follows the browser's
              language, not the page's. */}
          <label className="field block font-sans cursor-pointer">
            {t.chooseImage}
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="sr-only"
            />
          </label>
          {overlay.kind === 'image' && overlay.src && (
            <div className="flex items-center gap-3">
              <img
                src={overlay.src}
                alt={t.overlayPreviewAlt}
                className="w-12 h-12 rounded-md border border-[var(--border)] object-contain bg-white p-1"
              />
              <button
                type="button"
                onClick={() => onChange({ kind: 'image', src: '' })}
                className="font-mono text-xs text-[var(--danger)] hover:underline"
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>
      )}

      {kind === 'text' && overlay.kind === 'text' && (
        <div>
          <input
            type="text"
            maxLength={6}
            value={overlay.text}
            onChange={(e) => onChange({ kind: 'text', text: e.target.value })}
            className="field"
            placeholder={t.textPlaceholder}
          />
          <p className="mt-1 font-mono text-xs text-[var(--muted)]">{t.textHint}</p>
        </div>
      )}

      {kind === 'none' && (
        <p className="font-mono text-xs text-[var(--muted)]">{t.noneHint}</p>
      )}
    </div>
  );
}
