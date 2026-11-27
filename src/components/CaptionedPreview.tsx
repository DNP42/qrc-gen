'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  computeLayout,
  isCaptionActive,
  loadCaptionFont,
  type CaptionConfig,
  type CaptionFontId,
} from '@/lib/caption';
import type { QRConfig } from '@/lib/qr';

interface Props {
  config: QRConfig;
  caption: CaptionConfig;
  children: React.ReactNode;
}

/**
 * Positions the QR preview inside the caption layout and paints the caption
 * layer over it. The wrapper is always rendered, caption or not, so toggling
 * a caption never remounts (and so never blanks) the QR preview.
 */
export function CaptionedPreview({ config, caption, children }: Props) {
  const active = isCaptionActive(caption);
  // Font whose file has landed; the layout re-measures when it changes.
  const [ready, setReady] = useState<CaptionFontId | null>(null);

  useEffect(() => {
    if (!active) return;
    let live = true;
    loadCaptionFont(caption.font)
      .then(() => live && setReady(caption.font))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [active, caption.font]);

  const layout = useMemo(
    () => computeLayout(config, caption),
    // `ready` forces a re-measure once the real font replaces the fallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.size, config.fgColor, config.bgColor, caption, ready],
  );

  const pct = (n: number, of: number) => `${(n / of) * 100}%`;

  return (
    <div
      className={`relative mx-auto min-w-0 max-w-full ${layout.active ? 'qr-captioned' : ''}`}
      style={{
        width: layout.w,
        aspectRatio: `${layout.w} / ${layout.h}`,
        filter: layout.framePath ? 'drop-shadow(0 0 14px rgba(57,255,122,0.16))' : undefined,
      }}
    >
      <div
        className="absolute"
        style={{
          left: pct(layout.qrX, layout.w),
          top: pct(layout.qrY, layout.h),
          width: pct(layout.qrSize, layout.w),
        }}
      >
        {children}
      </div>
      {layout.active && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          aria-hidden="true"
        >
          {layout.strips.map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.color} />
          ))}
          {layout.framePath && (
            <path d={layout.framePath} fill={layout.frameColor} fillRule="evenodd" />
          )}
          {layout.blocks.map((t, b) =>
            t.lines.map((l, i) => (
              <text
                key={`${b}-${i}`}
                x={t.x}
                y={l.y}
                textAnchor={t.anchor}
                fontFamily={`${t.family}, sans-serif`}
                fontWeight={t.weight}
                fontSize={t.size}
                fill={t.color}
              >
                {l.str}
              </text>
            )),
          )}
        </svg>
      )}
    </div>
  );
}
