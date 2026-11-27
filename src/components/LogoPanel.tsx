'use client';

import { useDict } from '@/i18n/I18nProvider';
import { IMAGE_MARGIN_MAX, IMAGE_MARGIN_MIN, type Overlay, type QRConfig } from '@/lib/qr';
import { NumberStepper } from './NumberStepper';

interface Props {
  config: QRConfig;
  onChange: (next: QRConfig) => void;
}

/** What sits in the middle of the code: nothing, an image or SVG logo, or short text. */
export function LogoPanel({ config, onChange }: Props) {
  const t = useDict().style;
  return (
    <div className="space-y-3">
      <OverlayControls
        overlay={config.overlay}
        onChange={(overlay) => onChange({ ...config, overlay })}
      />
      {config.overlay.kind !== 'none' && (
        <div>
          <div className="label">{t.imageMargin}</div>
          <NumberStepper
            value={config.imageMargin}
            min={IMAGE_MARGIN_MIN}
            max={IMAGE_MARGIN_MAX}
            label={t.imageMargin}
            onChange={(imageMargin) => onChange({ ...config, imageMargin })}
          />
        </div>
      )}
    </div>
  );
}

function OverlayControls({
  overlay,
  onChange,
}: {
  overlay: Overlay;
  onChange: (o: Overlay) => void;
}) {
  const t = useDict().style;
  const kind = overlay.kind;

  const handleFile = async (file: File) => {
    if (file.type === 'image/svg+xml') {
      // Keep the logo a vector. An SVG without width/height has no intrinsic
      // size, so canvas drawImage renders it blank or blurry in some browsers.
      const src = await svgToSizedDataUrl(file);
      if (src) onChange({ kind: 'image', src });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const src = typeof reader.result === 'string' ? reader.result : '';
      if (src) onChange({ kind: 'image', src });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {(['none', 'image', 'text'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              if (k === 'none') onChange({ kind: 'none' });
              else if (k === 'image') onChange({ kind: 'image', src: '' });
              else onChange({ kind: 'text', text: '' });
            }}
            className={`px-3 py-1.5 min-h-10 rounded-md font-mono text-xs uppercase tracking-wider border transition ${
              kind === k
                ? 'border-[var(--hawk)] text-[var(--hawk)] bg-[rgba(57,255,122,0.06)]'
                : 'border-[var(--control-border)] text-[var(--muted)] hover:border-[var(--hawk)] hover:text-white'
            }`}
          >
            {t.overlayKinds[k]}
          </button>
        ))}
      </div>

      {kind === 'image' && (
        <div className="space-y-2">
          {/* Own button: the native file input's text follows the browser's
              language, not the page's. */}
          <label className="field block font-sans cursor-pointer">
            {t.chooseImage}
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="sr-only"
            />
          </label>
          {overlay.kind === 'image' && overlay.src && (
            <div className="flex items-center gap-3">
              <img
                src={overlay.src}
                alt={t.overlayPreviewAlt}
                className="w-12 h-12 rounded-md border border-[var(--border)] object-contain bg-white p-1"
              />
              <button
                type="button"
                onClick={() => onChange({ kind: 'image', src: '' })}
                className="font-mono text-xs text-[var(--danger)] hover:underline"
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>
      )}

      {kind === 'text' && overlay.kind === 'text' && (
        <div>
          <input
            type="text"
            maxLength={6}
            value={overlay.text}
            onChange={(e) => onChange({ kind: 'text', text: e.target.value })}
            className="field"
            placeholder={t.textPlaceholder}
          />
          <p className="mt-1 font-mono text-xs text-[var(--muted)]">{t.textHint}</p>
        </div>
      )}

      {kind === 'none' && (
        <p className="font-mono text-xs text-[var(--muted)]">{t.noneHint}</p>
      )}
    </div>
  );
}

/** Returns a data URL for the SVG with explicit width/height, or '' if it is not a valid SVG. */
async function svgToSizedDataUrl(file: File): Promise<string> {
  const doc = new DOMParser().parseFromString(await file.text(), 'image/svg+xml');
  const root = doc.documentElement;
  if (root.nodeName !== 'svg' || doc.querySelector('parsererror')) return '';
  // Scripts and event handlers never run inside <img>, but strip them so the
  // file stays inert if it is ever embedded in the downloaded SVG.
  doc.querySelectorAll('script, foreignObject').forEach((el) => el.remove());
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name);
    }
  });
  const hasSize = (name: string) => /^[\d.]+(px)?$/.test(root.getAttribute(name) ?? '');
  if (!hasSize('width') || !hasSize('height')) {
    const [, , vbW, vbH] = (root.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
    const width = vbW > 0 ? vbW : 512;
    const height = vbH > 0 ? vbH : 512;
    root.setAttribute('width', String(width));
    root.setAttribute('height', String(height));
    if (!root.getAttribute('viewBox')) root.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
  const xml = new XMLSerializer().serializeToString(root);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}
