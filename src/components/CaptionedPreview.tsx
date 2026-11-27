'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  activeFontIds,
  computeLayout,
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

/** Radius as a share of the box, so rounded corners keep their shape when the preview shrinks. */
const percentRadius = (radius: number, w: number, h: number) =>
  radius > 0 ? `${(radius / w) * 100}% / ${(radius / h) * 100}%` : undefined;

/**
 * Positions the QR preview inside the caption layout and paints the frame and
 * text over it. The wrapper is always rendered, with or without text, so
 * adding a title never remounts (and so never blanks) the QR preview.
 */
export function CaptionedPreview({ config, caption, children }: Props) {
  const fontKey = activeFontIds(caption).join(',');
  // Bumped when a font file has landed; the layout re-measures with the real font.
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!fontKey) return;
    let live = true;
    Promise.all((fontKey.split(',') as CaptionFontId[]).map(loadCaptionFont))
      .then(() => live && setLoaded((n) => n + 1))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [fontKey]);

  const layout = useMemo(
    () => computeLayout(config, caption),
    // `loaded` forces a re-measure once the real font replaces the fallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.size, config.margin, config.fgColor, config.bgColor, caption, loaded],
  );

  const pct = (n: number, of: number) => `${(n / of) * 100}%`;

  return (
    <div
      className={`relative mx-auto min-w-0 max-w-full ${layout.active ? 'qr-captioned' : ''}`}
      style={{
        width: layout.w,
        aspectRatio: `${layout.w} / ${layout.h}`,
        filter: layout.framePath ? 'drop-shadow(0 0 14px rgba(57,255,122,0.16))' : undefined,
        background: layout.plateColor ?? undefined,
        borderRadius: layout.plateColor
          ? percentRadius(layout.outerRadius, layout.w, layout.h)
          : undefined,
        overflow: layout.plateColor ? 'hidden' : undefined,
      }}
    >
      <div
        className="absolute"
        style={{
          left: pct(layout.qrX, layout.w),
          top: pct(layout.qrY, layout.h),
          width: pct(layout.qrSize, layout.w),
          borderRadius: percentRadius(layout.qrRadius, layout.qrSize, layout.qrSize),
          overflow: layout.qrRadius > 0 ? 'hidden' : undefined,
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
