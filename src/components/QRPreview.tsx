'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { buildOptions, textToImage, type QRConfig } from '@/lib/qr';

export interface QRPreviewHandle {
  download: (extension: 'png' | 'svg', filename: string) => void;
}

interface Props {
  config: QRConfig;
}

export const QRPreview = forwardRef<QRPreviewHandle, Props>(function QRPreview(
  { config },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const overlayImage =
      config.overlay.kind === 'image'
        ? config.overlay.src
        : config.overlay.kind === 'text'
        ? textToImage(config.overlay.text, config.fgColor, config.bgColor)
        : undefined;

    const options = buildOptions(config, overlayImage || undefined);

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.replaceChildren();
        qrRef.current.append(containerRef.current);
      }
    } else {
      qrRef.current.update(options);
    }
  }, [config]);

  useImperativeHandle(ref, () => ({
    download(extension, filename) {
      if (!qrRef.current) return;
      qrRef.current.download({ name: filename, extension });
    },
  }));

  return (
    // Border lives inside the width (border-box) and the canvas fills that
    // content box. A content-box of config.size plus the stroke made the card
    // wider than the page, so the right edge ran off the screen.
    <div
      ref={containerRef}
      className="qr-frame mx-auto box-border aspect-square min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--hawk-dim)] shadow-[0_0_28px_rgba(57,255,122,0.16)]"
      style={{ width: config.size, background: config.bgColor }}
    />
  );
});
