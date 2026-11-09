'use client';

import { useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';
import { playSuccess } from '@/lib/sound';
import type { QRPreviewHandle } from './QRPreview';

interface Props {
  previewRef: React.RefObject<QRPreviewHandle | null>;
  defaultName: string;
}

export function DownloadBar({ previewRef, defaultName }: Props) {
  const t = useDict().download;
  const fallbackName = t.defaultNames.url;
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState('');

  // Drop combining marks first so č/š/ž become c/s/z ("račun" -> "racun")
  // instead of "-" ("ra-un"); anything still outside ASCII becomes "-".
  const safe =
    name
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_\-]/g, '-') || fallbackName;

  const download = (ext: 'png' | 'svg') => {
    previewRef.current?.download(ext, safe);
    setStatus(interpolate(t.done, { name: safe, ext }));
    playSuccess();
  };

  return (
    <div>
    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
      <div className="flex-1">
        <label className="label" htmlFor="download-name">{t.filename}</label>
        <input
          id="download-name"
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
    </div>
    <p role="status" className="mt-3 min-h-8 font-mono text-sm text-[var(--muted)]">
      {status}
    </p>
    </div>
  );
}
