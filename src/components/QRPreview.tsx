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
    <div className="flex flex-col items-center">
      {/* box-content: the canvas is exactly config.size. A border-box of that
          width would shrink the content box by the stroke, and overflow-hidden
          would clip the canvas over the border. hawk-dim reads on the dark card;
          --border (#1f1f1f) does not. */}
      <div
        ref={containerRef}
        className="box-content flex items-center justify-center rounded-lg overflow-hidden border border-[var(--hawk-dim)] shadow-[0_0_28px_rgba(57,255,122,0.16)]"
        style={{ width: config.size, height: config.size, background: config.bgColor }}
      />
    </div>
  );
});
