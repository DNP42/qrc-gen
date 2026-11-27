'use client';

import { useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';
import {
  CAPTION_FONTS,
  CAPTION_MAX_LENGTH,
  CAPTION_MAX_LINES,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  TITLE_SIZE_MAX,
  TITLE_SIZE_MIN,
  type CaptionAlign,
  type CaptionConfig,
  type CaptionFontId,
  type CaptionStyle,
} from '@/lib/caption';
import type { QRConfig } from '@/lib/qr';
import { ColorPick, Pills } from './StylePanel';

interface Props {
  config: QRConfig;
  caption: CaptionConfig;
  onChange: (next: CaptionConfig) => void;
}

const STYLES: CaptionStyle[] = ['bar', 'text', 'none'];
const ALIGNS: CaptionAlign[] = ['left', 'center', 'right'];

export function CaptionPanel({ config, caption, onChange }: Props) {
  const t = useDict().caption;
  const update = (patch: Partial<CaptionConfig>) => onChange({ ...caption, ...patch });
  const on = caption.style !== 'none';
  const barDefault = config.fgColor;
  const textDefault = caption.style === 'bar' ? config.bgColor : config.fgColor;
  const customColors = caption.barColor !== null || caption.textColor !== null;

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor="caption-title">
          {t.titleText}
        </label>
        <textarea
          id="caption-title"
          className="field resize-y"
          rows={2}
          maxLength={CAPTION_MAX_LENGTH}
          value={caption.title}
          placeholder={t.titlePlaceholder}
          onChange={(e) =>
            update({ title: e.target.value.split('\n').slice(0, CAPTION_MAX_LINES).join('\n') })
          }
        />
      </div>

      <div>
        <label className="label" htmlFor="caption-text">
          {t.text}
        </label>
        <textarea
          id="caption-text"
          className="field resize-y"
          rows={3}
          maxLength={CAPTION_MAX_LENGTH}
          value={caption.text}
          placeholder={t.placeholder}
          onChange={(e) =>
            update({ text: e.target.value.split('\n').slice(0, CAPTION_MAX_LINES).join('\n') })
          }
        />
        <p className="mt-1 font-mono text-xs text-[var(--muted)]">{t.hint}</p>
      </div>

      <div>
        <div className="label">{t.style}</div>
        <Pills
          options={STYLES}
          labels={t.styles}
          value={caption.style}
          onChange={(style) => update({ style })}
        />
      </div>

      {on && (
        <>
          <div>
            <div className="label">{t.align}</div>
            <Pills
              options={ALIGNS}
              labels={t.aligns}
              value={caption.align}
              onChange={(align) => update({ align })}
            />
          </div>

          <div>
            <div className="label">{t.font}</div>
            <Pills
              options={CAPTION_FONTS.map((f) => f.id)}
              labels={Object.fromEntries(CAPTION_FONTS.map((f) => [f.id, f.label])) as Record<CaptionFontId, string>}
              value={caption.font}
              onChange={(font) => update({ font })}
            />
          </div>

          <div>
            <div className="label">{t.titleSize}</div>
            <SizeStepper
              value={caption.titleSize}
              min={TITLE_SIZE_MIN}
              max={TITLE_SIZE_MAX}
              label={t.titleSize}
              decreaseLabel={t.sizeDown}
              increaseLabel={t.sizeUp}
              unit={t.sizeUnit}
              onChange={(titleSize) => update({ titleSize })}
            />
          </div>

          <div>
            <div className="label">{t.fontSize}</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                className="range min-w-0 flex-1"
                min={FONT_SIZE_MIN}
                max={FONT_SIZE_MAX}
                step={1}
                value={caption.fontSize}
                aria-label={t.fontSize}
                onChange={(e) => update({ fontSize: Number(e.target.value) })}
              />
              <span className="font-mono text-xs text-[var(--hawk)] tabular-nums w-14 text-right">
                {interpolate(t.fontSizeValue, { n: caption.fontSize })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caption.style === 'bar' && (
              <ColorPick
                label={t.barColor}
                value={caption.barColor ?? barDefault}
                onChange={(barColor) => update({ barColor })}
              />
            )}
            <ColorPick
              label={t.textColor}
              value={caption.textColor ?? textDefault}
              onChange={(textColor) => update({ textColor })}
            />
          </div>
          {customColors && (
            <button
              type="button"
              onClick={() => update({ barColor: null, textColor: null })}
              className="font-mono text-xs text-[var(--hawk)] hover:underline min-h-8"
            >
              {t.resetColors}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/** Number box with − / + buttons, like a text editor's size field. */
function SizeStepper({
  value,
  min,
  max,
  label,
  decreaseLabel,
  increaseLabel,
  unit,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  unit: string;
  onChange: (next: number) => void;
}) {
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
  const step = 'btn btn-ghost flex-none !w-10 !px-0 font-mono text-base';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={step}
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        {'−'}
      </button>
      <input
        type="text"
        inputMode="numeric"
        className="field !w-16 flex-none text-center font-mono tabular-nums"
        aria-label={label}
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(clamp(value + 1));
            setDraft(null);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(clamp(value - 1));
            setDraft(null);
          }
        }}
      />
      <button
        type="button"
        className={step}
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        {'+'}
      </button>
      <span className="font-mono text-xs text-[var(--muted)]">{unit}</span>
    </div>
  );
}
