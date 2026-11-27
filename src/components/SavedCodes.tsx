'use client';

import { useRef, useState } from 'react';
import { useDict, useLocale } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';
import { saveBlob, type CaptionConfig } from '@/lib/caption';
import { makeThumbnail, shrinkLogo } from '@/lib/code-thumbnail';
import { encodeContent, type ContentState } from '@/lib/content';
import type { QRConfig } from '@/lib/qr';
import { useSavedCodes } from '@/lib/use-saved-codes';
import {
  MAX_CODES,
  createSavedCode,
  mergeSavedCodes,
  parseSavedCodes,
  serializeSavedCodes,
  type SavedCode,
} from '@/lib/saved-codes';

interface Props {
  content: ContentState;
  config: QRConfig;
  caption: CaptionConfig;
  defaultName: string;
  onLoad: (code: SavedCode) => void;
}

type Notice = { tone: 'ok' | 'error'; text: string };

/** Save, reload, delete, back up and restore designs. Everything stays in this browser. */
export function SavedCodes({ content, config, caption, defaultName, onLoad }: Props) {
  const t = useDict().saved;
  const locale = useLocale();
  const { codes, available, store } = useSavedCodes();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);

  const persist = (next: SavedCode[]): boolean => {
    const result = store(next);
    if (!result.ok) {
      setNotice({ tone: 'error', text: result.reason === 'full' ? t.full : t.blocked });
      return false;
    }
    return true;
  };

  const save = async () => {
    if (codes.length >= MAX_CODES) {
      setNotice({ tone: 'error', text: interpolate(t.limit, { n: MAX_CODES }) });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const overlay = config.overlay;
      const logo = overlay.kind === 'image' ? await shrinkLogo(overlay.src) : '';
      const logoDropped = overlay.kind === 'image' && overlay.src !== '' && logo === '';
      const storedConfig: QRConfig = {
        ...config,
        data: encodeContent(content),
        overlay: overlay.kind === 'image' ? { kind: 'image', src: logo } : overlay,
      };
      // The thumbnail is an image of the QR, so it must not carry the Wi-Fi password either.
      const publicContent = { ...content, wifi: { ...content.wifi, password: '' } };
      const thumb = await makeThumbnail({ ...storedConfig, data: encodeContent(publicContent) }, caption);
      const record = createSavedCode({
        id: crypto.randomUUID(),
        name: name.trim() || defaultName,
        now: Date.now(),
        thumb,
        content,
        config: storedConfig,
        caption,
      });
      if (persist([record, ...codes])) {
        setName('');
        setNotice({ tone: 'ok', text: logoDropped ? `${t.saved} ${t.logoDropped}` : t.saved });
      }
    } catch {
      setNotice({ tone: 'error', text: t.saveFailed });
    } finally {
      setBusy(false);
    }
  };

  const remove = (id: string) => {
    setNotice(null);
    persist(codes.filter((c) => c.id !== id));
  };

  const exportBackup = () => {
    saveBlob(new Blob([serializeSavedCodes(codes)], { type: 'application/json' }), 'qrc-gen-codes.json');
  };

  const importBackup = async (file: File) => {
    const imported = parseSavedCodes(await file.text());
    if (imported.length === 0) {
      setNotice({ tone: 'error', text: t.importError });
      return;
    }
    const merged = mergeSavedCodes(codes, imported);
    if (persist(merged)) {
      setNotice({ tone: 'ok', text: interpolate(t.imported, { n: merged.length - codes.length }) });
    }
  };

  const formatDate = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  return (
    <div className="space-y-4">
      {!available && (
        <p role="alert" className="text-xs text-[var(--danger)]">
          {t.blocked}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
        <div className="flex-1">
          <label className="label" htmlFor="saved-name">
            {t.nameLabel}
          </label>
          <input
            id="saved-name"
            className="field"
            maxLength={60}
            value={name}
            placeholder={defaultName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary min-h-10"
          disabled={busy || !available}
          onClick={save}
        >
          {t.save}
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">
        {t.privacyNote}
        {content.type === 'wifi' ? ` ${t.wifiNotice}` : ''}
      </p>

      {notice && (
        <p
          role={notice.tone === 'error' ? 'alert' : 'status'}
          className={`text-xs ${notice.tone === 'error' ? 'text-[var(--danger)]' : 'text-[var(--hawk)]'}`}
        >
          {notice.text}
        </p>
      )}

      {codes.length === 0 ? (
        <p className="text-xs text-[var(--muted)]">{t.empty}</p>
      ) : (
        <ul className="space-y-2">
          {codes.map((code) => (
            <li
              key={code.id}
              className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-2"
            >
              {code.thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={code.thumb}
                  alt=""
                  width={48}
                  className="h-auto w-12 rounded-md border border-[var(--control-border)] bg-white"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-[var(--foreground)]">{code.name}</div>
                <div className="text-xs text-[var(--muted)]">{formatDate.format(code.createdAt)}</div>
              </div>
              <button
                type="button"
                className="btn btn-ghost min-h-10"
                aria-label={interpolate(t.loadAria, { name: code.name })}
                onClick={() => onLoad(code)}
              >
                {t.load}
              </button>
              <button
                type="button"
                className="btn btn-ghost min-h-10 text-[var(--danger)]"
                aria-label={interpolate(t.deleteAria, { name: code.name })}
                onClick={() => remove(code.id)}
              >
                {t.delete}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-ghost min-h-10"
          disabled={codes.length === 0}
          onClick={exportBackup}
        >
          {t.exportBackup}
        </button>
        <label className="btn btn-ghost min-h-10 cursor-pointer">
          {t.importBackup}
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importBackup(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
