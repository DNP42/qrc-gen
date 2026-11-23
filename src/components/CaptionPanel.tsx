'use client';

import { useDict } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';
import {
  CAPTION_FONTS,
  CAPTION_MAX_LENGTH,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type CaptionAlign,
  type CaptionConfig,
  type CaptionFontId,
  type CaptionPosition,
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
const POSITIONS: CaptionPosition[] = ['below', 'above'];
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
        <label className="label" htmlFor="caption-text">
          {t.text}
        </label>
        <input
          id="caption-text"
          type="text"
          className="field"
          maxLength={CAPTION_MAX_LENGTH}
          value={caption.text}
          placeholder={t.placeholder}
          onChange={(e) => update({ text: e.target.value })}
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
            <div className="label">{t.position}</div>
            <Pills
              options={POSITIONS}
              labels={t.positions}
              value={caption.position}
              onChange={(position) => update({ position })}
            />
          </div>

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
