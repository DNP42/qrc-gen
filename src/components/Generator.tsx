'use client';

import dynamic from 'next/dynamic';
import { useMemo, useRef, useState } from 'react';
import { ContentTabs } from '@/components/ContentTabs';
import { Card } from '@/components/Card';
import { DesignPanel } from '@/components/DesignPanel';
import { LogoPanel } from '@/components/LogoPanel';
import { TextBlockPanel } from '@/components/TextBlockPanel';
import { CaptionedPreview } from '@/components/CaptionedPreview';
import { DownloadBar } from '@/components/DownloadBar';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { AffiliateBlock } from '@/components/AffiliateBlock';
import { MoreFrom } from '@/components/MoreFrom';
import { SavedCodes } from '@/components/SavedCodes';
import { SiteFooter } from '@/components/SiteFooter';
import type { QRPreviewHandle } from '@/components/QRPreview';
import { useDict } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/format';
import {
  CAPTION_SIZE_MAX,
  DEFAULT_CAPTION,
  TITLE_SIZE_MAX,
  type CaptionConfig,
} from '@/lib/caption';
import { DEFAULT_CONTENT, encodeContent, type ContentState } from '@/lib/content';
import { DEFAULT_CONFIG, type QRConfig } from '@/lib/qr';
import type { SavedCode } from '@/lib/saved-codes';
import { useSavedCodes } from '@/lib/use-saved-codes';

const QRPreview = dynamic(
  () => import('@/components/QRPreview').then((m) => m.QRPreview),
  {
    ssr: false,
    loading: () => <PreviewLoading />,
  },
);

export function Generator() {
  const t = useDict();
  const [content, setContent] = useState<ContentState>(DEFAULT_CONTENT);
  const [design, setDesign] = useState<QRConfig>(DEFAULT_CONFIG);
  const [caption, setCaption] = useState<CaptionConfig>(DEFAULT_CAPTION);
  const { codes: savedCodes } = useSavedCodes();
  const previewRef = useRef<QRPreviewHandle | null>(null);

  // The encoded string always follows the Content card; every other setting lives in `design`.
  const config = useMemo(() => ({ ...design, data: encodeContent(content) }), [design, content]);
  const setConfig = (next: QRConfig) => setDesign(next);

  const loadSaved = (code: SavedCode) => {
    setContent(code.content);
    setDesign({ ...code.design, data: DEFAULT_CONFIG.data });
    setCaption(code.caption);
  };

  const filename = t.download.defaultNames[content.type];
  const firstLine = (text: string) => text.trim().split(/\r?\n/)[0] || t.cards.empty;
  const followColor = caption.frame.style === 'bar' ? config.bgColor : config.fgColor;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-lg text-[var(--hawk)] hawk-glow scanline">
              qrc-gen
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] mt-1">
              {t.header.tagline}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <LanguageSwitch />
            <a
              href="https://github.com/hrco/qrc-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--muted)] hover:text-[var(--hawk)] transition-colors"
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
          <p className="mt-3 font-mono text-sm text-[var(--muted)] max-w-2xl">
            {t.hero.intro}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,max-content)]">
          <div className="min-w-0 space-y-8">
            <Card title={t.cards.content} collapsible defaultOpen>
              <ContentTabs value={content} onChange={setContent} />
            </Card>

            <Card title={t.cards.design} collapsible defaultOpen>
              <DesignPanel
                config={config}
                onChange={setConfig}
                frame={caption.frame}
                onFrameChange={(frame) => setCaption((prev) => ({ ...prev, frame }))}
              />
            </Card>

            <Card
              title={t.cards.title}
              collapsible
              defaultOpen={false}
              summary={firstLine(caption.title.text)}
            >
              <TextBlockPanel
                id="caption-title"
                block={caption.title}
                onChange={(title) => setCaption((prev) => ({ ...prev, title }))}
                textLabel={t.title.label}
                placeholder={t.title.placeholder}
                rows={2}
                sizeMax={TITLE_SIZE_MAX}
                followColor={followColor}
              />
            </Card>

            <Card
              title={t.cards.caption}
              collapsible
              defaultOpen={false}
              summary={firstLine(caption.caption.text)}
            >
              <TextBlockPanel
                id="caption-text"
                block={caption.caption}
                onChange={(block) => setCaption((prev) => ({ ...prev, caption: block }))}
                textLabel={t.caption.label}
                placeholder={t.caption.placeholder}
                rows={3}
                sizeMax={CAPTION_SIZE_MAX}
                followColor={followColor}
              />
            </Card>

            <Card
              title={t.cards.logo}
              collapsible
              defaultOpen={false}
              summary={t.style.overlayKinds[config.overlay.kind]}
            >
              <LogoPanel config={config} onChange={setConfig} />
            </Card>

            <Card
              title={t.saved.title}
              collapsible
              defaultOpen={false}
              summary={interpolate(t.saved.count, { n: savedCodes.length })}
            >
              <SavedCodes
                content={content}
                config={config}
                caption={caption}
                defaultName={filename}
                onLoad={loadSaved}
              />
            </Card>
          </div>

          <div className="min-w-0 w-full space-y-6 lg:sticky lg:top-6 lg:self-start">
            <Card title={t.cards.preview}>
              <CaptionedPreview config={config} caption={caption}>
                <QRPreview config={config} ref={previewRef} />
              </CaptionedPreview>
            </Card>

            <Card title={t.cards.export}>
              <DownloadBar previewRef={previewRef} defaultName={filename} config={config} caption={caption} />
            </Card>
          </div>
        </div>
      </main>

      <AffiliateBlock />
      <MoreFrom />

      <SiteFooter />
    </div>
  );
}

function PreviewLoading() {
  const t = useDict();
  return (
    <div
      className="mx-auto box-border flex aspect-square min-w-0 max-w-full items-center justify-center rounded-lg border border-[var(--hawk-dim)] font-mono text-xs text-[var(--muted)] shadow-[0_0_28px_rgba(57,255,122,0.16)]"
      style={{ width: DEFAULT_CONFIG.size }}
    >
      {t.preview.loading}
    </div>
  );
}
