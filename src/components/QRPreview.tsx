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

/**
 * Double-buffered preview. qr-code-styling's update() empties its container
 * and redraws, and a center image loads asynchronously, so drawing straight
 * into the visible node flashes blank while a slider is dragged. The library
 * instance therefore lives in a detached stage; its canvas is copied into the
 * visible canvas only once drawn. Renders are coalesced to one per frame.
 */
export const QRPreview = forwardRef<QRPreviewHandle, Props>(function QRPreview(
  { config },
  ref,
) {
  const visibleRef = useRef<HTMLCanvasElement | null>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const latestRef = useRef<QRConfig>(config);
  const frameRef = useRef<number | null>(null);
  const settleRef = useRef<number | null>(null);
  const tokenRef = useRef(0);

  /** True once the library has painted something (the background fill counts). */
  const isDrawn = (c: HTMLCanvasElement) => {
    if (!c.width || !c.height) return false;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) return false;
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 4; j++) {
        const px = ctx.getImageData(Math.floor((c.width * i) / 5), Math.floor((c.height * j) / 5), 1, 1).data;
        if (px[3] !== 0) return true;
      }
    }
    return false;
  };

  const copyToVisible = () => {
    const visible = visibleRef.current;
    const source = stageRef.current?.querySelector('canvas');
    if (!visible || !source || !isDrawn(source)) return;
    if (visible.width !== source.width) visible.width = source.width;
    if (visible.height !== source.height) visible.height = source.height;
    // Assigning width clears the canvas, so draw straight after a resize only.
    visible.getContext('2d')?.drawImage(source, 0, 0);
  };

  /**
   * The library paints asynchronously (always for a center image, and on some
   * loads for plain codes too). Retry the copy each frame for about half a
   * second; an undrawn stage is never copied, so the visible canvas keeps the
   * last good frame and is never blank.
   */
  const pump = (token: number, left: number) => {
    if (token !== tokenRef.current) return;
    const stage = stageRef.current;
    if (stage && !stage.querySelector('canvas')) qrRef.current?.append(stage);
    copyToVisible();
    if (left > 0) requestAnimationFrame(() => pump(token, left - 1));
  };

  const render = () => {
    frameRef.current = null;
    const cfg = latestRef.current;
    const overlayImage =
      cfg.overlay.kind === 'image'
        ? cfg.overlay.src
        : cfg.overlay.kind === 'text'
        ? textToImage(cfg.overlay.text, cfg.fgColor, cfg.bgColor)
        : undefined;
    const options = buildOptions(cfg, overlayImage || undefined);

    if (!qrRef.current) {
      stageRef.current = document.createElement('div');
      qrRef.current = new QRCodeStyling(options);
      qrRef.current.append(stageRef.current);
    } else {
      qrRef.current.update(options);
    }

    const token = ++tokenRef.current;
    pump(token, 30);
    if (overlayImage) {
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
      const img = new Image();
      img.onload = img.onerror = () => {
        settleRef.current = window.setTimeout(() => token === tokenRef.current && copyToVisible(), 30);
      };
      img.src = overlayImage;
    }
  };

  useEffect(() => {
    latestRef.current = config;
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(render);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(
    () => () => {
      tokenRef.current++;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (settleRef.current !== null) window.clearTimeout(settleRef.current);
    },
    [],
  );

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
      className="qr-frame mx-auto box-border aspect-square min-w-0 max-w-full overflow-hidden rounded-lg border border-[var(--hawk-dim)] shadow-[0_0_28px_rgba(57,255,122,0.16)]"
      style={{ width: config.size, background: config.bgColor }}
    >
      <canvas ref={visibleRef} width={config.size} height={config.size} />
    </div>
  );
});
