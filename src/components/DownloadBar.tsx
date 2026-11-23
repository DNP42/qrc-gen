'use client';

import { useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import { captionedPng, captionedSvg, isCaptionActive, saveBlob, type CaptionConfig } from '@/lib/caption';
import type { QRConfig } from '@/lib/qr';
import type { QRPreviewHandle } from './QRPreview';

interface Props {
  previewRef: React.RefObject<QRPreviewHandle | null>;
  defaultName: string;
  config: QRConfig;
  caption: CaptionConfig;
}

export function DownloadBar({ previewRef, defaultName, config, caption }: Props) {
  const t = useDict().download;
  const fallbackName = t.defaultNames.url;
  const [name, setName] = useState(defaultName);
  const [failed, setFailed] = useState(false);

  // Drop combining marks first so č/š/ž become c/s/z ("račun" -> "racun")
  // instead of "-" ("ra-un"); anything still outside ASCII becomes "-".
  const safe =
    name
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '-') || fallbackName;

  // No caption: the original download path, untouched. With a caption the
  // composite is built from a fresh QR render plus the caption layout.
  const download = async (ext: 'png' | 'svg') => {
    setFailed(false);
    if (!isCaptionActive(caption)) {
      previewRef.current?.download(ext, safe);
      return;
    }
    try {
      const blob = ext === 'png' ? await captionedPng(config, caption) : await captionedSvg(config, caption);
      saveBlob(blob, `${safe}.${ext}`);
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
      <div className="flex-1">
        <label className="label">{t.filename}</label>
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={fallbackName}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        aria-label={t.png}
        onClick={() => download('png')}
      >
        ↓ PNG
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        aria-label={t.svg}
        onClick={() => download('svg')}
      >
        ↓ SVG
      </button>
      {failed && (
        <p role="alert" className="font-mono text-xs text-[var(--danger)] sm:basis-full">
          {t.captionError}
        </p>
      )}
    </div>
  );
}
