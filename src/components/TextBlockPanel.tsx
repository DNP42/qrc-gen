'use client';

import { useDict } from '@/i18n/I18nProvider';
import {
  CAPTION_FONTS,
  CAPTION_MAX_LENGTH,
  CAPTION_MAX_LINES,
  FONT_SIZE_MIN,
  type CaptionAlign,
  type CaptionFontId,
  type TextBlockConfig,
} from '@/lib/caption';
import { NumberStepper } from './NumberStepper';
import { ColorPick, Pills } from './controls';

const ALIGNS: CaptionAlign[] = ['left', 'center', 'right'];
const FONT_LABELS = Object.fromEntries(CAPTION_FONTS.map((f) => [f.id, f.label])) as Record<
  CaptionFontId,
  string
>;

interface Props {
  id: string;
  block: TextBlockConfig;
  onChange: (next: TextBlockConfig) => void;
  textLabel: string;
  placeholder: string;
  rows: number;
  sizeMax: number;
  /** Color shown while the block follows the QR colors. */
  followColor: string;
}

/** Text, font, size, alignment and color of one block (title or caption). */
export function TextBlockPanel({
  id,
  block,
  onChange,
  textLabel,
  placeholder,
  rows,
  sizeMax,
  followColor,
}: Props) {
  const t = useDict().textBlock;
  const update = (patch: Partial<TextBlockConfig>) => onChange({ ...block, ...patch });

  return (
    <div className="space-y-5">
      <div>
        <label className="label" htmlFor={id}>
          {textLabel}
        </label>
        <textarea
          id={id}
          className="field resize-y"
          rows={rows}
          maxLength={CAPTION_MAX_LENGTH}
          value={block.text}
          placeholder={placeholder}
          onChange={(e) =>
            update({ text: e.target.value.split('\n').slice(0, CAPTION_MAX_LINES).join('\n') })
          }
        />
        <p className="mt-2 text-xs text-[var(--muted)]">{t.hint}</p>
      </div>

      <div>
        <div className="label">{t.font}</div>
        <Pills
          options={CAPTION_FONTS.map((f) => f.id)}
          labels={FONT_LABELS}
          value={block.font}
          onChange={(font) => update({ font })}
        />
      </div>

      <div>
        <div className="label">{t.size}</div>
        <NumberStepper
          value={block.size}
          min={FONT_SIZE_MIN}
          max={sizeMax}
          label={t.size}
          onChange={(size) => update({ size })}
        />
      </div>

      <div>
        <div className="label">{t.align}</div>
        <Pills
          options={ALIGNS}
          labels={t.aligns}
          value={block.align}
          onChange={(align) => update({ align })}
        />
      </div>

      <div>
        <ColorPick
          label={t.color}
          value={block.color ?? followColor}
          onChange={(color) => update({ color })}
        />
        {block.color !== null && (
          <button
            type="button"
            onClick={() => update({ color: null })}
            className="mt-2 min-h-10 font-mono text-xs text-[var(--hawk)] hover:underline"
          >
            {t.resetColor}
          </button>
        )}
      </div>
    </div>
  );
}
