'use client';

import { useDict } from '@/i18n/I18nProvider';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { RADIUS_MAX, RADIUS_MIN, type FrameConfig, type FrameStyle } from '@/lib/caption';
import {
  MARGIN_MAX,
  MARGIN_MIN,
  clampMargin,
  type CornerDotStyle,
  type CornerSquareStyle,
  type DotStyle,
  type QRConfig,
} from '@/lib/qr';
import { NumberStepper } from './NumberStepper';
import { ColorPick, Pills, Section } from './controls';

interface Props {
  config: QRConfig;
  onChange: (next: QRConfig) => void;
  frame: FrameConfig;
  onFrameChange: (next: FrameConfig) => void;
}

const DOT_STYLES: DotStyle[] = ['rounded', 'square', 'dots', 'classy', 'classy-rounded', 'extra-rounded'];
const CORNER_SQUARE: CornerSquareStyle[] = ['extra-rounded', 'square', 'dot'];
const CORNER_DOT: CornerDotStyle[] = ['dot', 'square'];
const FRAME_STYLES: FrameStyle[] = ['bar', 'plain'];

type PresetId = keyof Dictionary['style']['presets'];

const PRESETS: Array<{ id: PresetId; fg: string; bg: string }> = [
  { id: 'hawk', fg: '#39FF7A', bg: '#0A0A0A' },
  { id: 'mono', fg: '#EDEDED', bg: '#0A0A0A' },
  { id: 'inverted', fg: '#0A0A0A', bg: '#EDEDED' },
  { id: 'cyan', fg: '#00E5FF', bg: '#0A0A0A' },
  { id: 'amber', fg: '#FFB400', bg: '#0A0A0A' },
  { id: 'blood', fg: '#FF4D6D', bg: '#0A0A0A' },
];

/** Colors, dot and corner styles, padding and the frame around the code. */
export function DesignPanel({ config, onChange, frame, onFrameChange }: Props) {
  const t = useDict().style;
  const f = useDict().frame;
  const update = (patch: Partial<QRConfig>) => onChange({ ...config, ...patch });
  const updateFrame = (patch: Partial<FrameConfig>) => onFrameChange({ ...frame, ...patch });

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
                className={`flex items-center gap-2 px-3 py-2 min-h-10 rounded-md border font-mono text-xs uppercase tracking-wider transition ${
                  active
                    ? 'border-[var(--hawk)] text-[var(--hawk)]'
                    : 'border-[var(--control-border)] text-[var(--muted)] hover:border-[var(--hawk)] hover:text-white'
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

      <Section title={t.gradient}>
        <label className="flex items-center gap-2 font-mono text-xs text-[var(--foreground)] cursor-pointer min-h-10">
          <input
            type="checkbox"
            checked={config.gradient.enabled}
            onChange={(e) => update({ gradient: { ...config.gradient, enabled: e.target.checked } })}
            className="w-4 h-4 accent-[var(--hawk)]"
          />
          {t.gradientOn}
        </label>
        {config.gradient.enabled && (
          <div className="mt-3 space-y-3">
            <Pills
              options={['linear', 'radial'] as const}
              labels={t.gradientTypes}
              value={config.gradient.type}
              onChange={(type) => update({ gradient: { ...config.gradient, type } })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColorPick
                label={t.gradientFrom}
                value={config.gradient.from}
                onChange={(from) => update({ gradient: { ...config.gradient, from } })}
              />
              <ColorPick
                label={t.gradientTo}
                value={config.gradient.to}
                onChange={(to) => update({ gradient: { ...config.gradient, to } })}
              />
            </div>
            <p className="text-xs text-[var(--muted)]">{t.gradientHint}</p>
          </div>
        )}
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
        <NumberStepper
          value={config.margin}
          min={MARGIN_MIN}
          max={Math.min(MARGIN_MAX, Math.floor(config.size / 4))}
          step={2}
          label={t.padding}
          onChange={(margin) => update({ margin: clampMargin(margin, config.size) })}
        />
        <p className="mt-2 text-xs text-[var(--muted)]">{t.paddingHint}</p>
      </Section>

      <Section title={f.style}>
        <Pills
          options={FRAME_STYLES}
          labels={f.styles}
          value={frame.style}
          onChange={(style) => updateFrame({ style })}
        />
        {frame.style === 'bar' && (
          <div className="mt-3">
            <ColorPick
              label={f.barColor}
              value={frame.barColor ?? config.fgColor}
              onChange={(barColor) => updateFrame({ barColor })}
            />
            {frame.barColor !== null && (
              <button
                type="button"
                onClick={() => updateFrame({ barColor: null })}
                className="mt-2 min-h-10 font-mono text-xs text-[var(--hawk)] hover:underline"
              >
                {f.resetColor}
              </button>
            )}
          </div>
        )}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="label">{f.outerRadius}</div>
            <NumberStepper
              value={frame.outerRadius}
              min={RADIUS_MIN}
              max={RADIUS_MAX}
              label={f.outerRadius}
              onChange={(outerRadius) => updateFrame({ outerRadius })}
            />
          </div>
          <div>
            <div className="label">{f.innerRadius}</div>
            <NumberStepper
              value={frame.innerRadius}
              min={RADIUS_MIN}
              max={RADIUS_MAX}
              label={f.innerRadius}
              onChange={(innerRadius) => updateFrame({ innerRadius })}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{f.hint}</p>
      </Section>
    </div>
  );
}
