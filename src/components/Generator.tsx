'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { ContentTabs, type ContentType } from '@/components/ContentTabs';
import { StylePanel } from '@/components/StylePanel';
import { DownloadBar } from '@/components/DownloadBar';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { SoundToggle } from '@/components/SoundToggle';
import type { QRPreviewHandle } from '@/components/QRPreview';
import { useDict } from '@/i18n/I18nProvider';
import { DEFAULT_CONFIG, type QRConfig } from '@/lib/qr';

const QRPreview = dynamic(
  () => import('@/components/QRPreview').then((m) => m.QRPreview),
  {
    ssr: false,
    loading: () => <PreviewLoading />,
  },
);

export function Generator() {
  const t = useDict();
  const [config, setConfig] = useState<QRConfig>(DEFAULT_CONFIG);
  const [contentType, setContentType] = useState<ContentType>('url');
  const previewRef = useRef<QRPreviewHandle | null>(null);

  const handleContent = (data: string, type: ContentType) => {
    setConfig((prev) => ({ ...prev, data }));
    setContentType(type);
  };

  const filename = t.download.defaultNames[contentType];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="font-mono text-lg font-bold text-[var(--hawk)] scanline">
              qrc-gen
            </h1>
            <p className="font-mono text-sm text-[var(--muted)]">
              {t.header.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <LanguageSwitch />
            <SoundToggle />
            <a
              href="https://github.com/hrco/qrc-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center font-mono text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              {t.header.github}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {t.hero.title}{' '}
            <span className="text-[var(--muted)]">{t.hero.titleMuted}</span>
          </h2>
          <p className="mt-3 font-mono text-base text-[var(--muted)] max-w-[65ch]">
            {t.hero.intro}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,max-content)]">
          <div className="min-w-0 space-y-8">
            <Card title={t.cards.content}>
              <ContentTabs onChange={handleContent} />
            </Card>

            <Card title={t.cards.style}>
              <StylePanel config={config} onChange={setConfig} />
            </Card>
          </div>

          <div className="min-w-0 w-full space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card title={t.cards.preview}>
              <QRPreview config={config} ref={previewRef} />
            </Card>

            <Card title={t.cards.export}>
              <DownloadBar previewRef={previewRef} defaultName={filename} />
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 font-mono text-sm text-[var(--muted)] flex flex-wrap gap-4 items-center justify-between">
          <span>
            {t.footer.builtBy}{' '}
            <span className="font-semibold text-[var(--foreground)]">SpectreHawk</span>
          </span>
          <span>
            {t.footer.poweredBy}{' '}
            <a
              href="https://github.com/kozakdenys/qr-code-styling"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[var(--foreground)]"
            >
              qr-code-styling
            </a>
          </span>
          <a
            href="https://ko-fi.com/smokrates"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {t.footer.kofi}
          </a>
        </div>
      </footer>
    </div>
  );
}

function PreviewLoading() {
  const t = useDict();
  return (
    <div
      className="mx-auto box-border flex aspect-square min-w-0 max-w-full items-center justify-center rounded-lg border border-[var(--border)] font-mono text-sm text-[var(--muted)]"
      style={{ width: DEFAULT_CONFIG.size }}
    >
      {t.preview.loading}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rise-in min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="font-mono text-base font-semibold text-[var(--foreground)] mb-4">
        {title}
      </h3>
      {children}
    </section>
  );
}
