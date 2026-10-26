'use client';

import { useState } from 'react';
import { useDict } from '@/i18n/I18nProvider';
import type { QRPreviewHandle } from './QRPreview';

interface Props {
  previewRef: React.RefObject<QRPreviewHandle | null>;
  defaultName: string;
}

export function DownloadBar({ previewRef, defaultName }: Props) {
  const t = useDict().download;
  const fallbackName = t.defaultNames.url;
  const [name, setName] = useState(defaultName);

  const safe = name.trim().replace(/[^a-zA-Z0-9_\-]/g, '-') || fallbackName;

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
        onClick={() => previewRef.current?.download('png', safe)}
      >
        ↓ PNG
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        aria-label={t.svg}
        onClick={() => previewRef.current?.download('svg', safe)}
      >
        ↓ SVG
      </button>
    </div>
  );
}
